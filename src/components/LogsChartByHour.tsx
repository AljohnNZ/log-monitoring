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
import { LogsPerHour, getLogsCountPerHour} from '@/lib/api';
import { Skeleton } from "@/components/ui/skeleton";

interface LogsChartByHourProps {
  cluster: string;
  type: string;
}

interface ChartDataPoint {
  hour: number;
  today: number | null;
  yesterday: number | null;
  lastWeek: number | null;
}

const LogsChartByHour: React.FC<LogsChartByHourProps> = ({ cluster, type }) => {
  const [totalCounts, setTotalCounts] = useState({
    today: 0,
    yesterday: 0,
    lastWeek: 0
  });
  const [hasData, setHasData] = useState({
    today: false,
    yesterday: false,
    lastWeek: false
  });
  const [dataRanges, setDataRanges] = useState({
    today: { first: 0, last: 23 },
    yesterday: { first: 0, last: 23 },
    lastWeek: { first: 0, last: 23 }
  });
  const [processedChartData, setProcessedChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const chartConfig = {
    today: {
      label: "Today",
      color: "hsl(var(--chart-1))",
    },
    yesterday: {
      label: "Yesterday",
      color: "hsl(var(--chart-2))",
    },
    lastWeek: {
      label: "Last Week",
      color: "hsl(var(--chart-3))",
    }
  } satisfies ChartConfig;

  const transformLogsToMultiLineChartData = (logsData: LogsPerHour[]) => {
    const groupedLogs: { [key: number]: { today: number; yesterday: number; lastWeek: number } } = {};

    for (let hour = 0; hour < 24; hour++) {
      groupedLogs[hour] = { today: 0, yesterday: 0, lastWeek: 0 };
    }

    const totals = {
      today: 0,
      yesterday: 0,
      lastWeek: 0
    };
    
    const hasDataPoints = {
      today: false,
      yesterday: false,
      lastWeek: false
    };
    
    const ranges = {
      today: { first: 23, last: 0 },
      yesterday: { first: 23, last: 0 },
      lastWeek: { first: 23, last: 0 }
    };

    logsData.forEach(log => {
      const logDate = new Date(log.d);
      const hour = logDate.getHours();
      const logDateString = logDate.toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      if (logDateString === today) {
        groupedLogs[hour].today = log.count;
        totals.today += log.count;
        
        if (log.count > 0) {
          hasDataPoints.today = true;
          if (hour < ranges.today.first) ranges.today.first = hour;
          if (hour > ranges.today.last) ranges.today.last = hour;
        }
      } else if (logDateString === yesterday) {
        groupedLogs[hour].yesterday = log.count;
        totals.yesterday += log.count;
        
        if (log.count > 0) {
          hasDataPoints.yesterday = true;
          if (hour < ranges.yesterday.first) ranges.yesterday.first = hour;
          if (hour > ranges.yesterday.last) ranges.yesterday.last = hour;
        }
      } else {
        groupedLogs[hour].lastWeek = log.count;
        totals.lastWeek += log.count;
        
        if (log.count > 0) {
          hasDataPoints.lastWeek = true;
          if (hour < ranges.lastWeek.first) ranges.lastWeek.first = hour;
          if (hour > ranges.lastWeek.last) ranges.lastWeek.last = hour;
        }
      }
    });

    if (!hasDataPoints.today) ranges.today = { first: 0, last: 23 };
    if (!hasDataPoints.yesterday) ranges.yesterday = { first: 0, last: 23 };
    if (!hasDataPoints.lastWeek) ranges.lastWeek = { first: 0, last: 23 };
    
    setTotalCounts(totals);
    setHasData(hasDataPoints);
    setDataRanges(ranges);

    const rawChartData = Object.entries(groupedLogs).map(([hour, data]) => ({
      hour: parseInt(hour),
      today: data.today,
      yesterday: data.yesterday,
      lastWeek: data.lastWeek
    })).sort((a, b) => a.hour - b.hour);
    
    return rawChartData;
  };

  const processChartData = (rawData: ChartDataPoint[]) => {
    return rawData.map(point => {
      const processed = { ...point };
      
      if (hasData.today && (point.hour < dataRanges.today.first || point.hour > dataRanges.today.last)) {
        processed.today = null;
      }
      
      if (hasData.yesterday && (point.hour < dataRanges.yesterday.first || point.hour > dataRanges.yesterday.last)) {
        processed.yesterday = null;
      }
      
      if (hasData.lastWeek && (point.hour < dataRanges.lastWeek.first || point.hour > dataRanges.lastWeek.last)) {
        processed.lastWeek = null;
      }
      
      return processed;
    });
  };

  const CustomLegendContent = ({ payload }: any) => {
    if (!payload || payload.length === 0) return null;
  
    const labelMap = {
      today: "Today",
      yesterday: "Yesterday",
      lastWeek: "Last Week"
    };
  
    return (
      <div className="flex justify-center space-x-4 mt-2">
        {payload.map((entry: any, index: number) => {
          const periodKey = entry.dataKey as keyof typeof totalCounts;
          if (hasData[periodKey]) {
            return (
              <div 
                key={`item-${index}`} 
                className="flex items-center"
              >
                <span className="w-2 h-2 square mr-1" style={{ backgroundColor: entry.color }}></span>
                <span className="mr-1">{labelMap[periodKey]}</span>
                <span>({totalCounts[periodKey].toLocaleString()})</span>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  const CustomTooltipContent = (props: any) => {
    const hour = props.label;
    const formattedHour = hour === 0 ? '12am' : 
                         hour === 12 ? '12pm' : 
                         hour < 12 ? `${hour}am` : 
                         `${hour - 12}pm`;
    
    const modifiedProps = {
      ...props,
      label: formattedHour
    };
    
    return <ChartTooltipContent {...modifiedProps} />;
  };

  const fetchChartData = async (cluster: string, type: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getLogsCountPerHour(cluster, type);
      const transformedData = transformLogsToMultiLineChartData(data.countPerHour);
      const processed = processChartData(transformedData);
      setProcessedChartData(processed);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setError('Failed to load hourly chart data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (cluster && type) {
      fetchChartData(cluster, type);
    }
  }, [cluster, type]);

  const renderLine = (dataKey: keyof typeof hasData, color: string) => {
    if (hasData[dataKey]) {
      return (
        <Line
          dataKey={dataKey}
          type="monotone"
          stroke={`var(--color-${dataKey})`}
          strokeWidth={2}
          connectNulls={false}
          dot={{
            fill: `var(--color-${dataKey})`,
          }}
          activeDot={{
            r: 6,
          }}
        />
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center"/>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expensive Queries by Hour</CardTitle>
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

  const noDataAvailable = !hasData.today && !hasData.yesterday && !hasData.lastWeek;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expensive Queries by Hour</CardTitle>
      </CardHeader>
      <CardContent>
        {noDataAvailable ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data available for the selected time periods
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
          {/* <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full"> */}
            <LineChart
              accessibilityLayer
              data={processedChartData}
              margin={{
                left: -10,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="hour"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(hour) => {
                  if (hour === 0) return '12am';
                  if (hour === 12) return '12pm';
                  if (hour < 12) return `${hour}am`;
                  return `${hour - 12}pm`;
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickCount={5}
              />
              <ChartTooltip cursor={false} content={<CustomTooltipContent />} />
              {renderLine('today', 'var(--color-today)')}
              {renderLine('yesterday', 'var(--color-yesterday)')}
              {renderLine('lastWeek', 'var(--color-lastWeek)')}
              <ChartLegend content={<CustomLegendContent />} />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default LogsChartByHour;