'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileText, Briefcase, Video, ShieldCheck, Search, BarChart, Settings, Zap } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    role: 'jobseeker' | 'recruiter' | 'admin'
}

export function Sidebar({ className, role }: SidebarProps) {
    const pathname = usePathname()

    const candidateLinks = [
        { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/resume", label: "My Resume", icon: FileText },
        { href: "/dashboard/jobs", label: "Job Matches", icon: Briefcase },
        { href: "/dashboard/interviews", label: "Interviews", icon: Video },
        { href: "/dashboard/passport", label: "Talent Passport", icon: ShieldCheck },
        { href: "/dashboard/analytics", label: "Analytics", icon: BarChart },
        { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ]

    const recruiterLinks = [
        { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/jobs/new", label: "Post a Job", icon: Briefcase },
        { href: "/dashboard/applicants", label: "Applicants", icon: FileText },
        { href: "/dashboard/search", label: "Talent Search", icon: Search },
        { href: "/dashboard/analytics", label: "Analytics", icon: BarChart },
        { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ]

    const links = role === 'recruiter' ? recruiterLinks : candidateLinks

    return (
        <div className={cn("pb-12 h-screen border-r bg-background", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        AI Hiring Platform
                    </h2>
                    <div className="space-y-1">
                        {links.map((link) => (
                            <Button
                                key={link.href}
                                variant={pathname === link.href ? "secondary" : "ghost"}
                                className="w-full justify-start"
                                asChild
                            >
                                <Link href={link.href}>
                                    <link.icon className="mr-2 h-4 w-4" />
                                    {link.label}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
