
import { openai } from '@/lib/openai'

export async function generateInterviewQuestions(resumeContext: string, jobContext: string): Promise<string[]> {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: "Generate 3 challenging, domain-specific interview questions based on the candidate's resume and the job description. Return a JSON array of strings: { questions: string[] }" },
            { role: "user", content: `Resume: ${resumeContext}\n\nJob: ${jobContext}` }
        ],
        response_format: { type: "json_object" },
    })

    const data = JSON.parse(completion.choices[0].message.content || '{}')
    return data.questions || []
}

export async function analyzeInterviewResponse(question: string, transcript: string) {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: `Analyze the interview response.
        Schema:
        {
          "score": number (0-100),
          "communication_score": number (0-100),
          "behavioral_score": number (0-100),
          "feedback": "string",
          "key_strengths": ["string"],
          "red_flags": ["string"]
        }`
            },
            { role: "user", content: `Question: ${question}\n\nAnswer: ${transcript}` }
        ],
        response_format: { type: "json_object" },
    })

    return JSON.parse(completion.choices[0].message.content || '{}')
}
