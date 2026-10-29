
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Papa from 'papaparse'

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

        const text = await file.text()
        const { data, errors } = Papa.parse(text, { header: true, skipEmptyLines: true })

        if (errors.length > 0) return NextResponse.json({ error: 'CSV Parse Error', details: errors }, { status: 400 })

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser() // Recruiter

        // Mock processing: iterate and create placeholder users/resumes
        // In real app: check for dupes, invite via email, etc.

        const candidates = (data as any[]).map(row => ({
            email: row.Email || row.email,
            full_name: row.Name || row.name,
            skills: (row.Skills || row.skills || '').split(',').map((s: string) => s.trim())
        }))

        // For MVP, just return the parsed candidates
        return NextResponse.json({ success: true, count: candidates.length, candidates })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
