
import { JobForm } from '@/components/job-form'

export default function NewJobPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Create Job Posting</h2>
            </div>
            <JobForm />
        </div>
    )
}
