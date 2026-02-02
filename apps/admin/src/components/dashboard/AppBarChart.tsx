"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart";

const chartConfig = {
    total: {
        label: "Total",
        color: "var(--chart-1)"
    },
    successful: {
        label: "Successful",
        color: "var(--chart-2)"
    },
    pending: {
        label: "Pending",
        color: "var(--chart-3)"
    },
    failed: {
        label: "Failed",
        color: "var(--chart-4)"
    }
} satisfies ChartConfig;

const chartData = [
    { month: "January", total: 186, successful: 130, pending: 26, failed: 30 },
    { month: "February", total: 200, successful: 140, pending: 30, failed: 30 },
    { month: "March", total: 150, successful: 100, pending: 20, failed: 30 },
    { month: "April", total: 190, successful: 130, pending: 30, failed: 30 },
    { month: "May", total: 210, successful: 150, pending: 30, failed: 30 },
    { month: "June", total: 170, successful: 120, pending: 20, failed: 30 },
    { month: "July", total: 209, successful: 159, pending: 20, failed: 30 },
    { month: "August", total: 214, successful: 164, pending: 20, failed: 30 },
    { month: "September", total: 198, successful: 148, pending: 20, failed: 30 },
    { month: "October", total: 220, successful: 170, pending: 20, failed: 30 },
    { month: "November", total: 190, successful: 140, pending: 20, failed: 30 },
    { month: "December", total: 210, successful: 160, pending: 20, failed: 30 },
]


const AppAreaChart = () => {
    return (
        <div className="">
            <h1 className="text-lg font-semibold mb-6">Total Revenue</h1>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="successful" fill="var(--color-successful)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pending" fill="var(--color-pending)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="failed" fill="var(--color-failed)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ChartContainer>
        </div>
    );
};

export default AppAreaChart;