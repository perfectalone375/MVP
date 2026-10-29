
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch user role
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    // If no profile, they might need onboarding
    if (!profile) {
        redirect('/onboarding')
    }

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <Sidebar role={profile.role as any} className="hidden md:block w-64 flex-shrink-0" />
            <div className="flex-1 flex flex-col">
                <Header role={profile.role} email={user.email!} />
                <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4">
                    {children}
                </main>
            </div>
        </div>
    )
}
