
import { ResumeUpload } from '@/components/resume-upload'
import { createClient } from '@/lib/supabase/server'

export default async function ResumePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: resumes } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">One-Click Resume Parsing</h2>
            </div>

            <ResumeUpload />

            <div className="grid gap-4 mt-8">
                <h3 className="text-xl font-semibold">Your Uploads</h3>
                {resumes?.length === 0 && <p className="text-muted-foreground">No resumes uploaded yet.</p>}
                {resumes?.map((resume: any) => (
                    <div key={resume.id} className="p-4 border rounded-lg bg-card text-card-foreground">
                        <p className="font-medium">Uploaded on {new Date(resume.created_at).toLocaleDateString()}</p>
                        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-40">
                            {JSON.stringify(resume.parsed_json, null, 2)}
                        </pre>
                    </div>
                ))}
            </div>
        </div>
    )
}
