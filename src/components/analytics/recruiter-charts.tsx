'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export function RecruiterCharts({ data }: { data: any }) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle>Hiring Funnel</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.funnel} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="stage" type="category" width={100} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#8884d8" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}
