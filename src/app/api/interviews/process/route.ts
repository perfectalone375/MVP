
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyzeInterviewResponse } from '@/lib/ai/interview'
import { AssemblyAI } from 'assemblyai'
import { openai } from '@/lib/openai'

// const openai = new OpenAI({ ... }) removed
const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY! })

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const question = (formData.get('question') as string) || 'General Interview Question'

        if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // 0. Check Credits (Cost: 1)
        const { data: hasCredits, error: creditError } = await supabase.rpc('deduct_credits', {
            user_uuid: user.id,
            amount: 1
        })

        // Fallback manual check if RPC fails/missing
        if (creditError || hasCredits === false) {
            // Try manual fetch
            const { data: profile } = await supabase.from('users').select('credits').eq('id', user.id).single()
            if (!profile || profile.credits < 1) {
                return NextResponse.json({ error: 'Insufficient credits. Please upgrade.' }, { status: 402 })
            }
            // Deduct manually
            await supabase.from('users').update({ credits: profile.credits - 1 }).eq('id', user.id)
        }


        // 1. Upload to Supabase
        const fileExt = 'webm'
        const fileName = `interviews/${user.id}/${Date.now()}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('interviews') // Ensure this bucket exists!
            .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
            .from('interviews')
            .getPublicUrl(fileName)

        // 2. Transcribe with AssemblyAI
        const transcript = await client.transcripts.transcribe({
            audio: publicUrl,
        })

        if (transcript.status === 'error') throw new Error(transcript.error)

        // ... inside POST
        // 3. Analyze with AI Module
        const analysis = await analyzeInterviewResponse(question, transcript.text || '')


        // 4. Save to Database
        const { error: dbError } = await supabase.from('interviews').insert({
            user_id: user.id,
            type: 'domain', // Defaulting for now
            recording_url: publicUrl,
            transcript: transcript.text,
            ai_score: analysis.score,
            ai_notes: analysis,
        })

        if (dbError) throw dbError

        // 5. Update ATP (Simplified average)
        // In a real app, this would recalculate the average of all interviews
        const { error: rpcError } = await supabase.rpc('update_atp_score', {
            user_uuid: user.id,
            new_score: analysis.score,
            category: 'domain_interview_score'
        })
        if (rpcError) console.error('ATP update failed:', rpcError)

        return NextResponse.json({ success: true, analysis })

    } catch (error: any) {
        console.error('Interview Process Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
