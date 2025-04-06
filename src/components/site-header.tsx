import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ModeToggle } from "./ModeToggle"
import React from "react";
import { Label } from "./ui/label";

interface SiteHeaderProps {
  title?: string;
  breadcrumbItems?: Array<{
    href: string;
    label: string;
    isCurrentPage?: boolean;
  }>;
}

export function SiteHeader({ 
  title = "Dashboard", 
  breadcrumbItems = [{ href: "/dashboard", label: "Dashboard" }] 
}: SiteHeaderProps) {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      {item.isCurrentPage ? (
                        <BreadcrumbPage>
                          <Label className="text-1xl">{item.label}</Label>
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={item.href}>
                          <Label className="text-1xl">{item.label}</Label>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbItems.length - 1 && (
                      <BreadcrumbSeparator />
                    )}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <ModeToggle />
      </div>
    </header>
  )
}