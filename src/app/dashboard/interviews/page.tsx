
import { InterviewRecorder } from '@/components/interview/interview-recorder'

export default function InterviewPage() {
    const sampleQuestion = "Describe a situation where you had to solve a complex technical problem under pressure."

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Mock Interview</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-1">
                <InterviewRecorder question={sampleQuestion} />
            </div>

            <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/10 text-sm">
                <h4 className="font-semibold mb-2">Instructions</h4>
                <ul className="list-disc pl-4 space-y-1">
                    <li>Ensure you are in a quiet environment.</li>
                    <li>Speak clearly and directly into the microphone.</li>
                    <li>You have unlimited retries for this practice session.</li>
                </ul>
            </div>
        </div>
    )
}
