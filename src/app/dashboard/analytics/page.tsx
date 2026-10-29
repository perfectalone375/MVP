'use client'

import { useEffect, useState } from 'react'
import { JobseekerCharts } from '@/components/analytics/jobseeker-charts'
import { RecruiterCharts } from '@/components/analytics/recruiter-charts'
import { Loader2 } from 'lucide-react'

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null)

    useEffect(() => {
        fetch('/api/analytics').then(res => res.json()).then(res => setData(res.stats))
    }, [])

    if (!data) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Performance Analytics</h2>
            {data.funnel ? <RecruiterCharts data={data} /> : <JobseekerCharts data={data} />}
        </div>
    )
}
