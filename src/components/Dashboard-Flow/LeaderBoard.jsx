"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import SidebarLayout from "../Layouts/SideBarLayout"
import GlobalApi from "../../../utils/GlobalApi"

const TABS = ["This week", "Last 30 days", "All time"]

const TOP_USERS = [
    {
        id: 1,
        name: "Harry Wilson",
        country: "United Kingdom",
        total_coins: "20 Million",
        profile_pic: `https://picsum.photos/150?random=2`,
        position: 2,
    },
    {
        id: 2,
        name: "John Doe",
        country: "United States",
        total_coins: "20 Million",
        profile_pic: `https://picsum.photos/150?random=1`,
        position: 1,
    },
    {
        id: 3,
        name: "Jane Smith",
        country: "United States",
        total_coins: "20 Million",
        profile_pic: `https://picsum.photos/150?random=3`,
        position: 3,
    },
]

const LIST_USERS = Array(5)
    .fill({
        id: 4,
        name: "Jimmy Lee",
        country: "Canada",
        total_coins: "4321 pts",
        rank: "$ 97277",
        profile_pic: `https://picsum.photos/150?random=4`,
    })
    .map((user, index) => ({
        ...user,
        id: user.id + index,
        profile_pic: `https://picsum.photos/150?random=${index + 4}`,
    }))

