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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";

export default function NotificationsDrawer({ onNotificationChange }) {
  const [notifications, setNotifications] = useState([]); // Initialize as an empty array
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const router = useRouter();

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

  const handleAction = (id, amount, action) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );

    // Handle accept and reject actions
    if (action === "accept") {
      acceptRequest(id, amount);
    } else if (action === "reject") {
      rejectRequest(id, amount);
    }
  };

  // Reject request API call
  const rejectRequest = async (id, amount) => {
    // console.log("rejectRequest");
    // return;
    const token = localStorage.getItem("token");
    const axios = require("axios");
    let data = JSON.stringify({
      status: 2,
      id: parseInt(id),
      token: token,
      amount: amount,
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
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Accept request API call
  const acceptRequest = async (id, amount) => {
    const token = localStorage.getItem("token");

    const axios = require("axios");
    let data = JSON.stringify({
      status: 1,
      id: parseInt(id),
      token: token,
      amount: amount,
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
        }
      })
      .catch((error) => {
        console.log(error);
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
        <ScrollArea className="h-[calc(100vh-80px)] pr-4">
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
                No New Notifications{" "}
              </p>
              <p className=" text-gray-500  text-center text-sm">
                You’re all caught up! Check back later for new updates or
                messages
              </p>
            </span>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start gap-3 mt-3"
              >
                <div className="w-10 h-10 rounded-full  flex items-center justify-center">
                  <Image
                    src={notification.profile_pic}
                    alt="User"
                    width={100}
                    height={100}
                    className="rounded-full"
                  />
                </div>

                <div className="flex min-w-1 ">
                  <div className="flex items-start">
                    <div className="text-sm">
                      <p className="text-black">
                        {notification.name || "no contact name"}
                        {notification.p_status === "0" &&
                          ` sent you a Payment Request of $${notification.amount}`}
                        {notification.p_status === "2" &&
                          ` Payment Request was ${
                            notification.request_status === "1"
                              ? "approved"
                              : "rejected"
                          }`}
                        {notification.p_status === "1" &&
                          ` Payment Request was ${
                            notification.request_status === "1"
                              ? "approved"
                              : "rejected"
                          }`}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(
                          parseISO(notification.created_at),
                          {
                            addSuffix: true,
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Display buttons for pending requests */}
                  {notification.p_status === "0" &&
                    notification.request_status === "0" && (
                      <div className="flex gap-3 ml-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 bg-none border-none p-0"
                          onClick={() =>
                            handleAction(
                              notification.id,
                              notification.amount,
                              "accept"
                            )
                          }
                        >
                          <Image
                            src={accept}
                            width={45}
                            alt="Accept"
                            loading="lazy"
                          />
                          <span className="sr-only">Accept request</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 bg-none border-none p-0"
                          onClick={() =>
                            handleAction(
                              notification.id,
                              notification.amount,
                              "reject"
                            )
                          }
                        >
                          <Image
                            src={reject}
                            width={45}
                            alt="Reject"
                            loading="lazy"
                          />
                          <span className="sr-only">Reject request</span>
                        </Button>
                      </div>
                    )}
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
