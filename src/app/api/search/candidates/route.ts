
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { openai } from '@/lib/openai'

// const openai = new OpenAI({ ... }) removed


export async function POST(request: Request) {
    try {
        const { query } = await request.json()
        const supabase = await createClient()

        // 1. Generate Embedding for Search Query
        const embeddingRes = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: query,
        })
        const embedding = embeddingRes.data[0].embedding

        // 2. Perform RPC call to match_resumes (Need to define this function in SQL)
        // For MVP, if RPC not set, we might need to rely on exact match or client-side filter (bad for vector)
        // Assuming 'match_resumes' RPC exists or using `rpc` call.

        // Note: I will define the RPC function in a separate file or user instruction, but here is the call.
        const { data: candidates, error } = await supabase.rpc('match_resumes', {
            query_embedding: embedding,
            match_threshold: 0.5, // tunable
            match_count: 10
        })

        if (error) {
            // Fallback or error handling if RPC missing
            console.error('Vector Search Error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ candidates })

    } catch (error: any) {
        console.error('Search Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
