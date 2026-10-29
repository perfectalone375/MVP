
import { openai } from '@/lib/openai'

export async function scoreCandidateMatch(candidateProfile: string, jobDescription: string) {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: `Evaluate the match between the candidate and the job.
        Output JSON:
        {
           "match_percentage": number (0-100),
           "reasoning": "string explanation",
           "missing_skills": ["string"]
        }`
            },
            { role: "user", content: `Candidate: ${candidateProfile}\n\nJob: ${jobDescription}` }
        ],
        response_format: { type: "json_object" },
    })

    return JSON.parse(completion.choices[0].message.content || '{}')
}
