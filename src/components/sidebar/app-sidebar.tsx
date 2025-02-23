"use client"

import {
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  LifeBuoy,
  PlusCircle,
  Search
} from "lucide-react"
import * as React from "react"

import { NavMain } from "@/components/sidebar/nav-main"
// import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
// import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Add",
      url: "",
      icon: PlusCircle,
      isActive: true,
      items: [
        {
          title: "Employee",
          url: "/dashboard/add/employee",
        },
        {
          title: "Product",
          url: "/dashboard/add/product",
        },
      ],
    },
    {
      title: "Find",
      url: "",
      icon: Search,
      isActive: true,
      items: [
        {
          title: "Search",
          url: "/dashboard/find/search",
        },
        {
          title: "All",
          url: "/dashboard/find/all",
        },
      ],
    },
    {
      title: "Stats",
      url: "",
      icon: ClipboardCheck,
      isActive: true,
      items: [
        {
          title: "View",
          url: "/dashboard/stats/view",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "",
      icon: LifeBuoy,
    },
    {
      title: "Documentation",
      url: "",
      icon: BookOpen,
    },
  ],
  projects: [
    {
      name: "Search",
      url: "/search",
      icon: Search,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center text-sidebar-primary-foreground">
                  {/* <Cog className="size-4" /> */}
                  <img src="/Icon.png"/>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">MakerSpace</span>
                  <span className="truncate text-xs">Work</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
    </Sidebar>
  )
}
