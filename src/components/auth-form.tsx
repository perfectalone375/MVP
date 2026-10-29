'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { Chrome, Github, Loader2 } from 'lucide-react'

export function AuthForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState<'signin' | 'signup'>('signin')
    const [message, setMessage] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                })
                if (error) throw error
                setMessage('Check your email for the confirmation link.')
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/dashboard')
                router.refresh()
            }
        } catch (error: any) {
            setMessage(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleOAuth = async (provider: 'google' | 'github') => {
        setLoading(true)
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })
        if (error) {
            setMessage(error.message)
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>{mode === 'signin' ? 'Welcome Back' : 'Create Account'}</CardTitle>
                <CardDescription>
                    {mode === 'signin'
                        ? 'Enter your credentials to access your account'
                        : 'Sign up to start your journey'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <Button variant="outline" onClick={() => handleOAuth('google')} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Chrome className="mr-2 h-4 w-4" />}
                        Continue with Google
                    </Button>
                    <Button variant="outline" onClick={() => handleOAuth('github')} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Github className="mr-2 h-4 w-4" />}
                        Continue with GitHub
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        {message && <p className="text-sm text-red-500">{message}</p>}
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {mode === 'signin' ? 'Sign In' : 'Sign Up'}
                        </Button>
                    </form>
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="link" className="w-full" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
                    {mode === 'signin' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </Button>
            </CardFooter>
        </Card>
    )
}
