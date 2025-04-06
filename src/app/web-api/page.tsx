'use client'
import React from 'react';
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { SiteHeader } from '@/components/site-header';

const WebApiPage: React.FC = () => {

  const breadcrumbItems = [
    { href: "/web-api", label: "Web / API", isCurrentPage: true }
  ];
  
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader 
          title="Web / API" 
          breadcrumbItems={breadcrumbItems}
        />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center p-4">
                  <p className="text-center text-muted-foreground">API Endpoints</p>
                </div>
                <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center p-4">
                  <p className="text-center text-muted-foreground">Web Traffic</p>
                </div>
              </div>
              <div className="min-h-[60vh] flex-1 rounded-xl bg-muted/50 flex items-center justify-center p-4">
                <p className="text-center text-muted-foreground">Configuration Settings</p>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default WebApiPage;