'use client'
import React, { useState, useEffect } from 'react';
import { getLogsCountPerQuery, LogsCountsPerQuery } from '@/lib/api';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

interface LogsTableSummaryProps {
    cluster: string;
    type: string;
}

const LogsTableSummary: React.FC<LogsTableSummaryProps> = ({ cluster, type }) => {
    const [logsCountPerQuery, setLogsCountPerQuery] = useState<LogsCountsPerQuery[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (cluster && type) {
            const fetchLogs = async () => {
                setIsLoading(true);
                setError(null);
                
                try {
                    const dataQuery = await getLogsCountPerQuery(cluster, type);
                    setLogsCountPerQuery(dataQuery.countPerQuery);
                } catch (error) {
                    console.error('Error fetching logs summary:', error);
                    setError('Failed to load summary data. Please try again.');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchLogs();
        }
    }, [cluster, type]);

    const queryCountColumns: ColumnDef<LogsCountsPerQuery>[] = [
        {
            accessorKey: "query",
            header: "SQL Query",
            cell: ({ row }) => {
                const sql = row.getValue("query") as string;
                return (
                    <div className="max-w-[600px] whitespace-normal line-clamp-3">
                        {sql}
                    </div>
                );
            },
        },
        {
            accessorKey: "count",
            header: "Total",
            cell: ({ row }) => {
                const count = row.getValue("count") as number;
                return <div>{count}</div>;
            },
        }
    ];

    const queryCountTable = useReactTable({
        data: logsCountPerQuery,
        columns: queryCountColumns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    if (!cluster || !type) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {queryCountTable.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, index) => (
                                    <TableRow key={`skeleton-${index}`}>
                                        <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                    </TableRow>
                                ))
                            ) : error ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={2}
                                        className="h-24 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                            <p className="text-muted-foreground">{error}</p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="mt-4"
                                                onClick={() => {
                                                    setIsLoading(true);
                                                    getLogsCountPerQuery(cluster, type)
                                                        .then(data => {
                                                            setLogsCountPerQuery(data.countPerQuery);
                                                            setError(null);
                                                        })
                                                        .catch(err => {
                                                            console.error('Error retrying logs summary fetch:', err);
                                                            setError('Failed to load summary data. Please try again.');
                                                        })
                                                        .finally(() => setIsLoading(false));
                                                }}
                                            >
                                                Retry
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : queryCountTable.getRowModel().rows?.length ? (
                                queryCountTable.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={2}
                                        className="h-24 text-center"
                                    >
                                        No summary logs found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default LogsTableSummary;