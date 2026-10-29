'use client'

import { UserNav } from "./user-nav"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "./sidebar"
import { useMobile } from "@/hooks/use-mobile"

export function Header({ role, email }: { role: any, email: string }) {
    const isMobile = useMobile()

    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <div className="md:hidden mr-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0">
                            <Sidebar role={role} className="border-none w-full" />
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="ml-auto flex items-center space-x-4">
                    <UserNav email={email} />
                </div>
            </div>
        </div>
    )
}
