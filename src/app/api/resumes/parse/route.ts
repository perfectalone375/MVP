
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { parseResumeAI } from '@/lib/ai/resume'
import { openai } from '@/lib/openai'
import { PDFParse } from 'pdf-parse'



export async function POST(request: Request) {
    try {
        const { fileUrl, userId } = await request.json()
        const supabase = await createClient()

        // 1. Fetch File Content from URL
        const fileRes = await fetch(fileUrl)
        const arrayBuffer = await fileRes.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // 2. Extract Text (Assuming PDF for MVP)
        const parser = new PDFParse({ data: buffer })
        const data = await parser.getText()
        await parser.destroy()
        const text = data.text

        // ... inside POST
        // 3. AI Extraction via Module
        const parsedData = await parseResumeAI(text)


        // 4. Generate Embedding
        const embeddingRes = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: text.slice(0, 8000), // Limit for token safety
        })
        const embedding = embeddingRes.data[0].embedding

        // 5. Store in Resumes Table
        const { error: resumeError } = await supabase.from('resumes').insert({
            user_id: userId,
            raw_file_url: fileUrl,
            parsed_json: parsedData,
            embeddings_vector: embedding,
            resume_score: 0, // Placeholder
        })

        if (resumeError) throw resumeError

        // 6. Initialize ATP
        const { error: atpError } = await supabase.from('atp').upsert({
            user_id: userId,
            resume_score: 70, // Mock initial score logic
            final_atp_score: 70,
            badges: parsedData.skills ? parsedData.skills.slice(0, 5) : []
        })

        if (atpError) throw atpError

        return NextResponse.json({ success: true, data: parsedData })

    } catch (error: any) {
        console.error('Parse error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
