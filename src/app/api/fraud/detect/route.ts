
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    try {
        const { sessionId, signals } = await request.json()
        // signals: { multiface_count: number, eye_movement_anomalies: number, script_detected: boolean }

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        let fraudScore = 0

        // Simple heuristic scoring
        if (signals.multiface_count > 0) fraudScore += 50
        if (signals.eye_movement_anomalies > 5) fraudScore += 20
        if (signals.script_detected) fraudScore += 30

        // Cap at 100
        fraudScore = Math.min(fraudScore, 100)

        // Update ATP Profile
        // Using RPC or direct update if column exists
        const { error } = await supabase.from('atp')
            .update({ fraud_risk_score: fraudScore })
            .eq('user_id', user.id)

        if (error) {
            // if row missing, upsert (should exist from resume parse)
            await supabase.from('atp').upsert({ user_id: user.id, fraud_risk_score: fraudScore })
        }

        return NextResponse.json({ success: true, fraudScore })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
