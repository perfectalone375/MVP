'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bot, Lightbulb, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'

export function AIOverlay() {
    // Simulated AI cues
    const [cues, setCues] = useState<string[]>([])

    useEffect(() => {
        // Mock incoming analysis
        const timer = setTimeout(() => {
            setCues(prev => [...prev, "Ask about their role in the 'Fintech Migration' project mentioned in their resume."])
        }, 5000)

        const timer2 = setTimeout(() => {
            setCues(prev => [...prev, "Candidate seems hesitant on technical details. Probe deeper into React Hooks."])
        }, 15000)

        return () => { clearTimeout(timer); clearTimeout(timer2) }
    }, [])

    return (
        <Card className="h-full flex flex-col bg-card/95 backdrop-blur">
            <CardHeader className="pb-2 text-primary">
                <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    <CardTitle className="text-base">Recruiter Copilot</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-4 p-4 pt-0">
                <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live Suggestions</h4>
                    {cues.map((cue, i) => (
                        <div key={i} className="p-3 bg-primary/10 rounded-lg text-sm border border-primary/20 animate-in fade-in slide-in-from-right-2">
                            <div className="flex gap-2">
                                <Lightbulb className="h-4 w-4 text-primary shrink-0" />
                                <p>{cue}</p>
                            </div>
                        </div>
                    ))}
                    {cues.length === 0 && <p className="text-xs text-muted-foreground italic">Listening...</p>}
                </div>

                <div className="space-y-2 pt-4 border-t">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Real-time Analysis</h4>
                    <div className="flex items-center justify-between text-sm">
                        <span>Confidence</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700">High</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span>Pacing</span>
                        <Badge variant="outline">Normal</Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
