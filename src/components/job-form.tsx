'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export function JobForm() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [requirements, setRequirements] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/jobs/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    requirements: requirements.split(',').map(s => s.trim())
                })
            })

            if (!res.ok) throw new Error('Failed to post job')

            router.push('/dashboard')
            router.refresh()
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Post a New Job</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Job Title</label>
                        <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Senior React Developer" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                            placeholder="Job details..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Requirements (comma separated)</label>
                        <Input value={requirements} onChange={e => setRequirements(e.target.value)} placeholder="React, Node.js, TypeScript" />
                    </div>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Post Job
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
