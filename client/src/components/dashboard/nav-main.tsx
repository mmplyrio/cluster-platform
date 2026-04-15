"use client"

import { NavItem } from "@/config/navigation"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
    items,
}: {
    items: NavItem[]
}) {
    const pathname = usePathname()

    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2 mt-2">
                <SidebarMenu>
                    {items.map((item) => {
                        const isActive = pathname === item.url || (pathname?.startsWith(item.url + "/") && item.url !== "/mentor" && item.url !== "/mentee")
                        
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton 
                                    asChild 
                                    tooltip={item.title}
                                    isActive={isActive}
                                >
                                    <Link href={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
