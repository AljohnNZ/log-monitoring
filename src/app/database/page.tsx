'use client'
import React from 'react';
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SiteHeader } from '@/components/site-header';
import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from '@/components/chart-area-interactive';

const DatabasePage: React.FC = () => {

  const breadcrumbItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/database", label: "Database", isCurrentPage: true }
  ];

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader 
          title="Database" 
          breadcrumbItems={breadcrumbItems}
        />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              {/* <DataTable data={data} /> */}
            </div>
          </div>
        </div>
        {/* <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-1 flex-col gap-4 p-4">
              <Label className="text-2xl" htmlFor="database">Database Management</Label>
              <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center p-4">
                  <p className="text-center text-muted-foreground">Database Stats</p>
                </div>
                <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center p-4">
                  <p className="text-center text-muted-foreground">Database Activity</p>
                </div>
              </div>
              <div className="min-h-[60vh] flex-1 rounded-xl bg-muted/50 flex items-center justify-center p-4">
                <p className="text-center text-muted-foreground">Database Records</p>
              </div>
            </div>
          </div>
        </div> */}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DatabasePage;