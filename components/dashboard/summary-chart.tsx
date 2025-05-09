"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  ChartTooltip,
  ChartLegend,
  Filler
);

// to come real user metrics
const nutrientData = [
  { name: "Mon", calories: 1800, protein: 90, carbs: 220, fat: 60 },
  { name: "Tue", calories: 2100, protein: 110, carbs: 200, fat: 80 },
  { name: "Wed", calories: 1900, protein: 100, carbs: 180, fat: 70 },
  { name: "Thu", calories: 2000, protein: 105, carbs: 190, fat: 75 },
  { name: "Fri", calories: 2200, protein: 115, carbs: 210, fat: 85 },
  { name: "Sat", calories: 2300, protein: 120, carbs: 230, fat: 90 },
  { name: "Sun", calories: 1950, protein: 100, carbs: 190, fat: 75 },
];

const wellnessData = [
  { name: "Mon", score: 75 },
  { name: "Tue", score: 80 },
  { name: "Wed", score: 78 },
  { name: "Thu", score: 82 },
  { name: "Fri", score: 85 },
  { name: "Sat", score: 88 },
  { name: "Sun", score: 86 },
];

export function SummaryChart() {
  const [timeRange, setTimeRange] = useState("week");

  const nutritionChartData = {
    labels: nutrientData.map(item => item.name),
    datasets: [
      {
        label: 'Protein (g)',
        data: nutrientData.map(item => item.protein),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Carbs (g)',
        data: nutrientData.map(item => item.carbs),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
      {
        label: 'Fat (g)',
        data: nutrientData.map(item => item.fat),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const wellnessChartData = {
    labels: wellnessData.map(item => item.name),
    datasets: [
      {
        label: 'Wellness Score',
        data: wellnessData.map(item => item.score),
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(var(--muted), 0.1)',
        },
      },
      x: {
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          font: {
            size: 12,
          },
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'hsl(var(--foreground))',
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'hsl(var(--card))',
        titleColor: 'hsl(var(--foreground))',
        bodyColor: 'hsl(var(--foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        padding: 10,
      },
    },
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Nutrition Insights</CardTitle>
            <CardDescription>
              Overview of your nutritional intake and wellness score
            </CardDescription>
          </div>
          
          <Tabs defaultValue="week" onValueChange={setTimeRange} className="w-[200px] hidden">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="nutrition">
          <TabsList className="mb-4">
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="wellness">Wellness Score</TabsTrigger>
          </TabsList>
          
          <TabsContent value="nutrition" className="mt-0">
            <div className="h-[340px] w-full">
              <Bar data={nutritionChartData} options={chartOptions} />
            </div>
          </TabsContent>
          
          <TabsContent value="wellness" className="mt-0">
            <div className="h-[300px] w-full">
              <Line data={wellnessChartData} options={chartOptions} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}