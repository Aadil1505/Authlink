"use client"

import {
  BookOpen,
  ChartColumnIncreasing,
  ClipboardCheck,
  LifeBuoy,
  PlusCircle,
  ScanBarcode,
  Search,
  Settings,
  Truck,
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
          title: "Register",
          url: "/dashboard/products/register",
          description: "Register new products with NFC tags"
        },
        {
          title: "Catalog",
          url: "/dashboard/products/catalog",
          description: "View and manage registered products"
        },
        {
          title: "Batch Operations",
          url: "/dashboard/products/batch",
          description: "Bulk product registration and management"
        },
        {
          title: "NFC Tag Management",
          url: "/dashboard/products/nfc-tags",
          description: "Manage and track NFC tag inventory"
        }
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
          url: "/dashboard/analytics/overview",
          description: "Key metrics and performance indicators"
        },
        {
          title: "Verification Stats",
          url: "/dashboard/analytics/verifications",
          description: "Product verification analytics"
        },
        {
          title: "Fraud Detection",
          url: "/dashboard/analytics/fraud",
          description: "Monitor and analyze suspicious activities"
        },
        {
          title: "Reports",
          url: "/dashboard/analytics/reports",
          description: "Generate custom analytics reports"
        }
      ],
    },
    {
      title: "Team",
      url: "",
      icon: Users, // Changed from PlusCircle to Users
      isActive: true,
      items: [
        {
          title: "Members",
          url: "/dashboard/team/members",
          description: "Manage team members"
        },
        {
          title: "Roles",
          url: "/dashboard/team/roles",
          description: "Configure access permissions"
        },
        {
          title: "Activity Log",
          url: "/dashboard/team/activity",
          description: "Track team member actions"
        }
      ],
    },
    {
      title: "Settings",
      url: "",
      icon: Settings,
      items: [
        {
          title: "Company Profile",
          url: "/dashboard/settings/profile",
          description: "Manage company information"
        },
        {
          title: "API Keys",
          url: "/dashboard/settings/api",
          description: "Manage API access"
        },
        {
          title: "Notifications",
          url: "/dashboard/settings/notifications",
          description: "Configure alert settings"
        },
        {
          title: "Billing",
          url: "/dashboard/settings/billing",
          description: "Manage subscription and payments"
        }
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
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center text-sidebar-primary-foreground">
                  {/* <Cog className="size-4" /> */}
                  <img src="/Logo.png"/>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Authlink</span>
                  <span className="truncate text-xs">Company</span>
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
