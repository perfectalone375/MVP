
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { openai } from '@/lib/openai'

// const openai = new OpenAI({ ... }) removed


export async function POST(request: Request) {
    try {
        const { title, description, requirements } = await request.json()
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // Check Credits (Cost: 5)
        const { data: hasCredits } = await supabase.rpc('deduct_credits', {
            user_uuid: user.id,
            amount: 5
        })
        if (hasCredits === false) {
            return NextResponse.json({ error: 'Insufficient credits (5 required). Please upgrade.' }, { status: 402 })
        }


        // Generate Embedding for the Job Description to match against resumes
        const textToEmbed = `${title} ${description} ${requirements.join(' ')}`
        const embeddingRes = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: textToEmbed.slice(0, 8000),
        })
        const embedding = embeddingRes.data[0].embedding

        const { data, error } = await supabase
            .from('jobs')
            .insert({
                recruiter_id: user.id,
                title,
                description,
                requirements,
                skills_required: requirements, // Simplified mapping
                status: 'open',
                embedding // Ensure 'embedding' column exists in jobs table schema!
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ success: true, data })
    } catch (error: any) {
        console.error('Job Create Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
