
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    try {
        const { planId, amount, credits } = await request.json()
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // MOCK PAYMENT PROCESSING
        console.log(`Processing mock payment for user ${user.id}: Plan ${planId}, Amount $${amount}`)

        // Update User Credits & Tier directly
        const { error } = await supabase.rpc('add_credits', {
            user_uuid: user.id,
            amount: credits
        })

        // Fallback if RPC missing: fetch and update (race prone but ok for MVP)
        if (error) {
            const { data: profile } = await supabase.from('users').select('credits').eq('id', user.id).single()
            const newCredits = (profile?.credits || 0) + credits

            await supabase.from('users').update({
                credits: newCredits,
                tier: planId === 'pro' ? 'pro' : 'free'
            }).eq('id', user.id)
        }

        return NextResponse.json({ success: true, new_balance: credits })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
