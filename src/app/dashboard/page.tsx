'use client'
import React, { useState, useEffect } from 'react';
import { AppSidebar } from "@/components/app-sidebar"
import LogsChart from "@/components/LogsChart"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import ClustersDropdown from '@/components/Clusters';
import TypesDropdown from '@/components/Types';
import LogsChartByHour from '@/components/LogsChartByHour';
import LogsTable from '@/components/LogsTable';
import { Skeleton } from "@/components/ui/skeleton";
import LogsTableSummary from '@/components/LogsTableSummary';
import { SiteHeader } from "@/components/site-header"
import { Label } from "@/components/ui/label"

const Dashboard: React.FC = () => {
  const [selectedCluster, setSelectedCluster] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(loadTimer);
  }, []);

  const breadcrumbItems = [
    { href: "/dashboard", label: "Dashboard", isCurrentPage: true }
  ];

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader 
          title="Dashboard" 
          breadcrumbItems={breadcrumbItems}
        />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-1 flex-col gap-4 p-4">
              <Label className="text-2xl" htmlFor="clustertype">Select Cluster and Type</Label>
              
              {isLoading ? (
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-40" />
                  <Skeleton className="h-10 w-40" />
                </div>
              ) : (
                <div className="flex gap-4">
                  <ClustersDropdown onSelect={(cluster) => {
                    setSelectedCluster(cluster);
                    setSelectedType('');
                  }} />
                  <TypesDropdown 
                    cluster={selectedCluster} 
                    onSelect={setSelectedType}
                    disabled={!selectedCluster}
                  />
                </div>
              )}
              
              <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                <div className={`aspect-video rounded-xl ${(!selectedCluster || !selectedType) ? 'bg-muted/50 flex items-center justify-center' : ''}`}>
                  {(!selectedCluster || !selectedType) ? (
                    <p className="text-center text-muted-foreground">Select a cluster and type to view daily logs chart</p>
                  ) : (
                    <LogsChart 
                      cluster={selectedCluster} 
                      type={selectedType}
                    />
                  )}
                </div>
                <div className={`aspect-video rounded-xl ${(!selectedCluster || !selectedType) ? 'bg-muted/50 flex items-center justify-center' : ''}`}>
                  {(!selectedCluster || !selectedType) ? (
                    <p className="text-center text-muted-foreground">Select a cluster and type to view hourly logs chart</p>
                  ) : (
                    <LogsChartByHour
                      cluster={selectedCluster} 
                      type={selectedType}
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-3">
                <div className={`aspect-video rounded-xl ${(!selectedCluster || !selectedType) ? 'bg-muted/50 flex items-center justify-center' : ''}`}>
                  {(!selectedCluster || !selectedType) ? (
                    <p className="text-center text-muted-foreground">Select a cluster and type to view raw logs table</p>
                  ) : (
                    <LogsTable 
                      cluster={selectedCluster} 
                      type={selectedType}
                    />
                  )}
                </div>
                </div>
                <div className="md:col-span-1">
                <div className={`aspect-video rounded-xl ${(!selectedCluster || !selectedType) ? 'bg-muted/50 flex items-center justify-center' : ''}`}>
                  {(!selectedCluster || !selectedType) ? (
                    <p className="text-center text-muted-foreground">Select a cluster and type to view summary table</p>
                  ) : (
                    <LogsTableSummary
                      cluster={selectedCluster} 
                      type={selectedType}
                    />
                  )}
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Dashboard;