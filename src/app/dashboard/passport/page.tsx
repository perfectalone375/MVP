
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, TrendingUp, Award } from 'lucide-react'

// Radar chart would go here, using Recharts (installed earlier)
// Simplified for MVP as a list of scores

export default async function ATPPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: atp } = await supabase
        .from('atp')
        .select('*')
        .eq('user_id', user!.id)
        .single()

    const scores = [
        { label: 'Identity', value: atp?.identity_score, max: 100 },
        { label: 'Resume Strength', value: atp?.resume_score, max: 100 },
        { label: 'Domain Knowledge', value: atp?.domain_interview_score, max: 100 },
        { label: 'Communication', value: atp?.communication_score, max: 100 },
        { label: 'Project Depth', value: atp?.project_depth_score, max: 100 },
        { label: 'Soft Skills', value: atp?.behavioural_score, max: 100 },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <ShieldCheck className="h-10 w-10 text-primary" />
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">AI Talent Passport</h2>
                    <p className="text-muted-foreground">Your verified professional identity score.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-primary text-primary-foreground">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Final ATP Score</CardTitle>
                        <Award className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">{atp?.final_atp_score?.toFixed(0) || 0}</div>
                        <p className="text-xs opacity-80">+20% from last month</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {scores.map((score) => (
                    <Card key={score.label}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{score.label}</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{score.value?.toFixed(0) || 0}</div>
                            <div className="h-2 w-full bg-secondary mt-2 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary"
                                    style={{ width: `${(score.value || 0)}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Earned Badges</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {atp?.badges?.length > 0 ? (
                            atp.badges.map((badge: string) => (
                                <Badge key={badge} variant="secondary" className="text-md py-1 px-3">
                                    {badge}
                                </Badge>
                            ))
                        ) : (
                            <p className="text-muted-foreground">No badges earned yet. Complete interviews to earn them.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