export default function Leaderboard() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("This week")
    const [topUsersData, setTopUsersData] = useState(TOP_USERS)
    const [remainingUsersData, setRemainingUsersData] = useState(LIST_USERS)
    const [loading, setLoading] = useState(false)

    let token = null;

    const getData = async (index = 0) => {
        try {
            setLoading(true)

            const response = await GlobalApi.getleaderboad(token);

            console.log('rr', response);

            if (response?.action === "success") {
                const { topUsers, otherUsers } = response?.leaderboards;
                const mappedTopUsers = topUsers.map(user => ({
                    id: user.id,
                    name: user.name,
                    country: user.country || "Unknown",
                    total_coins: `${(user.total_coins / 1_000_000).toFixed(1)} Million`,
                    profile_pic: user.profile_pic || "/placeholder.svg",
                    position: user.position,
                }));

                const mappedOtherUsers = otherUsers.map((user, i) => ({
                    id: user.id,
                    name: user.name,
                    country: user.country || "Unknown",
                    total_coins: `${user.total_coins} pts`,
                    rank: user.rank || `$${(user.total_coins * 2).toFixed(0)}`,
                    profile_pic: user.profile_pic || "/placeholder.svg",
                }));

                setTopUsersData(mappedTopUsers);
                setRemainingUsersData(mappedOtherUsers);
            }

            if (index === 0) {
                setTopUsersData(TOP_USERS)
                setRemainingUsersData(LIST_USERS)
            } else if (index === 1) {
                setTopUsersData(
                    TOP_USERS.map((user) => ({
                        ...user,
                        total_coins: `${Math.floor(Math.random() * 15) + 5} Million`,
                    })),
                )
                setRemainingUsersData(
                    LIST_USERS.map((user) => ({
                        ...user,
                        total_coins: `${Math.floor(Math.random() * 4000) + 1000} pts`,
                    })),
                )
            } else if (index === 2) {
                setTopUsersData(
                    TOP_USERS.map((user) => ({
                        ...user,
                        total_coins: `${Math.floor(Math.random() * 50) + 20} Million`,
                    })),
                )
                setRemainingUsersData(
                    LIST_USERS.map((user) => ({
                        ...user,
                        total_coins: `${Math.floor(Math.random() * 10000) + 5000} pts`,
                    })),
                )
            }
        } catch (error) {
            console.error("Error fetching leaderboard data:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getData(TABS.indexOf(activeTab))
        token = localStorage.getItem('token');
    }, [activeTab])

    const sortedTopUsers = [...topUsersData].sort((a, b) => {
        if (a.position === 2) return -1
        if (b.position === 2) return 1
        if (a.position === 1) return -1
        if (b.position === 1) return 1
        return a.position - b.position
    })

    const renderListItem = useCallback(
        (user, index) => (
            <Card
                key={user.id}
                className="flex items-center py-3 px-4 border-b border-black/5 hover:bg-gray-50 transition-colors mb-2 mx-2"
            >
                <div className="flex items-center justify-center w-8 mr-3 font-semibold text-gray-500">{index + 4}</div>
                <Image
                    src={user.profile_pic || "/placeholder.svg?height=150&width=150"}
                    alt={user.name}
                    width={46}
                    height={46}
                    className="rounded-full mr-3 object-cover w-[46px] h-[46px] border-2 border-gray-100"
                />
                <div className="flex-1">
                    <h3 className="text-[15px] font-medium text-gray-800 mb-1">{user.name}</h3>
                    <div className="flex items-center flex-wrap">
                        <span className="text-gray-600 text-xs">{user.country}</span>
                        <span className="text-gray-400 mx-1.5">•</span>
                        <span className="text-emerald-600 text-xs font-medium">{user.total_coins}</span>
                        <span className="text-gray-400 mx-1.5">•</span>
                        <span className="text-gray-600 text-xs">{user.rank || "$10"}</span>
                    </div>
                </div>
            </Card>
        ),
        [],
    )

    return (
        <SidebarLayout>
            <div className="flex flex-col min-h-screen bg-[#049C01] w-full">
                <div className="flex items-center justify-center px-4 h-[60px]">
                    <h1 className="text-xl font-bold text-white">Leader Boards</h1>
                </div>

                <div className="flex justify-center items-center my-4">
                    <Tabs defaultValue="This week" value={activeTab} onValueChange={setActiveTab} className="w-full max-w-full border-t border-b rounded-md">
                        <TabsList className="grid grid-cols-3 bg-[#049C01]/30 backdrop-blur-sm">
                            {TABS.map((tab) => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/80"
                                >
                                    {tab}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>

                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-50">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                    </div>
                )}

                <div className="flex-1 flex flex-col">
                    <div className="relative px-12 pt-4">
                        <div className="flex items-end h-full">
                            {sortedTopUsers.map((user) => {
                                const podiumHeight =
                                    user.position === 1
                                        ? "h-[180px] md:h-[220px]"
                                        : user.position === 2
                                            ? "h-[140px] md:h-[180px]"
                                            : "h-[100px] md:h-[140px]"

                                const podiumWidth = user.position === 1 ? "w-[38%]" : "w-[33%]"

                                return (
                                    <div key={user.id} className={`flex flex-col items-center ${podiumWidth}`}>
                                        <div className="relative z-10 mb-2">
                                            <div className="rounded-full overflow-hidden border-4 border-white shadow-lg w-16 h-16 md:w-20 md:h-20">
                                                <Image
                                                    src={user.profile_pic || "/placeholder.svg?height=150&width=150"}
                                                    alt={user.name}
                                                    width={80}
                                                    height={80}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="text-center z-10 mb-2">
                                            <h3 className="text-white text-sm font-medium truncate max-w-[100px] md:max-w-[120px]">
                                                {user.name}
                                            </h3>
                                            <p className="text-white/80 text-xs">{user.country}</p>
                                        </div>

                                        <div
                                            className={`relative w-full ${podiumHeight} bg-[#7CDF7F] flex flex-col justify-end items-center`}
                                            style={{
                                                clipPath: "polygon(22% 100%, 0.5% 0%, 100.5% -14%, 80% 100%)",
                                                marginTop: "10px",
                                            }}
                                        >
                                            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-[#9747FF] flex items-center justify-center">
                                                <span className="text-white font-bold">{user.position}</span>
                                            </div>

                                            <div className="mb-4 text-center">
                                                <p className="text-[#049C01] font-bold">{user.total_coins}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="bg-white rounded-t-3xl flex-1 shadow-lg overflow-hidden mx-6">
                        <div className="pt-4 pb-2 px-4 border-b border-gray-100">
                            <h2 className="text-gray-800 font-semibold">Other Rankings</h2>
                        </div>
                        <div className="h-full overflow-y-auto">
                            {remainingUsersData.map(renderListItem)}
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    )
}
