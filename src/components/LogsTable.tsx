'use client'
import React, { useState, useEffect } from 'react';
import { getLogs, Log } from '@/lib/api';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ChevronDown } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
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

interface LogsTableProps {
    cluster: string;
    type: string;
}

const LIMIT = 50;
const DURATION_FILTERS = [0.5, 1, 2, 5];

const formatTimestamp = (timestamp: string) => {
    return timestamp.replace('T', ' ').slice(0, 19);
};

const LogsTable: React.FC<LogsTableProps> = ({ cluster, type }) => {
    const [logs, setLogs] = useState<Log[]>([]);
    const [count, setCount] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [durationFilter, setDurationFilter] = useState<number>(0.5);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

    useEffect(() => {
        if (cluster && type) {
            const fetchLogs = async () => {
                setIsLoading(true);
                setError(null);
                
                try {
                    const offset = (page - 1) * LIMIT;
                    const data = await getLogs(cluster, type, durationFilter, LIMIT, offset);
                    setLogs(data.logs);
                    setCount(data.count);
                } catch (error) {
                    console.error('Error fetching logs:', error);
                    setError('Failed to load logs. Please try again.');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchLogs();
        }
    }, [cluster, type, page, durationFilter]);

    const totalPages = Math.ceil(count / LIMIT);

    const columns: ColumnDef<Log>[] = [
        {
            accessorKey: "timestamp",
            header: ({ column }) => (
                <div>
                    Timestamp
                </div>
            ),
            cell: ({ row }) => (
                <div>{formatTimestamp(row.getValue("timestamp"))}</div>
            ),
        },
        {
            accessorKey: "cluster",
            header: "Cluster",
        },
        {
            accessorKey: "type",
            header: "Type",
        },
        {
            accessorKey: "duration",
            header: ({ column }) => (
                <div className="flex items-center">
                    Duration
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="ml-2">
                                {`> ${durationFilter}`}
                                <ChevronDown className="ml-1 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            {DURATION_FILTERS.map((filter) => (
                                <DropdownMenuCheckboxItem
                                    key={filter}
                                    checked={durationFilter === filter}
                                    onCheckedChange={() => {
                                        setDurationFilter(filter);
                                        setPage(1);
                                    }}
                                >
                                    {`> ${filter}`}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
            cell: ({ row }) => (
                <div>{Number(row.getValue("duration")).toFixed(2)}</div>
            ),
        },
        {
            accessorKey: "message",
            header: "SQL",
            cell: ({ row }) => {
                const message = row.getValue("message") as string;
                return (
                    <div className="max-w-[600px] whitespace-normal line-clamp-8">
                        {message}
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data: logs,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    });

    const handleFirst = () => setPage(1);
    const handlePrevious = () => setPage((prev) => Math.max(prev - 1, 1));
    const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));
    const handleLast = () => setPage(totalPages);

    if (!cluster || !type) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Raw Logs</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="w-full">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
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
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <TableRow key={`skeleton-${index}`}>
                                            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : error ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-24 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center">
                                                <p className="text-muted-foreground">{error}</p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-4"
                                                    onClick={() => {
                                                        const offset = (page - 1) * LIMIT;
                                                        setIsLoading(true);
                                                        getLogs(cluster, type, durationFilter, LIMIT, offset)
                                                            .then(data => {
                                                                setLogs(data.logs);
                                                                setCount(data.count);
                                                                setError(null);
                                                            })
                                                            .catch(err => {
                                                                console.error('Error retrying logs fetch:', err);
                                                                setError('Failed to load logs. Please try again.');
                                                            })
                                                            .finally(() => setIsLoading(false));
                                                    }}
                                                >
                                                    Retry
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : logs.length ? (
                                    logs.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell>{formatTimestamp(row.timestamp)}</TableCell>
                                            <TableCell>{row.cluster}</TableCell>
                                            <TableCell>{row.type}</TableCell>
                                            <TableCell>{Number(row.duration).toFixed(2)}</TableCell>
                                            <TableCell className="max-w-[600px] whitespace-normal line-clamp-8">
                                                {row.message}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-24 text-center"
                                        >
                                            No logs found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <div className="flex-1 text-sm text-muted-foreground">
                            {isLoading ? (
                                <Skeleton className="h-5 w-40" />
                            ) : (
                                logs.length > 0 && `Showing ${logs.length} of ${count} results`
                            )}
                        </div>
                        <div className="space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleFirst}
                                disabled={page === 1 || isLoading}
                            >
                                First
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePrevious}
                                disabled={page === 1 || isLoading}
                            >
                                Previous
                            </Button>
                            <span className="text-sm">
                                {isLoading ? (
                                    <Skeleton className="h-5 w-16 inline-block" />
                                ) : (
                                    `Page ${page} of ${totalPages}`
                                )}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleNext}
                                disabled={page === totalPages || isLoading}
                            >
                                Next
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLast}
                                disabled={page === totalPages || isLoading}
                            >
                                Last
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default LogsTable;