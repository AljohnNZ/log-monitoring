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
  cluster: string;
  type: string;
}

interface ChartDataPoint {
    hour: number;
    today: number | null;
    yesterday: number | null;
    lastWeek: number | null;
  }

const sampledata = [
  {
    "count": 237,
    "d": "2025-03-12 01:00:00"
  },
  {
    "count": 452,
    "d": "2025-03-12 02:00:00"
  },
  {
    "count": 441,
    "d": "2025-03-12 03:00:00"
  },
  {
    "count": 752,
    "d": "2025-03-12 04:00:00"
  },
  {
    "count": 539,
    "d": "2025-03-12 05:00:00"
  },
  {
    "count": 540,
    "d": "2025-03-12 06:00:00"
  },
  {
    "count": 454,
    "d": "2025-03-12 07:00:00"
  },
  {
    "count": 464,
    "d": "2025-03-12 08:00:00"
  },
  {
    "count": 529,
    "d": "2025-03-12 09:00:00"
  },
  {
    "count": 537,
    "d": "2025-03-12 10:00:00"
  },
  {
    "count": 474,
    "d": "2025-03-12 11:00:00"
  },
  {
    "count": 502,
    "d": "2025-03-12 12:00:00"
  },
  {
    "count": 488,
    "d": "2025-03-12 13:00:00"
  },
  {
    "count": 517,
    "d": "2025-03-12 14:00:00"
  },
  {
    "count": 683,
    "d": "2025-03-12 15:00:00"
  },
  {
    "count": 604,
    "d": "2025-03-12 16:00:00"
  },
  {
    "count": 544,
    "d": "2025-03-12 17:00:00"
  },
  {
    "count": 517,
    "d": "2025-03-12 18:00:00"
  },
  {
    "count": 488,
    "d": "2025-03-12 19:00:00"
  },
  {
    "count": 481,
    "d": "2025-03-12 20:00:00"
  },
  {
    "count": 475,
    "d": "2025-03-12 21:00:00"
  },
  {
    "count": 469,
    "d": "2025-03-12 22:00:00"
  },
  {
    "count": 456,
    "d": "2025-03-12 23:00:00"
  },
  {
    "count": 455,
    "d": "2025-03-13 00:00:00"
  },
  {
    "count": 471,
    "d": "2025-03-13 01:00:00"
  },
  {
    "count": 457,
    "d": "2025-03-13 02:00:00"
  },
  {
    "count": 436,
    "d": "2025-03-13 03:00:00"
  },
  {
    "count": 893,
    "d": "2025-03-13 04:00:00"
  },
  {
    "count": 842,
    "d": "2025-03-13 05:00:00"
  },
  {
    "count": 683,
    "d": "2025-03-13 06:00:00"
  },
  {
    "count": 458,
    "d": "2025-03-13 07:00:00"
  },
  {
    "count": 470,
    "d": "2025-03-13 08:00:00"
  },
  {
    "count": 571,
    "d": "2025-03-13 09:00:00"
  },
  {
    "count": 513,
    "d": "2025-03-13 10:00:00"
  },
  {
    "count": 482,
    "d": "2025-03-13 11:00:00"
  },
  {
    "count": 482,
    "d": "2025-03-13 12:00:00"
  },
  {
    "count": 561,
    "d": "2025-03-13 13:00:00"
  },
  {
    "count": 540,
    "d": "2025-03-13 14:00:00"
  },
  {
    "count": 527,
    "d": "2025-03-13 15:00:00"
  },
  {
    "count": 488,
    "d": "2025-03-13 16:00:00"
  },
  {
    "count": 481,
    "d": "2025-03-13 17:00:00"
  },
  {
    "count": 478,
    "d": "2025-03-13 18:00:00"
  },
  {
    "count": 479,
    "d": "2025-03-13 19:00:00"
  },
  {
    "count": 472,
    "d": "2025-03-13 20:00:00"
  },
  {
    "count": 465,
    "d": "2025-03-13 21:00:00"
  },
  {
    "count": 461,
    "d": "2025-03-13 22:00:00"
  },
  {
    "count": 453,
    "d": "2025-03-13 23:00:00"
  },
  {
    "count": 452,
    "d": "2025-03-14 00:00:00"
  },
  {
    "count": 456,
    "d": "2025-03-14 01:00:00"
  },
  {
    "count": 452,
    "d": "2025-03-14 02:00:00"
  },
  {
    "count": 444,
    "d": "2025-03-14 03:00:00"
  },
  {
    "count": 770,
    "d": "2025-03-14 04:00:00"
  },
  {
    "count": 642,
    "d": "2025-03-14 05:00:00"
  },
  {
    "count": 651,
    "d": "2025-03-14 06:00:00"
  },
  {
    "count": 584,
    "d": "2025-03-14 07:00:00"
  },
  {
    "count": 485,
    "d": "2025-03-14 08:00:00"
  },
  {
    "count": 476,
    "d": "2025-03-14 09:00:00"
  },
  {
    "count": 483,
    "d": "2025-03-14 10:00:00"
  },
  {
    "count": 470,
    "d": "2025-03-14 11:00:00"
  },
  {
    "count": 553,
    "d": "2025-03-14 12:00:00"
  },
  {
    "count": 557,
    "d": "2025-03-14 13:00:00"
  },
  {
    "count": 528,
    "d": "2025-03-14 14:00:00"
  },
  {
    "count": 533,
    "d": "2025-03-14 15:00:00"
  },
  {
    "count": 511,
    "d": "2025-03-14 16:00:00"
  },
  {
    "count": 485,
    "d": "2025-03-14 17:00:00"
  },
  {
    "count": 509,
    "d": "2025-03-14 18:00:00"
  },
  {
    "count": 507,
    "d": "2025-03-14 19:00:00"
  },
  {
    "count": 475,
    "d": "2025-03-14 20:00:00"
  },
  {
    "count": 480,
    "d": "2025-03-14 21:00:00"
  },
  {
    "count": 460,
    "d": "2025-03-14 22:00:00"
  },
  {
    "count": 450,
    "d": "2025-03-14 23:00:00"
  },
  {
    "count": 506,
    "d": "2025-03-15 00:00:00"
  },
  {
    "count": 493,
    "d": "2025-03-15 01:00:00"
  },
  {
    "count": 443,
    "d": "2025-03-15 02:00:00"
  },
  {
    "count": 407,
    "d": "2025-03-15 03:00:00"
  },
  {
    "count": 867,
    "d": "2025-03-15 04:00:00"
  },
  {
    "count": 851,
    "d": "2025-03-15 05:00:00"
  },
  {
    "count": 613,
    "d": "2025-03-15 06:00:00"
  },
  {
    "count": 446,
    "d": "2025-03-15 07:00:00"
  },
  {
    "count": 436,
    "d": "2025-03-15 08:00:00"
  },
  {
    "count": 450,
    "d": "2025-03-15 09:00:00"
  },
  {
    "count": 525,
    "d": "2025-03-15 10:00:00"
  },
  {
    "count": 515,
    "d": "2025-03-15 11:00:00"
  },
  {
    "count": 484,
    "d": "2025-03-15 12:00:00"
  },
  {
    "count": 465,
    "d": "2025-03-15 13:00:00"
  },
  {
    "count": 478,
    "d": "2025-03-15 14:00:00"
  },
  {
    "count": 661,
    "d": "2025-03-15 15:00:00"
  },
  {
    "count": 667,
    "d": "2025-03-15 16:00:00"
  },
  {
    "count": 574,
    "d": "2025-03-15 17:00:00"
  },
  {
    "count": 517,
    "d": "2025-03-15 18:00:00"
  },
  {
    "count": 501,
    "d": "2025-03-15 19:00:00"
  },
  {
    "count": 471,
    "d": "2025-03-15 20:00:00"
  },
  {
    "count": 471,
    "d": "2025-03-15 21:00:00"
  },
  {
    "count": 470,
    "d": "2025-03-15 22:00:00"
  },
  {
    "count": 455,
    "d": "2025-03-15 23:00:00"
  },
  {
    "count": 445,
    "d": "2025-03-16 00:00:00"
  },
  {
    "count": 440,
    "d": "2025-03-16 01:00:00"
  },
  {
    "count": 423,
    "d": "2025-03-16 02:00:00"
  },
  {
    "count": 409,
    "d": "2025-03-16 03:00:00"
  },
  {
    "count": 828,
    "d": "2025-03-16 04:00:00"
  },
  {
    "count": 633,
    "d": "2025-03-16 05:00:00"
  },
  {
    "count": 513,
    "d": "2025-03-16 06:00:00"
  },
  {
    "count": 435,
    "d": "2025-03-16 07:00:00"
  },
  {
    "count": 445,
    "d": "2025-03-16 08:00:00"
  },
  {
    "count": 495,
    "d": "2025-03-16 09:00:00"
  },
  {
    "count": 514,
    "d": "2025-03-16 10:00:00"
  },
  {
    "count": 466,
    "d": "2025-03-16 11:00:00"
  },
  {
    "count": 464,
    "d": "2025-03-16 12:00:00"
  },
  {
    "count": 466,
    "d": "2025-03-16 13:00:00"
  },
  {
    "count": 483,
    "d": "2025-03-16 14:00:00"
  },
  {
    "count": 605,
    "d": "2025-03-16 15:00:00"
  },
  {
    "count": 555,
    "d": "2025-03-16 16:00:00"
  },
  {
    "count": 513,
    "d": "2025-03-16 17:00:00"
  },
  {
    "count": 490,
    "d": "2025-03-16 18:00:00"
  },
  {
    "count": 488,
    "d": "2025-03-16 19:00:00"
  },
  {
    "count": 476,
    "d": "2025-03-16 20:00:00"
  },
  {
    "count": 472,
    "d": "2025-03-16 21:00:00"
  },
  {
    "count": 465,
    "d": "2025-03-16 22:00:00"
  },
  {
    "count": 466,
    "d": "2025-03-16 23:00:00"
  },
  {
    "count": 464,
    "d": "2025-03-17 00:00:00"
  },
  {
    "count": 461,
    "d": "2025-03-17 01:00:00"
  },
  {
    "count": 462,
    "d": "2025-03-17 02:00:00"
  },
  {
    "count": 459,
    "d": "2025-03-17 03:00:00"
  },
  {
    "count": 863,
    "d": "2025-03-17 04:00:00"
  },
  {
    "count": 549,
    "d": "2025-03-17 05:00:00"
  },
  {
    "count": 527,
    "d": "2025-03-17 06:00:00"
  },
  {
    "count": 452,
    "d": "2025-03-17 07:00:00"
  },
  {
    "count": 464,
    "d": "2025-03-17 08:00:00"
  },
  {
    "count": 535,
    "d": "2025-03-17 09:00:00"
  },
  {
    "count": 547,
    "d": "2025-03-17 10:00:00"
  },
  {
    "count": 485,
    "d": "2025-03-17 11:00:00"
  },
  {
    "count": 484,
    "d": "2025-03-17 12:00:00"
  },
  {
    "count": 482,
    "d": "2025-03-17 13:00:00"
  },
  {
    "count": 499,
    "d": "2025-03-17 14:00:00"
  },
  {
    "count": 706,
    "d": "2025-03-17 15:00:00"
  },
  {
    "count": 618,
    "d": "2025-03-17 16:00:00"
  },
  {
    "count": 567,
    "d": "2025-03-17 17:00:00"
  },
  {
    "count": 515,
    "d": "2025-03-17 18:00:00"
  },
  {
    "count": 494,
    "d": "2025-03-17 19:00:00"
  },
  {
    "count": 485,
    "d": "2025-03-17 20:00:00"
  },
  {
    "count": 477,
    "d": "2025-03-17 21:00:00"
  },
  {
    "count": 469,
    "d": "2025-03-17 22:00:00"
  },
  {
    "count": 446,
    "d": "2025-03-17 23:00:00"
  },
  {
    "count": 450,
    "d": "2025-03-18 00:00:00"
  },
  {
    "count": 463,
    "d": "2025-03-18 01:00:00"
  },
  {
    "count": 472,
    "d": "2025-03-18 02:00:00"
  },
  {
    "count": 460,
    "d": "2025-03-18 03:00:00"
  },
  {
    "count": 913,
    "d": "2025-03-18 04:00:00"
  },
  {
    "count": 781,
    "d": "2025-03-18 05:00:00"
  },
  {
    "count": 619,
    "d": "2025-03-18 06:00:00"
  },
  {
    "count": 464,
    "d": "2025-03-18 07:00:00"
  },
  {
    "count": 468,
    "d": "2025-03-18 08:00:00"
  },
  {
    "count": 468,
    "d": "2025-03-18 09:00:00"
  },
  {
    "count": 604,
    "d": "2025-03-18 10:00:00"
  },
  {
    "count": 495,
    "d": "2025-03-18 11:00:00"
  },
  {
    "count": 483,
    "d": "2025-03-18 12:00:00"
  },
  {
    "count": 489,
    "d": "2025-03-18 13:00:00"
  },
  {
    "count": 560,
    "d": "2025-03-18 14:00:00"
  },
  {
    "count": 694,
    "d": "2025-03-18 15:00:00"
  },
  {
    "count": 582,
    "d": "2025-03-18 16:00:00"
  },
  {
    "count": 548,
    "d": "2025-03-18 17:00:00"
  },
  {
    "count": 519,
    "d": "2025-03-18 18:00:00"
  },
  {
    "count": 529,
    "d": "2025-03-18 19:00:00"
  },
  {
    "count": 483,
    "d": "2025-03-18 20:00:00"
  },
  {
    "count": 472,
    "d": "2025-03-18 21:00:00"
  },
  {
    "count": 471,
    "d": "2025-03-18 22:00:00"
  },
  {
    "count": 454,
    "d": "2025-03-18 23:00:00"
  },
  {
    "count": 457,
    "d": "2025-03-19 00:00:00"
  },
  {
    "count": 461,
    "d": "2025-03-19 01:00:00"
  },
  {
    "count": 445,
    "d": "2025-03-19 02:00:00"
  },
  {
    "count": 421,
    "d": "2025-03-19 03:00:00"
  },
  {
    "count": 844,
    "d": "2025-03-19 04:00:00"
  },
  {
    "count": 761,
    "d": "2025-03-19 05:00:00"
  },
  {
    "count": 603,
    "d": "2025-03-19 06:00:00"
  },
  {
    "count": 457,
    "d": "2025-03-19 07:00:00"
  },
  {
    "count": 469,
    "d": "2025-03-19 08:00:00"
  },
  {
    "count": 457,
    "d": "2025-03-19 09:00:00"
  },
  {
    "count": 590,
    "d": "2025-03-19 10:00:00"
  },
  {
    "count": 485,
    "d": "2025-03-19 11:00:00"
  },
  {
    "count": 481,
    "d": "2025-03-19 12:00:00"
  },
  {
    "count": 478,
    "d": "2025-03-19 13:00:00"
  },
  {
    "count": 479,
    "d": "2025-03-19 14:00:00"
  },
  {
    "count": 561,
    "d": "2025-03-19 15:00:00"
  },
  {
    "count": 475,
    "d": "2025-03-19 16:00:00"
  },
  {
    "count": 477,
    "d": "2025-03-19 17:00:00"
  },
  {
    "count": 478,
    "d": "2025-03-19 18:00:00"
  },
  {
    "count": 477,
    "d": "2025-03-19 19:00:00"
  },
  {
    "count": 473,
    "d": "2025-03-19 20:00:00"
  },
  {
    "count": 469,
    "d": "2025-03-19 21:00:00"
  },
  {
    "count": 475,
    "d": "2025-03-19 22:00:00"
  },
  {
    "count": 451,
    "d": "2025-03-19 23:00:00"
  },
  {
    "count": 453,
    "d": "2025-03-20 00:00:00"
  },
  {
    "count": 456,
    "d": "2025-03-20 01:00:00"
  },
  {
    "count": 452,
    "d": "2025-03-20 02:00:00"
  },
  {
    "count": 415,
    "d": "2025-03-20 03:00:00"
  },
  {
    "count": 823,
    "d": "2025-03-20 04:00:00"
  },
  {
    "count": 796,
    "d": "2025-03-20 05:00:00"
  },
  {
    "count": 769,
    "d": "2025-03-20 06:00:00"
  },
  {
    "count": 700,
    "d": "2025-03-20 07:00:00"
  },
  {
    "count": 632,
    "d": "2025-03-20 08:00:00"
  },
  {
    "count": 665,
    "d": "2025-03-20 09:00:00"
  },
  {
    "count": 590,
    "d": "2025-03-20 10:00:00"
  },
  {
    "count": 621,
    "d": "2025-03-20 11:00:00"
  },
  {
    "count": 532,
    "d": "2025-03-20 12:00:00"
  },
  {
    "count": 487,
    "d": "2025-03-20 13:00:00"
  },
  {
    "count": 452,
    "d": "2025-03-20 14:00:00"
  },
  {
    "count": 661,
    "d": "2025-03-20 15:00:00"
  },
  {
    "count": 515,
    "d": "2025-03-20 16:00:00"
  },
  {
    "count": 645,
    "d": "2025-03-20 17:00:00"
  },
  {
    "count": 593,
    "d": "2025-03-20 18:00:00"
  },
  {
    "count": 536,
    "d": "2025-03-20 19:00:00"
  },
  {
    "count": 478,
    "d": "2025-03-20 20:00:00"
  },
  {
    "count": 464,
    "d": "2025-03-20 21:00:00"
  },
  {
    "count": 417,
    "d": "2025-03-20 22:00:00"
  },
  {
    "count": 389,
    "d": "2025-03-20 23:00:00"
  },
  {
    "count": 376,
    "d": "2025-03-21 00:00:00"
  },
  {
    "count": 405,
    "d": "2025-03-21 01:00:00"
  },
  {
    "count": 362,
    "d": "2025-03-21 02:00:00"
  },
  {
    "count": 347,
    "d": "2025-03-21 03:00:00"
  },
  {
    "count": 734,
    "d": "2025-03-21 04:00:00"
  },
  {
    "count": 612,
    "d": "2025-03-21 05:00:00"
  },
  {
    "count": 532,
    "d": "2025-03-21 06:00:00"
  },
  {
    "count": 400,
    "d": "2025-03-21 07:00:00"
  },
  {
    "count": 458,
    "d": "2025-03-21 08:00:00"
  },
  {
    "count": 402,
    "d": "2025-03-21 09:00:00"
  },
  {
    "count": 403,
    "d": "2025-03-21 10:00:00"
  },
  {
    "count": 570,
    "d": "2025-03-21 11:00:00"
  },
  {
    "count": 434,
    "d": "2025-03-21 12:00:00"
  },
  {
    "count": 410,
    "d": "2025-03-21 13:00:00"
  },
  {
    "count": 516,
    "d": "2025-03-21 14:00:00"
  },
  {
    "count": 599,
    "d": "2025-03-21 15:00:00"
  },
  {
    "count": 480,
    "d": "2025-03-21 16:00:00"
  },
  {
    "count": 465,
    "d": "2025-03-21 17:00:00"
  },
  {
    "count": 474,
    "d": "2025-03-21 18:00:00"
  },
  {
    "count": 490,
    "d": "2025-03-21 19:00:00"
  },
  {
    "count": 574,
    "d": "2025-03-21 20:00:00"
  },
  {
    "count": 477,
    "d": "2025-03-21 21:00:00"
  },
  {
    "count": 412,
    "d": "2025-03-21 22:00:00"
  },
  {
    "count": 387,
    "d": "2025-03-21 23:00:00"
  },
  {
    "count": 359,
    "d": "2025-03-22 00:00:00"
  },
  {
    "count": 362,
    "d": "2025-03-22 01:00:00"
  },
  {
    "count": 328,
    "d": "2025-03-22 02:00:00"
  },
  {
    "count": 298,
    "d": "2025-03-22 03:00:00"
  },
  {
    "count": 722,
    "d": "2025-03-22 04:00:00"
  },
  {
    "count": 582,
    "d": "2025-03-22 05:00:00"
  },
  {
    "count": 371,
    "d": "2025-03-22 06:00:00"
  },
  {
    "count": 391,
    "d": "2025-03-22 07:00:00"
  },
  {
    "count": 411,
    "d": "2025-03-22 08:00:00"
  },
  {
    "count": 402,
    "d": "2025-03-22 09:00:00"
  },
  {
    "count": 368,
    "d": "2025-03-22 10:00:00"
  },
  {
    "count": 581,
    "d": "2025-03-22 11:00:00"
  },
  {
    "count": 443,
    "d": "2025-03-22 12:00:00"
  },
  {
    "count": 438,
    "d": "2025-03-22 13:00:00"
  },
  {
    "count": 556,
    "d": "2025-03-22 14:00:00"
  },
  {
    "count": 588,
    "d": "2025-03-22 15:00:00"
  },
  {
    "count": 499,
    "d": "2025-03-22 16:00:00"
  },
  {
    "count": 475,
    "d": "2025-03-22 17:00:00"
  },
  {
    "count": 457,
    "d": "2025-03-22 18:00:00"
  },
  {
    "count": 500,
    "d": "2025-03-22 19:00:00"
  },
  {
    "count": 484,
    "d": "2025-03-22 20:00:00"
  },
  {
    "count": 420,
    "d": "2025-03-22 21:00:00"
  },
  {
    "count": 413,
    "d": "2025-03-22 22:00:00"
  },
  {
    "count": 372,
    "d": "2025-03-22 23:00:00"
  },
  {
    "count": 378,
    "d": "2025-03-23 00:00:00"
  },
  {
    "count": 361,
    "d": "2025-03-23 01:00:00"
  },
  {
    "count": 329,
    "d": "2025-03-23 02:00:00"
  },
  {
    "count": 313,
    "d": "2025-03-23 03:00:00"
  },
  {
    "count": 744,
    "d": "2025-03-23 04:00:00"
  },
  {
    "count": 468,
    "d": "2025-03-23 05:00:00"
  },
  {
    "count": 463,
    "d": "2025-03-23 06:00:00"
  },
  {
    "count": 359,
    "d": "2025-03-23 07:00:00"
  },
  {
    "count": 375,
    "d": "2025-03-23 08:00:00"
  },
  {
    "count": 355,
    "d": "2025-03-23 09:00:00"
  },
  {
    "count": 348,
    "d": "2025-03-23 10:00:00"
  },
  {
    "count": 511,
    "d": "2025-03-23 11:00:00"
  },
  {
    "count": 388,
    "d": "2025-03-23 12:00:00"
  },
  {
    "count": 390,
    "d": "2025-03-23 13:00:00"
  },
  {
    "count": 497,
    "d": "2025-03-23 14:00:00"
  },
  {
    "count": 540,
    "d": "2025-03-23 15:00:00"
  },
  {
    "count": 452,
    "d": "2025-03-23 16:00:00"
  },
  {
    "count": 428,
    "d": "2025-03-23 17:00:00"
  },
  {
    "count": 451,
    "d": "2025-03-23 18:00:00"
  },
  {
    "count": 464,
    "d": "2025-03-23 19:00:00"
  },
  {
    "count": 518,
    "d": "2025-03-23 20:00:00"
  },
  {
    "count": 455,
    "d": "2025-03-23 21:00:00"
  },
  {
    "count": 405,
    "d": "2025-03-23 22:00:00"
  },
  {
    "count": 383,
    "d": "2025-03-23 23:00:00"
  },
  {
    "count": 383,
    "d": "2025-03-24 00:00:00"
  },
  {
    "count": 381,
    "d": "2025-03-24 01:00:00"
  },
  {
    "count": 357,
    "d": "2025-03-24 02:00:00"
  },
  {
    "count": 328,
    "d": "2025-03-24 03:00:00"
  },
  {
    "count": 738,
    "d": "2025-03-24 04:00:00"
  },
  {
    "count": 525,
    "d": "2025-03-24 05:00:00"
  },
  {
    "count": 430,
    "d": "2025-03-24 06:00:00"
  },
  {
    "count": 513,
    "d": "2025-03-24 07:00:00"
  },
  {
    "count": 615,
    "d": "2025-03-24 08:00:00"
  },
  {
    "count": 448,
    "d": "2025-03-24 09:00:00"
  },
  {
    "count": 497,
    "d": "2025-03-24 10:00:00"
  },
  {
    "count": 580,
    "d": "2025-03-24 11:00:00"
  },
  {
    "count": 421,
    "d": "2025-03-24 12:00:00"
  },
  {
    "count": 440,
    "d": "2025-03-24 13:00:00"
  },
  {
    "count": 520,
    "d": "2025-03-24 14:00:00"
  },
  {
    "count": 729,
    "d": "2025-03-24 15:00:00"
  },
  {
    "count": 502,
    "d": "2025-03-24 16:00:00"
  },
  {
    "count": 477,
    "d": "2025-03-24 17:00:00"
  },
  {
    "count": 483,
    "d": "2025-03-24 18:00:00"
  },
  {
    "count": 497,
    "d": "2025-03-24 19:00:00"
  },
  {
    "count": 515,
    "d": "2025-03-24 20:00:00"
  },
  {
    "count": 488,
    "d": "2025-03-24 21:00:00"
  },
  {
    "count": 27,
    "d": "2025-03-24 22:00:00"
  },
  {
    "count": 383,
    "d": "2025-04-01 00:00:00"
  },
  {
    "count": 381,
    "d": "2025-04-01 01:00:00"
  },
  {
    "count": 357,
    "d": "2025-04-01 02:00:00"
  },
  {
    "count": 328,
    "d": "2025-04-01 03:00:00"
  },
  {
    "count": 738,
    "d": "2025-04-01 04:00:00"
  },
  {
    "count": 525,
    "d": "2025-04-01 05:00:00"
  },
  {
    "count": 430,
    "d": "2025-04-01 06:00:00"
  },
  {
    "count": 513,
    "d": "2025-04-01 07:00:00"
  },
  {
    "count": 615,
    "d": "2025-04-01 08:00:00"
  },
  {
    "count": 448,
    "d": "2025-04-01 09:00:00"
  },
  {
    "count": 497,
    "d": "2025-04-01 10:00:00"
  },
  {
    "count": 580,
    "d": "2025-04-01 11:00:00"
  },
  {
    "count": 421,
    "d": "2025-04-01 12:00:00"
  },
  {
    "count": 440,
    "d": "2025-04-01 13:00:00"
  },
  {
    "count": 520,
    "d": "2025-04-01 14:00:00"
  },
  {
    "count": 729,
    "d": "2025-04-01 15:00:00"
  },
  {
    "count": 502,
    "d": "2025-04-01 16:00:00"
  },
  {
    "count": 477,
    "d": "2025-04-01 17:00:00"
  },
  {
    "count": 483,
    "d": "2025-04-01 18:00:00"
  },
  {
    "count": 497,
    "d": "2025-04-01 19:00:00"
  },
  {
    "count": 515,
    "d": "2025-04-01 20:00:00"
  },
  {
    "count": 0,
    "d": "2025-04-01 21:00:00"
  },
  {
    "count": 0,
    "d": "2025-04-01 22:00:00"
  },
]

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
  const [processedChartData, setProcessedChartData] = useState<any[]>([]);

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
        today: { first: 0, last: 23 },
        yesterday: { first: 0, last: 23 },
        lastWeek: { first: 0, last: 23 }
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
    try {
      const data = await getLogsCountPerHour(cluster, type);
      const transformedData = transformLogsToMultiLineChartData(sampledata);
      const processed = processChartData(transformedData);
      setProcessedChartData(processed);
    } catch (error) {
      console.error('Error fetching chart data:', error);
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