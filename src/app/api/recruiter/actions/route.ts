
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    try {
        const { applicationId, action, notes } = await request.json()
        // action: 'hire', 'reject', 'offer', 'hold'

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // 1. Update Application Status
        const statusMap: Record<string, string> = {
            'hire': 'hired',
            'reject': 'rejected',
            'offer': 'offer_sent',
            'hold': 'on_hold'
        }
        const newStatus = statusMap[action]
        if (!newStatus) return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

        const { error: appError } = await supabase
            .from('applications')
            .update({ status: newStatus })
            .eq('id', applicationId)

        if (appError) throw appError

        // 2. Log Action in Recruiter Logs
        const { error: logError } = await supabase
            .from('recruiter_logs')
            .insert({
                recruiter_id: user.id,
                action_type: action,
                details: { applicationId, notes }
            })

        if (logError) console.error('Log error:', logError)

        return NextResponse.json({ success: true, status: newStatus })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
