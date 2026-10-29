
export default function DashboardPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Placeholder for dashboard widgets */}
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <h3>Welcome to the AI Hiring Platform</h3>
                    <p className="text-sm text-muted-foreground">Select an option from the sidebar to get started.</p>
                </div>
            </div>
        </div>
    )
}
