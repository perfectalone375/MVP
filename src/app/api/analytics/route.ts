
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // Fetch Role to determine what stats to show
        const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()

        let stats: any = {}

        if (profile?.role === 'recruiter') {
            const { count: jobCount } = await supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('recruiter_id', user.id)

            stats = {
                active_jobs: jobCount || 0,
                interview_scheduled: 12,
                funnel: [ // Mock Funnel
                    { stage: 'Applied', count: 145 },
                    { stage: 'Screened', count: 89 },
                    { stage: 'Interview', count: 34 },
                    { stage: 'Offer', count: 12 },
                    { stage: 'Hired', count: 5 }
                ]
            }
        } else {
            // Jobseeker
            const { data: atp } = await supabase.from('atp').select('final_atp_score, matches_count').eq('user_id', user.id).single()
            stats = {
                atp_score: atp?.final_atp_score || 0,
                score_history: [ // Mock History
                    { date: '2025-01', score: 65 },
                    { date: '2025-02', score: 68 },
                    { date: '2025-03', score: 72 },
                    { date: '2025-04', score: atp?.final_atp_score || 75 },
                ],
                skills_radar: [
                    { subject: 'Coding', A: 85, fullMark: 100 },
                    { subject: 'Communication', A: 65, fullMark: 100 },
                    { subject: 'Problem Solving', A: 90, fullMark: 100 },
                    { subject: 'Teamwork', A: 75, fullMark: 100 },
                    { subject: 'Leadership', A: 50, fullMark: 100 },
                ]
            }
        }

        return NextResponse.json({ success: true, stats })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
