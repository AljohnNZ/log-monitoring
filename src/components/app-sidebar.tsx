import * as React from "react"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { DatabaseIcon, LayoutDashboard, Settings2 } from "lucide-react"
import { cn } from "@/lib/utils"

const data = {
  navMain: [
    {
      title: "Database",
      url: "database",
      items: [
        {
          title: "Database",
          url: "database",
          icon: DatabaseIcon
        },
        {
          title: "Web / API",
          url: "web-api",
          icon: Settings2
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  
  const isActive = (url: string) => {
    if (url === 'database' && (pathname === '/' || pathname === '/database')) {
      return true
    }
    return pathname?.includes(url)
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <img src="/aljohn-logo-black.svg" alt="Company Logo" className="h-5 w-5" />
                <span className="text-base font-semibold">Web Log Monitoring</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((menuItem) => {
                  const active = isActive(menuItem.url)
                  return (
                    <SidebarMenuItem key={menuItem.title}>
                      <SidebarMenuButton asChild>
                        <a 
                          href={`/${menuItem.url}`}
                          className={cn(
                            active && "bg-primary/10 font-medium text-primary",
                            "group flex items-center rounded-md transition-colors"
                          )}
                        >
                          <menuItem.icon className={cn(
                            active ? "text-primary" : "text-muted-foreground group-hover:text-foreground", 
                            "mr-2 h-4 w-4"
                          )} />
                          <span>{menuItem.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}