'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CandidateCard } from '@/components/candidate-card'
import { Loader2, Search } from 'lucide-react'

export default function SearchPage() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        setLoading(true)
        try {
            const res = await fetch('/api/search/candidates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            })
            const data = await res.json()
            if (data.candidates) {
                setResults(data.candidates)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <h2 className="text-3xl font-bold tracking-tight">Talent Search</h2>
                <p className="text-muted-foreground">Find the perfect candidate using natural language (e.g., &quot;React developer with 3 years experience&quot;).</p>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                    className="max-w-xl"
                    placeholder="Search candidates..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Button type="submit" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Search className="h-4 w-4" />}
                    Search
                </Button>
            </form>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {results.map((candidate) => (
                    <CandidateCard key={candidate.id} candidate={candidate} />
                ))}
                {results.length === 0 && !loading && (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                        No candidates found. Try a different search.
                    </div>
                )}
            </div>
        </div>
    )
}
