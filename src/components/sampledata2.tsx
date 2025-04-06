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

interface LogsChartByHourProps {
  cluster?: string;
  type?: string;
}

interface ChartDataPoint {
    hour: number;
    today: number | null;
    yesterday: number | null;
    lastWeek: number | null;
  }

const LogsChartByHour: React.FC<LogsChartByHourProps> = ({ cluster, type }) => {
  // Sample data directly included in the component
  const sampleData = [
    {
        "hour": 0,
        "today": 10,
        "yesterday": 0,
        "lastWeek": 383
    },
    {
        "hour": 1,
        "today": 20,
        "yesterday": 0,
        "lastWeek": 381
    },
    {
        "hour": 2,
        "today": 0,
        "yesterday": 0,
        "lastWeek": 357
    },
    {
        "hour": 3,
        "today": 0,
        "yesterday": 0,
        "lastWeek": 328
    },
    {
        "hour": 4,
        "today": 0,
        "yesterday": 0,
        "lastWeek": 738
    },
    {
        "hour": 5,
        "today": 0,
        "yesterday": 0,
        "lastWeek": 525
    },
    {
        "hour": 6,
        "today": 0,
        "yesterday": 0,
        "lastWeek": 430
    },
    {
        "hour": 7,
        "today": 0,
        "yesterday": 0,
        "lastWeek": 513
    },
    {
        "hour": 8,
        "today": 0,
        "yesterday": 0,
        "lastWeek": 615
    },
    {
        "hour": 9,
        "today": 0,
        "yesterday": 0,
        "lastWeek": 448
    },
    {
        "hour": 10,
        "today": 0,
        "yesterday": 0,
        "lastWeek": 497
    },
    {
        "hour": 11,
        "today": 0,
        "yesterday": 0,
        "lastWeek": 580
    },
    {
        "hour": 12,
        "today": 0,
        "yesterday": 0,
        "lastWeek": 421
    },
    {
        "hour": 13,
        "today": 0,
        "yesterday": 0,
        "lastWeek": 440
    },
    {
        "hour": 14,
        "today": 0,
        "yesterday": 0,
        "lastWeek": 520
    },
    {
        "hour": 15,
        "today": 0,
        "yesterday": 0,
        "lastWeek": 729
    },
    {
        "hour": 16,
        "today": 0,
        "yesterday": 0,
        "lastWeek": 502
    },
    {
        "hour": 17,
        "today": 0,
        "yesterday": 0,
        "lastWeek": 477
    },
    {
        "hour": 18,
        "today": 0,
        "yesterday": 0,
        "lastWeek": 483
    },
    {
        "hour": 19,
        "today": 0,
        "yesterday": 0,
        "lastWeek": 497
    },
    {
        "hour": 20,
        "today": 0,
        "yesterday": 0,
        "lastWeek": 515
    },
    {
        "hour": 21,
        "today": 0,
        "yesterday": 0,
        "lastWeek": 488
    },
    {
        "hour": 22,
        "today": 0,
        "yesterday": 0,
        "lastWeek": 27
    },
    {
        "hour": 23,
        "today": 0,
        "yesterday": 0,
        "lastWeek": 800
    }
  ];
  
  const [chartData, setChartData] = useState<ChartDataPoint[]>(sampleData);
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
  
  // Track the first and last non-zero hours for each series
  const [dataRanges, setDataRanges] = useState({
    today: { first: 0, last: 23 },
    yesterday: { first: 0, last: 23 },
    lastWeek: { first: 0, last: 23 }
  });

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

  // Calculate totals, check for non-zero values, and find data ranges
  useEffect(() => {
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
    
    // Initialize ranges (use impossible values as placeholders)
    const ranges = {
      today: { first: 24, last: -1 },
      yesterday: { first: 24, last: -1 },
      lastWeek: { first: 24, last: -1 }
    };
    
    sampleData.forEach(point => {
      // Add to totals
      totals.today += point.today;
      totals.yesterday += point.yesterday;
      totals.lastWeek += point.lastWeek;
      
      // Check for non-zero values and update ranges
      if (point.today > 0) {
        hasDataPoints.today = true;
        if (point.hour < ranges.today.first) ranges.today.first = point.hour;
        if (point.hour > ranges.today.last) ranges.today.last = point.hour;
      }
      
      if (point.yesterday > 0) {
        hasDataPoints.yesterday = true;
        if (point.hour < ranges.yesterday.first) ranges.yesterday.first = point.hour;
        if (point.hour > ranges.yesterday.last) ranges.yesterday.last = point.hour;
      }
      
      if (point.lastWeek > 0) {
        hasDataPoints.lastWeek = true;
        if (point.hour < ranges.lastWeek.first) ranges.lastWeek.first = point.hour;
        if (point.hour > ranges.lastWeek.last) ranges.lastWeek.last = point.hour;
      }
    });
    
    // If no data points were found for a series, reset to full range
    if (!hasDataPoints.today) ranges.today = { first: 0, last: 23 };
    if (!hasDataPoints.yesterday) ranges.yesterday = { first: 0, last: 23 };
    if (!hasDataPoints.lastWeek) ranges.lastWeek = { first: 0, last: 23 };
    
    setTotalCounts(totals);
    setHasData(hasDataPoints);
    setDataRanges(ranges);
  }, []);

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
          // Only display legend items that have at least one data point
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

  // Create a modified dataset that only includes data points within the range
  // where there are non-zero values for each series
  const getProcessedChartData = () => {
    return chartData.map(point => {
      const processed = { ...point };
      
      // For each series, set value to null if it's outside its non-zero range
      // This will create a break in the line chart rendering
      
      // Process "today" series
      if (hasData.today && (point.hour < dataRanges.today.first || point.hour > dataRanges.today.last)) {
        processed.today = null;
      }
      
      // Process "yesterday" series
      if (hasData.yesterday && (point.hour < dataRanges.yesterday.first || point.hour > dataRanges.yesterday.last)) {
        processed.yesterday = null;
      }
      
      // Process "lastWeek" series
      if (hasData.lastWeek && (point.hour < dataRanges.lastWeek.first || point.hour > dataRanges.lastWeek.last)) {
        processed.lastWeek = null;
      }
      
      return processed;
    });
  };

  // Process the chart data to only include non-zero ranges
  const processedChartData = getProcessedChartData();

  // Determine which lines to render based on whether they have any data points
  const renderLine = (dataKey: keyof typeof hasData, color: string) => {
    // Only render the line if there's at least one data point
    if (hasData[dataKey]) {
      return (
        <Line
          dataKey={dataKey}
          type="monotone"
          stroke={`var(--color-${dataKey})`}
          strokeWidth={2}
          connectNulls={false} // Don't connect across null values - creates the breaks we want
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expensive Queries by Hour</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
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
              label={{ value: 'Log Count', angle: -90, position: 'insideLeft' }}
            />
            <ChartTooltip cursor={false} content={<CustomTooltipContent />} />
            {renderLine('today', 'var(--color-today)')}
            {renderLine('yesterday', 'var(--color-yesterday)')}
            {renderLine('lastWeek', 'var(--color-lastWeek)')}
            <ChartLegend content={<CustomLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default LogsChartByHour;