'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { UserRole } from '@/types'

export default function OnboardingPage() {
    const [role, setRole] = useState<UserRole | ''>('')
    const [fullName, setFullName] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        // Check if user already has a profile
        const checkProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single()

            if (profile) {
                // If profile exists, redirect to dashboard
                router.push('/dashboard')
            }
        }
        checkProfile()
    }, [router, supabase])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!role || !fullName) return

        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { error } = await supabase
                .from('users')
                .insert({
                    id: user.id,
                    email: user.email!,
                    role: role as UserRole,
                    full_name: fullName, // Add to schema if missing, or use metadata
                })

            if (error) {
                console.error('Error creating profile:', error)
            } else {
                router.push('/dashboard')
            }
        }
        setLoading(false)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Complete Your Profile</CardTitle>
                    <CardDescription>Tell us a bit about yourself to get started.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullname">Full Name</Label>
                            <Input
                                id="fullname"
                                placeholder="John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">I am a...</Label>
                            <Select onValueChange={(val) => setRole(val as UserRole)} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="jobseeker">Job Seeker</SelectItem>
                                    <SelectItem value="recruiter">Recruiter</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" className="w-full" disabled={loading || !role || !fullName}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Complete Setup
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
