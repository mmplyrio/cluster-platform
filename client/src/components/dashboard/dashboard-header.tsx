"use client"

import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { mentorMenu, menteeMenu } from "@/config/navigation"

export function SiteHeader() {
    const pathname = usePathname()

    // Compara o caminho atual com as URLs do menu
    const allMenus = [...mentorMenu, ...menteeMenu]
    const currentItem = allMenus.find(item => item.url === pathname) || 
                        allMenus.find(item => pathname?.startsWith(item.url + "/") && item.url !== "/mentor" && item.url !== "/mentee");
    
    const pageTitle = currentItem?.title || "Visão Geral"

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white transition-[width,height] ease-linear">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <h1 className="text-base font-medium text-slate-800">{pageTitle}</h1>
            </div>
        </header>
    )
}
