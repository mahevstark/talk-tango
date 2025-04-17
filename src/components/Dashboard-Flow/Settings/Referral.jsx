"use client"

import { useCallback, useState } from "react"
import { Search, Copy, Share2, Check, X, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"

const contacts = [
    {
        id: 1,
        name: "Tongkun Lee",
        platform: "Facebook",
        image: "/placeholder.svg?height=60&width=60",
        status: "pending",
    },
    {
        id: 2,
        name: "Rehmem Khihal",
        platform: "Flickr",
        image: "/placeholder.svg?height=60&width=60",
        status: "pending",
    },
]

export default function ReferralPage() {
    const [referralCode] = useState("mfr20220320")
    const [searchQuery, setSearchQuery] = useState("")
    const [copied, setCopied] = useState(false)
    const [contactsList, setContactsList] = useState(contacts)
    const [showPopup, setShowPopup] = useState(false)

    const router = useRouter()
    const handleCopy = () => {
        navigator.clipboard.writeText(referralCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleInvite = (id) => {
        setContactsList(contactsList.map((contact) => (contact.id === id ? { ...contact, status: "accepted" } : contact)))
        setShowPopup(true)
    }

    const handleShare = async () => {
        const message = `Use my referral code ${referralCode} to join and we both earn rewards! ${window.location.href}`

        const shareData = {
            title: "Join with my referral code",
            text: message,
            url: window.location.href,
        }

        try {
            if (navigator.share && navigator.canShare(shareData)) {
                await navigator.share(shareData)
            } else {
                // Fallback logic
                const encodedMessage = encodeURIComponent(message)
                const whatsappUrl = `https://wa.me/?text=${encodedMessage}`

                // Try to open WhatsApp first
                const newWindow = window.open(whatsappUrl, '_blank')
                if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                    // If popup blocked, fallback to copy
                    handleCopy()
                    alert("Referral link copied to clipboard! Share it manually.")
                }
            }
        } catch (error) {
            console.error("Error sharing:", error)
            handleCopy()
            alert("Referral link copied to clipboard! Share it manually.")
        }
    }


    const filteredContacts = contactsList.filter((contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const handleBack = useCallback(() => {
        router.push('/dashboard/messages')
    }, [router])
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex justify-center py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full ">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >

                    <div className="relative flex items-center justify-center py-6">
                        <button
                            onClick={handleBack}
                            className="absolute left-0 text-white bg-[#049C01] p-2 rounded-full"
                        >
                            <ArrowLeft size={20} />
                        </button>

                        <div className="text-center">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">Earn Money By Refer</h1>
                            <p className="text-gray-600 text-sm sm:text-base max-w-sm mx-auto">
                                Share your referral code with friends and earn rewards when they join.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
                        <span className="font-mono text-lg text-gray-700 font-medium">{referralCode}</span>
                        <div className="flex space-x-2">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCopy}
                                className="px-4 py-2 bg-white rounded-lg text-gray-700 font-medium border border-gray-200 hover:bg-gray-50 transition-colors flex items-center"
                            >
                                {copied ? <Check className="h-4 w-4 mr-1 text-green-500" /> : <Copy className="h-4 w-4 mr-1" />}
                                {copied ? "Copied" : "Copy"}
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleShare}
                                className="px-4 py-2 bg-green-600 rounded-lg text-white font-medium hover:bg-green-700 transition-colors flex items-center"
                            >
                                <Share2 className="h-4 w-4 mr-1" />
                                SHARE
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-[#F3F3F3] rounded-xl shadow-lg overflow-hidden"
                >
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Invite a friend</h3>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search contacts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 border focus:ring-green-500 focus:bg-white transition-all"
                            />
                            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                        {filteredContacts.map((contact) => (
                            <motion.div
                                key={contact.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center justify-between p-4 hover:bg-gray-50"
                            >
                                <div className="flex items-center">
                                    <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-gray-200">
                                        <Image src={contact.image || "/placeholder.svg"} alt={contact.name} fill className="object-cover" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-medium text-gray-800">{contact.name}</p>
                                        <p className="text-sm text-gray-500">{contact.platform}</p>
                                    </div>
                                </div>
                                {contact.status === "pending" ? (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleInvite(contact.id)}
                                        className="px-4 py-1.5 bg-green-600 text-white text-sm font-medium rounded-full hover:bg-green-700 transition-colors"
                                    >
                                        Invite
                                    </motion.button>
                                ) : (
                                    <span className="px-4 py-1.5 bg-gray-600 text-white text-sm font-medium rounded-full">Accepted</span>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                        <p className="text-center text-sm text-gray-500">
                            You've invited <span className="font-medium text-green-600">2</span> friends so far
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-6 text-center"
                >
                    <p className="text-sm text-gray-500">
                        Earn <span className="font-medium text-green-600">$10</span> for each friend who joins
                    </p>
                </motion.div>
            </div>

            {/* Congratulations Popup */}
            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={() => setShowPopup(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowPopup(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <div className="flex justify-center mb-4">
                                <Image
                                    src="/reward/coins.svg"
                                    alt="Money coins"
                                    width={190}
                                    height={190}
                                    className="object-contain"
                                />
                            </div>

                            <h3 className="text-xl font-bold text-center text-gray-900 mb-1">Congratulations!</h3>
                            <h4 className="text-lg font-bold text-center text-gray-900 mb-3">You have just earned $50</h4>

                            <p className="text-center text-[#666666] text-sm mb-6">
                                One of your friends has joined by your referral code. Do more invitations to earn more.
                            </p>

                            <button
                                onClick={() => setShowPopup(false)}
                                className="w-full py-2 bg-[#049C01] text-white font-medium rounded-xl transition-colors"
                            >
                                INVITE ANOTHER
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
