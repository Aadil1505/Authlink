"use client"

import {
  BookOpen,
  ChartColumnIncreasing,
  LifeBuoy,
  ScanBarcode,
  Search,
  Settings,
  Users
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
      title: "Products",
      url: "",
      icon: ScanBarcode,
      isActive: true,
      items: [
        {
          title: "Verify",
          url: "/product-owner/products/verify",
          description: "Verify a product"
        },
        {
          title: "Search",
          url: "/product-owner/products/search",
          description: "Search for a product"
        },
      ],
    },
    {
      title: "Analytics",
      url: "",
      icon: ChartColumnIncreasing,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/product-owner/analytics/overview",
          description: "Key metrics and performance indicators"
        },
        {
          title: "Verification History",
          url: "/product-owner/analytics/history",
          description: "Product verification history"
        },
      ],
    },
    {
      title: "Settings",
      url: "",
      icon: Settings,
      items: [
        {
          title: "Profile",
          url: "/product-owner/settings/profile",
          description: "Manage information"
        },
      ],
    }
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
              <a href="/product-owner">
                <div className="flex aspect-square size-8 items-center justify-center text-sidebar-primary-foreground">
                  {/* <Cog className="size-4" /> */}
                  <img src="/Logo.png"/>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Authlink</span>
                  <span className="truncate text-xs">Product Owner</span>
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
