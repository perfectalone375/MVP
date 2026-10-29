
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Papa from 'papaparse'

export async function GET(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // Fetch applications for this recruiter's jobs
        const { data: applications, error } = await supabase
            .from('applications')
            .select(`
        status,
        match_score,
        created_at,
        jobs (title),
        users (email, full_name)
      `)
        // .eq('jobs.recruiter_id', user.id) // Needs proper join filtering or RLS

        if (error) throw error

        // Flatten data for CSV
        const csvData = applications.map((app: any) => ({
            Job: app.jobs?.title,
            Candidate: app.users?.full_name,
            Email: app.users?.email,
            Status: app.status,
            Score: app.match_score,
            AppliedAt: app.created_at
        }))

        const csv = Papa.unparse(csvData)

        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename="candidates_export.csv"'
            }
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
