"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { Coins, Plus, ArrowLeft } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import GlobalApi from '../../../../utils/GlobalApi'


export default function DailyRewards() {
    const [userCoins, setUserCoins] = useState(0)
    const [days, setDays] = useState([])
    const [showAnimation, setShowAnimation] = useState(false)
    const [collectedAmount, setCollectedAmount] = useState(0)
    const router = useRouter()
    const [username, setUsername] = useState(null);
    const [image, setImage] = useState(null);

    let token = null;




    const getAwards = async () => {
        try {
            const response = await GlobalApi.getReward(token);


            if (response?.action === "success") {
                const today = new Date().toISOString().split("T")[0];
                const mappedDays = response?.data.map((item, index) => ({
                    day: item.day,
                    coins: item.coins,
                    collected: item.is_missed === 0,
                    current: item.date === today,
                    special: item.day === "Sun",
                    date: item.date,
                }));
                setUserCoins(response?.total_coins)
                setDays(mappedDays);
            }
        } catch (error) {
            console.log('error while getting rewards', error);

        }
    }

    useEffect(() => {


        token = localStorage.getItem("token");
        const name = localStorage.getItem("name");
        const image = localStorage.getItem("image");
        setImage(image);
        setUsername(name)


        if (token) {
            getAwards();
        }



    }, [])

    const collectReward = (index) => {
        if (days[index].current && !days[index].collected) {
            const newDays = [...days]
            newDays[index].collected = true
            setDays(newDays)
            setCollectedAmount(days[index].coins)
            setShowAnimation(true)


            setTimeout(() => {
                setUserCoins(userCoins + days[index].coins)
                setTimeout(() => {
                    setShowAnimation(false)
                }, 500)
            }, 800)
        }
    }

    const handleBack = useCallback(() => {
        router.push('/dashboard/settings')
    }, [router])

    return (
        <>   <div className="flex flex-col  bg-gradient-to-b from-green-50 to-white">
            {/* Header with user info */}
            <div className="bg-[#049C01] text-white p-6 pt-12 pb-16 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-green-400/20 blur-2xl"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-emerald-300/20 blur-xl"></div>

                <div className="relative flex items-center z-10">
                    <button onClick={handleBack} className="text-white hover:bg-white/10 p-2 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/80 mr-4 shadow-md">

                        {
                            image ? <Image src={image} alt="User profile" fill className="object-cover" /> : null
                        }
                    </div>
                    <div className="flex-1">
                        <h2 className="font-bold text-xl">{username}</h2>
                        <p className="text-sm text-white/90 font-medium">Coins you get</p>
                    </div>
                    <motion.div
                        className="flex items-center bg-white text-black rounded-full px-4 py-2 shadow-md"
                        animate={showAnimation ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.4 }}
                    >
                        <Coins className="w-5 h-5 mr-2 text-amber-500" />
                        <span className="font-bold text-lg">
                            {showAnimation ? (
                                <motion.span
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {userCoins + collectedAmount}
                                </motion.span>
                            ) : (
                                userCoins
                            )}
                        </span>
                    </motion.div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 px-4 py-6 max-w-6xl mx-auto w-full -mt-10 relative z-10">
                {/* Daily rewards card */}
                <Card className="bg-white shadow-xl rounded-2xl overflow-hidden mb-8 border-none">
                    <div className="p-5 bg-[#049C01] text-white">
                        <h3 className="font-bold text-xl flex items-center">
                            <Coins className="w-5 h-5 mr-2 text-amber-400" />
                            Daily Rewards
                        </h3>
                        <p className="text-sm text-white/80 mt-1">Collect coins every day to earn special rewards!</p>
                    </div>

                    <div className="p-5">
                        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                            {days.map((day, index) => (
                                <motion.button
                                    key={day.day}
                                    onClick={() => collectReward(index)}
                                    disabled={!day.current || day.collected}
                                    className={cn(
                                        "relative flex flex-col items-center justify-between rounded-xl p-3 h-28 sm:h-32 transition-all",
                                        day.current
                                            ? "bg-[#049C01] text-white"
                                            : day.collected
                                                ? "bg-[#A2A2A2] text-[#868686]"
                                                : "bg-[#F2F2F2]",
                                        day.special &&
                                        !day.collected &&
                                        !day.current &&
                                        "bg-gradient-to-b from-amber-50 to-amber-100 border-amber-200",
                                    )}
                                    whileHover={day.current ? { scale: 1.05 } : {}}
                                    whileTap={day.current ? { scale: 0.98 } : {}}
                                >


                                    <span
                                        className={cn(
                                            "text-sm font-bold",
                                            day.special && !day.collected && !day.current && "text-amber-700",
                                        )}
                                    >
                                        {day.day}
                                    </span>

                                    {day.special ? (
                                        <div className="relative w-14 h-14 my-1">
                                            <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-md"></div>
                                            <Image
                                                src="/reward/bag.svg"
                                                alt="Treasure chest"
                                                width={56}
                                                height={56}
                                                className="object-contain relative z-10"
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className={cn(
                                                "w-12 h-12 rounded-full flex items-center justify-center",

                                            )}
                                        >
                                            {!day.current && !day.collected ? (
                                                <Image src="/reward/coin.svg" width={40} height={40} alt="coin" />
                                            ) : (
                                                <Image src="/reward/check.svg" width={40} height={40} alt="check" />
                                            )}

                                        </div>
                                    )}

                                    <span
                                        className={cn(
                                            "text-xs font-bold",
                                            day.current
                                                ? "text-white"
                                                : day.special && !day.collected && !day.current
                                                    ? "text-amber-700"
                                                    : "",
                                        )}
                                    >
                                        {day.coins} Coins
                                    </span>

                                    {day.current && !day.collected && (
                                        <motion.div
                                            className="absolute inset-0 bg-white/20 rounded-xl"
                                            animate={{ opacity: [0.2, 0.4, 0.2] }}
                                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-500">
                                <span className="font-semibold text-green-600">Tip:</span> Come back every day to collect more coins!
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Illustration section with enhanced styling */}

            </div>

            {/* Floating action button with animation */}


            {/* Coin collection animation */}
            {showAnimation && (
                <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0.5, y: 100, opacity: 0 }}
                        animate={{ scale: 1.5, y: -100, opacity: [0, 1, 0] }}
                        transition={{ duration: 1 }}
                        className="flex items-center bg-amber-400 text-black rounded-full px-4 py-2 shadow-lg"
                    >
                        <Coins className="w-5 h-5 mr-2 text-amber-800" />
                        <span className="font-bold">+{collectedAmount}</span>
                    </motion.div>
                </div>
            )}
        </div>
            <div className="flex justify-center items-center px-4 ">
                <div className="relative w-full max-w-4xl h-[260px] md:h-[500px] bg-gradient-to-b p-4">
                    <Image src="/reward/illus.svg" alt="Rewards illustration" fill className="object-contain" priority />
                </div>
            </div></>
    )
}
