'use client'
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const TableSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-1/3" />
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Skeleton className="h-5 w-full" /></TableHead>
                <TableHead><Skeleton className="h-5 w-full" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-1/3" />
      </CardHeader>
      <CardContent className="h-[300px] flex flex-col">
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="flex-1 flex items-end space-x-2">
          {Array(12).fill(0).map((_, i) => (
            <Skeleton key={i} className={`w-full h-[${40 + Math.random() * 140}px]`} />
          ))}
        </div>
        <Skeleton className="h-6 w-full mt-4" />
      </CardContent>
    </Card>
  );
};