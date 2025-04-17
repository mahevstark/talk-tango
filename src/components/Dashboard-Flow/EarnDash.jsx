"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ArrowUp, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SidebarLayout from "../Layouts/SideBarLayout"
import GlobalApi from "../../../utils/GlobalApi"

export default function EarningsDashboard() {
    const [timeframe, setTimeframe] = useState("today")
    const [totalearning, setTotalEarnings] = useState(0);
    const [weekData, setWeekData] = useState([]);
    const [todayData, setTodayData] = useState([]);

    // Sample data for the charts


    let token = null;

    const getEarnings = async () => {
        try {
            const response = await GlobalApi.getearning(token);

            console.log('errr', response);

            if (response?.action === "success") {
                const formattedToday = response?.earningsData?.map((item) => ({
                    time: item.time,
                    amount: item.earnings,
                }));

                const formattedWeek = response?.weeklyData?.map((item) => ({
                    day: item.day,
                    amount: item.earnings,
                }));

                setTodayData(formattedToday);
                setWeekData(formattedWeek);
                setTotalEarnings(response?.totalEarnings)
            }
            else {
                setTotalEarnings(0)
            }
        } catch (error) {
            console.log('error getting earnign data', error);

        }
    }

    useEffect(() => {

        token = localStorage.getItem('token');

        if (token) {
            getEarnings();
        }
    })

    return (
        <SidebarLayout><div className="w-full mx-auto ">
            <Card className="overflow-hidden min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 border-slate-200 dark:border-slate-800 shadow-xl">
                <CardHeader className="bg-[#049C01] text-white p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardDescription className="text-indigo-100 mb-1">Total Earnings</CardDescription>
                            <div className="flex items-baseline">
                                <CardTitle className="text-3xl md:text-4xl font-bold">{totalearning}</CardTitle>
                                <span className="ml-2 px-2 py-0.5 bg-green-500 text-white text-xs  flex items-center">
                                    <ArrowUp className="h-3 w-3 mr-0.5" />
                                    4.5%
                                </span>
                            </div>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                                    Earnings
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            {/* <DropdownMenuContent align="end">
                                <DropdownMenuItem>Earnings</DropdownMenuItem>
                                <DropdownMenuItem>Referrals</DropdownMenuItem>
                                <DropdownMenuItem>Conversions</DropdownMenuItem>
                            </DropdownMenuContent> */}
                        </DropdownMenu>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <Tabs defaultValue="today" className="w-full" onValueChange={setTimeframe}>
                        <div className="px-6 pt-6 pb-2 flex justify-between items-center">
                            <TabsList className="bg-slate-100 dark:bg-slate-800">
                                <TabsTrigger value="today">Today's Activity</TabsTrigger>
                                <TabsTrigger value="week">Last 7 Days</TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="p-6 pt-2">
                            <TabsContent value="today" className="mt-0">
                                <div className="h-[300px] mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={todayData} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
                                            <defs>
                                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 12 }}
                                                tickFormatter={(value) => `$${value}`}
                                                dx={-10}
                                            />
                                            <Tooltip
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        return (
                                                            <div className="bg-white dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700 shadow-md">
                                                                <p className="text-sm font-medium">{payload[0].payload.time}</p>
                                                                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                                                    ${payload[0].value?.toFixed(2)}
                                                                </p>
                                                            </div>
                                                        )
                                                    }
                                                    return null
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="amount"
                                                stroke="#6366f1"
                                                strokeWidth={3}
                                                dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                                                activeDot={{ r: 6, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                                                fill="url(#colorAmount)"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </TabsContent>

                            <TabsContent value="week" className="mt-0">
                                <div className="h-[300px] mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={weekData} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
                                            <defs>
                                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#8b5cf6" />
                                                    <stop offset="100%" stopColor="#6366f1" />
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 12 }}
                                                tickFormatter={(value) => `$${value}`}
                                                dx={-10}
                                            />
                                            <Tooltip
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        return (
                                                            <div className="bg-white dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700 rounded-md shadow-md">
                                                                <p className="text-sm font-medium">{payload[0].payload.day}</p>
                                                                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                                                    ${payload[0].value?.toFixed(2)}
                                                                </p>
                                                            </div>
                                                        )
                                                    }
                                                    return null
                                                }}
                                            />
                                            <Bar dataKey="amount" fill="url(#barGradient)" radius={[4, 4, 0, 0]} barSize={36} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>


                </CardContent>
            </Card>
        </div></SidebarLayout>
    )
}
