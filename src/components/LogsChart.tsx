'use client'
import React, { useState, useEffect } from 'react';
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { LogsPerDay, getLogsCountPerDay } from '@/lib/api';
import { Skeleton } from "@/components/ui/skeleton";

interface LogsChartProps {
  cluster: string;
  type: string;
}

interface ChartDataPoint {
  date: string;
  logs: number;
}

const LogsChart: React.FC<LogsChartProps> = ({ cluster, type }) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const chartConfig = {
    logs: {
      label: "Queries",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const transformLogsToChartData = (logs: LogsPerDay[]) => {
    return logs.map(log => {
      const date = log.d.split('T')[0];
      return {
        date: date,
        logs: log.count || 0
      };
    });
  };

  const fetchChartData = async (cluster: string, type: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getLogsCountPerDay(cluster, type);
      const transformedData = transformLogsToChartData(data.countPerDay);
      setChartData(transformedData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setError('Failed to load chart data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (cluster && type) {
      fetchChartData(cluster, type);
    }
  }, [cluster, type]);

  if (isLoading) {
    return (
      < Skeleton className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center" />
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expensive Queries by Day</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p>{error}</p>
            <button 
              onClick={() => fetchChartData(cluster, type)}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expensive Queries by Day</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data available for the selected cluster and type
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
          {/* <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full"> */}
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: -10,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickCount={5}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="logs"
                type="monotone"
                stroke="var(--color-logs)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-logs)",
                }}
                activeDot={{
                  r: 6,
                }}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default LogsChart;