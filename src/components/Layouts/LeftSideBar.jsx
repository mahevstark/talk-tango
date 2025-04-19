"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import chat from "../../../public/svgs/chat.svg";
import contact from "../../../public/svgs/contact.svg";
import paymenthistory from "../../../public/svgs/paymenthistory.svg";
import notifications from "../../../public/svgs/notifications.svg"; // Icon for notification
import settings from "../../../public/svgs/settings.svg";
import activechat from "../../../public/svgs/activechat.svg";
import activecontact from "../../../public/svgs/activecontact.svg";
import activepayment from "../../../public/svgs/activepayment.svg";
import leaderboard from '../../../public/svgs/trophy.svg'
import activesettings from "../../../public/svgs/activesettings.svg";
import Image from "next/image";
import Notification from "../../components/Popups/Notification";
import dashb from '../../../public/svgs/wallet.svg'
import activedashb from '../../../public/svgs/activewallet.svg'
import activeleaderboard from '../../../public/svgs/activetrophy.svg'


import { useState, useEffect, useRef } from "react";
export default function LeftSidebar() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const buttonRef = useRef(null);

  const navigation = [
    {
      name: "All Chats",
      href: "/dashboard/messages",
      icon: chat,
      activeicon: activechat,
    },
    {
      name: "Contact List",
      href: "/dashboard/contact-list",
      icon: contact,
      activeicon: activecontact,
    },
    {
      name: "Payment History",
      href: "/dashboard/payment-history",
      icon: paymenthistory,
      activeicon: activepayment,
    },
    {
      name: "Notification",
      icon: notifications,
      activeicon: notifications,
      isNotification: true,
    },
    {
      name: "LeaderBoard",
      href: "/dashboard/leader-board",
      end: false,
      activeicon: activeleaderboard,
      icon: leaderboard,
    }, {
      name: "Earning Dashboard",
      href: "/dashboard/earnings",
      end: false,
      activeicon: activedashb,
      icon: dashb,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      end: true,
      activeicon: activesettings,
      icon: settings,
    },

  ];

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // new functions
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); // Track if notification is open

  // Callback function to handle notification state change
  const handleNotificationStateChange = (isOpen) => {
    setIsNotificationOpen(isOpen); // Update the parent state
    console.log("Notification Opened:", isOpen); // You can log or handle the state change
  };

  return (
    <div className="w-[2px] sm:w-auto sm:h-[100vh]  bg-[#ECECEC] fixed top-0 left-0  z-[1px]  overflow-scroll no-scrollbar">
      <button
        ref={buttonRef}
        onClick={toggleSidebar}
        className="fixed top-4 sm:left-4 z-50 p-2 text-black rounded-md md:hidden"
      >
        {isSidebarOpen ? null : "☰"}
      </button>

      <div
        ref={sidebarRef}
        className={`flex flex-col sm:h-auto min-h-screen w-28 bg-[#ECECEC] border-r justify-between pt-4 transition-transform z-[100000] absolute sm:relative sm:z-0 ${isSidebarOpen ? "transform-none" : "transform -translate-x-full"
          } md:transform-none md:translate-x-0 md:w-28`}
      >
        {navigation.map((item, index) => {
          const isActive =
            pathname === item.href ||
            (item.name === "Settings" && pathname.startsWith("/dashboard/settings")) ||
            (item.name === "All Chats" &&
              pathname.startsWith("/dashboard/messages") &&
              !pathname.includes("contact-list")) ||
            (item.name === "Contact List" &&
              pathname.includes("/dashboard/contact-list")) ||
            (item.name === "LeaderBoard" &&
              pathname.startsWith("/dashboard/leader-board")) ||
            (item.name === "Earning Dashboard" &&
              pathname.startsWith("/dashboard/earnings"));


          const itemClasses = `flex flex-col items-center justify-center p-4 gap-1 transition-colors ${isActive ? "text-[#333333]" : "text-[#868686]"
            }`;

          return (
            <Link
              key={item.name}
              href={item.href || "#"}
              className={`${itemClasses} ${item.end ? "mt-auto " : ""}`}
            >
              {isActive ? (
                <div className="flex flex-col items-center gap-2">
                  <Image src={item.activeicon} alt={`${item.name}`} />
                  <span className="text-xs text-center">{item.name}</span>
                </div>
              ) : item.isNotification ? (
                <div className="flex flex-col items-center justify-center p-4 gap-1">
                  <Notification onClick={handleNotificationStateChange} />

                  <span className="text-xs text-center">{item.name}</span>
                </div>
              ) : (
                <Image src={item.icon} alt={`${item.name}`} />
              )}
              {!item.isNotification && !isActive && (
                <span className="text-xs text-center">{item.name} </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
