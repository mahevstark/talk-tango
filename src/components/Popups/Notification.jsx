"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import notification from "../../../public/svgs/notifications.svg";
import activenotification from "../../../public/svgs/activenotification.svg";
import Image from "next/image";
import accept from "../../../public/svgs/accept.svg";
import { Skeleton } from "@/components/ui/skeleton";
import { parseISO, formatDistanceToNow } from "date-fns";
import reject from "../../../public/svgs/reject.svg";
import demonotif from '../../../public/svgs/demonotif.svg'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import user from '../../../public/svgs/user.svg'
import ErrorPopup from "./ErrorPopup";

export default function NotificationsDrawer({ onNotificationChange }) {
  const [notifications, setNotifications] = useState([]); // Initialize as an empty array
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);
  const [color, setColor] = useState('red');
  const [error, setError] = useState("");

  const handleNotificationClick = () => {
    setIsOpen(!isOpen);
  };

  // API call to fetch notifications

  const fetchnotifications = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const axios = require("axios");
    let data = JSON.stringify({
      token: token,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://talktango.estamart.com/api/get_notifications",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        const notificationsData = response.data.data;
        // console.log("notificationsData", notificationsData);

        if (Array.isArray(notificationsData)) {
          setLoading(false);
          setNotifications(notificationsData);
        } else {
          setLoading(false);

          // console.log("Invalid response data", response.data);
          if (response.data.error === "Invalid login credentials") {
            localStorage.clear();
            router.push("/");
          }
          setNotifications([]);
        }
      })
      .catch((error) => {
        console.log("error", error);
        setNotifications([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchnotifications();
  }, []);

  const getNotificationText = (notification) => {
    switch (notification.amount) {
      case "send":
        return `Send $${notification.amount} to you`;
      case "request":
        return `send you Payment Request of $${notification.amount}`;
      case "accept":
        return `Accepted your Payment Request and send you $${notification.amount}`;
      default:
        return "";
    }
  };

  const handleAction = (id, amount, action, fromid) => {

    console.log('noti data', fromid?.from_user_id);


    // Handle accept and reject actions
    if (action === "accept") {
      acceptRequest(id, amount, fromid?.from_user_id);
    } else if (action === "reject") {
      rejectRequest(id, amount, fromid?.from_user_id);
    }
  };

  // Reject request API call
  const rejectRequest = async (id, amount, fromid) => {
    // console.log("rejectRequest");
    // return;
    const token = localStorage.getItem("token");
    const axios = require("axios");
    let data = JSON.stringify({
      status: 2,
      id: parseInt(id),
      token: token,
      amount: amount,
      from_user_id: fromid
    });


    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://talktango.estamart.com/api/request_status",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.action === "success") {
          fetchnotifications();

          setColor('green')
          setError("Payment Rejected Successfully");
        } else {

          setColor('red')
          setError("Error while rejecting request please try again.");

        }
      })
      .catch((error) => {
        console.log(error);

        setColor('red')
        setError("Network Error. please try again later.");
      });
  };

  // Accept request API call
  const acceptRequest = async (id, amount, fromid) => {
    const token = localStorage.getItem("token");

    const axios = require("axios");
    let data = JSON.stringify({
      status: 1,
      id: parseInt(id),
      token: token,
      amount: amount,
      from_user_id: fromid
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://talktango.estamart.com/api/request_status",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {

        if (response?.data?.action === "success") {
          fetchnotifications();
          setNotifications((prevNotifications) =>
            prevNotifications.filter((notification) => notification.id !== id)
          );

          setColor('green')
          setError("Payment Approved Successfully");
        } else {
          console.log('error', response?.data?.error);

          setColor('red')
          setError(response?.data?.error === "Must provide source or customer." ? "Please Setup your Bank Account to accept payment request" : "error");


        }
      })
      .catch((error) => {
        console.log(error);
        alert("Network Error.");

      });
  };



  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button onClick={handleNotificationClick}>
          {isOpen ? (
            <Image
              src={activenotification}
              alt="Notifications"
              loading="lazy"
            />
          ) : (
            <Image src={notification} alt="Notifications" loading="lazy" />
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-[300px] sm:w-[540px] left-auto right-0 sm:left-32 sm:right-auto">
        <SheetHeader>
          <SheetTitle className="text-[#049C01] font-medium">
            Notifications
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-80px)] pr-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {loading ? (
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <span>
              <p className=" text-gray-500 mt-48 text-center text-lg ">
                No New Notifications or turned off{" "}
              </p>
              <p className=" text-gray-500  text-center text-sm">
                You’re all caught up! Check back later for new updates or
                messages
              </p>

              <Image src={demonotif} alt="notifications" width={200} className="mx-auto py-4" />
            </span>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-3 mt-3">
                {/* Profile picture with standardized size */}
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={notification.profile_pic || user}
                    alt="User"
                    width={40}
                    height={40}
                    className="object-cover"
                    priority={false}
                  />
                </div>

                <div className="flex min-w-1 flex-grow">
                  <div className="flex items-start flex-col">
                    <div className="text-sm">
                      <p className="text-black">
                        {notification.name || "no contact name"}
                        {notification.status === "2"
                          ? ` sent you a payment request of $${notification.amount}`
                          : notification.status === "0"
                            ? ` sent you a payment of $${notification.amount}`
                            : null}

                        {notification.p_status === "1"
                          ? `payment request was ${notification.request_status === "1"
                            ? "approved"
                            : notification.request_status === "2"
                              ? "rejected"
                              : "responded"
                          }`
                          : notification.p_status === "2"
                            ? ` payment request was ${notification.request_status === "1"
                              ? "approved"
                              : notification.request_status === "2"
                                ? "rejected"
                                : "responded"
                            }`
                            : null}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(parseISO(notification.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Display buttons for pending requests with standardized image sizes */}
                  {notification.status === "2" && notification.request_status === "0" && (
                    <span className="flex items-start gap-4">
                      <button

                        className="h-8 bg-none hover:bg-none border-none  rounded-full"
                        onClick={() => handleAction(notification.id, notification.amount, "accept", notification)}
                      >
                        <div className="flex items-center  w-8 ">
                          <Image
                            src={accept || "/placeholder.svg"}
                            alt="Accept"
                            width={30}
                            height={30}
                            className="object-contain"
                            loading="lazy"
                          />
                        </div>
                        <span className="sr-only">Accept request</span>
                      </button>
                      <button

                        className="h-8 bg-none hover:bg-none border-none  rounded-full"
                        onClick={() => handleAction(notification.id, notification.amount, "reject", notification)}
                      >
                        <div className="flex items-center  w-8 ">
                          <Image
                            src={reject || "/placeholder.svg"}
                            alt="Reject"
                            width={30}
                            height={30}
                            className="object-contain"
                            loading="lazy"
                          />
                        </div>
                        <span className="sr-only">Reject request</span>
                      </button>
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
          {error && <ErrorPopup message={error} onClose={() => setError("")} color={color} />}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
