'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Zap, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BillingPage() {
    const [credits, setCredits] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                supabase.from('users').select('credits').eq('id', user.id).single()
                    .then(({ data }) => setCredits(data?.credits || 0))
            }
        })
    }, [supabase])

    const handleUpgrade = async (planId: string, amount: number, creditAmount: number) => {
        setLoading(true)
        try {
            const res = await fetch('/api/billing/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId, amount, credits: creditAmount })
            })
            if (!res.ok) throw new Error('Payment failed')

            setCredits(prev => (prev || 0) + creditAmount)
            alert(`Success! Added ${creditAmount} credits.`)
            router.refresh()
        } catch (err) {
            alert('Upgrade failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Billing & Credits</h2>
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm font-medium text-primary">Current Balance</p>
                    <p className="text-3xl font-bold">{credits ?? '...'} <span className="text-sm font-normal text-muted-foreground">credits</span></p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Free Tier */}
                <Card>
                    <CardHeader>
                        <CardTitle>Starter</CardTitle>
                        <CardDescription>Video interviews and limited jobs</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">$0</p>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> 10 Starting Credits</li>
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Pay as you go</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full" disabled>Current Plan</Button>
                    </CardFooter>
                </Card>

                {/* Pro Tier */}
                <Card className="border-primary shadow-lg scale-105">
                    <CardHeader>
                        <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded w-fit mb-2">MOST POPULAR</div>
                        <CardTitle>Pro Pack</CardTitle>
                        <CardDescription>Power users and active recruiters</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">$49</p>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> 500 Credits</li>
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Priority AI Processing</li>
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Badge: Billing Pro</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={() => handleUpgrade('pro', 49, 500)} disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Buy 500 Credits
                        </Button>
                    </CardFooter>
                </Card>

                {/* Enterprise */}
                <Card>
                    <CardHeader>
                        <CardTitle>Enterprise</CardTitle>
                        <CardDescription>Unlimited scale for agencies</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">$499</p>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> 10,000 Credits</li>
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Dedicated Support</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full" onClick={() => handleUpgrade('ent', 499, 10000)} disabled={loading}>
                            Buy 10k Credits
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
