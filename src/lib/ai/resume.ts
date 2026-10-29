
import { openai } from '@/lib/openai'

export interface ParsedResume {
    userId?: string
    skills: string[]
    experience_years: number
    education_level: string
    strengths: string[]
    weaknesses: string[]
    summary: string
    normalized_title: string
    fraud_signals: {
        is_suspicious: boolean
        reason: string[]
        confidence: number
    }
}

export async function parseResumeAI(text: string): Promise<ParsedResume> {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: `You are an expert Resume Analyst. Extract data and detect fraud.
        Fraud Signals to check:
        - Inconsistent dates
        - Keyword stuffing
        - Hidden text (not visible here but infer context)
        - Overused buzzwords without substance
        
        Output JSON:
        {
          "skills": ["string"],
          "experience_years": number,
          "education_level": "string",
          "strengths": ["string"],
          "weaknesses": ["string"],
          "summary": "string",
          "normalized_title": "string (standardized job title)",
          "fraud_signals": {
            "is_suspicious": boolean,
            "reason": ["string"],
            "confidence": number (0-1)
          }
        }`
            },
            { role: "user", content: text.slice(0, 20000) } // Token limit safety
        ],
        response_format: { type: "json_object" },
    })

    return JSON.parse(completion.choices[0].message.content || '{}') as ParsedResume
}
