"use client"

import * as React from "react"
import { Hexagon } from "lucide-react"

import { NavMain } from "@/components/dashboard/nav-main"
import { NavUser } from "@/components/dashboard/nav-user"
import { mentorMenu, menteeMenu } from "@/config/navigation"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

interface AppSidebarProps extends Omit<React.ComponentProps<typeof Sidebar>, "user"> {
    userRole: 'mentor' | 'mentorado';
    user: {
        name: string;
        email: string;
        avatar: string;
    };
}

export function AppSidebar({ userRole, user, ...props }: AppSidebarProps) {
    const items = userRole === 'mentor' ? mentorMenu : menteeMenu;
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader className="pt-6">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:p-1.5!"
                        >
                            <a href="/dashboard">
                                <Hexagon className="size-5!" />
                                <span className="text-base font-semibold">Cluster Platform</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="pt-6">
                <NavMain items={items} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    )
}
