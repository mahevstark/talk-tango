"use client";
import Link from "next/link";
import SidebarLayout from "../../../components/Layouts/SideBarLayout";
import Back from "../../../../public/svgs/back.svg";
import noblock from "../../../../public/svgs/noblock.svg";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Component() {
  const [blockList, setBlockList] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchBlockList = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    const axios = require("axios");
    let data = JSON.stringify({
      token: token,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://talktango.estamart.com/api/get_blocked_user",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const response = await axios.request(config);

      if (response.data.action === "success") {
        setLoading(false);
        setBlockList(response.data.data); // Set the blockList here
        // console.log("Block list:", response.data.data);
      }
    } catch (error) {
      console.log("Error fetching blocked users:", error);
      setLoading(false);
    }
  };
  console.log("Fetched blocked users:", blockList);

  useEffect(() => {
    fetchBlockList();
  }, []); // Only fetch once on mount

  //unblock user

  const handleUnBlockUser = (convoid, userid) => {
    const axios = require("axios");

    const token = localStorage.getItem("token");
    let data = JSON.stringify({
      token: token,
      convo_id: convoid,
      block_status: 0,
      block_to: userid,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://talktango.estamart.com/api/blockUser",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.action === "success") {
          if (typeof window !== "undefined") {
            window.location.reload();
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <SidebarLayout>
      <div className="w-full mt-12 sm:mt-3 sm:p-4 p-4 ">
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-9 w-9"
          >
            <Image src={Back} alt="Go back" />
            <span className="sr-only">Go back</span>
          </Link>
          <h1 className="text-lg font-medium">Block List</h1>
        </div>

        <div className=" p-3 flex flex-col justify-between rounded-lg">
          {loading ? (
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 sm:w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ) : blockList ? (
            blockList.map((item, index) => (
              <div
                key={index}
                className=" gap-4 items-center  border p-3 flex flex-col justify-between bg-gray-100 rounded-lg"
              >
                <span className="flex gap-2 items-center">
                  <Image
                    src={item.profile_pic}
                    alt="Profile picture"
                    width={44}
                    className="rounded-full"
                    height={44}
                  />
                  <p key={index}>{item.name}</p>
                </span>
                <button
                  className="bg-[#349A00] text-white px-4 pt-1 pb-1 rounded-md "
                  onClick={() => {
                    handleUnBlockUser(item.convo_id, item.id);
                  }}
                >
                  Unblock User
                </button>
              </div>
            ))
          ) : (
            <div className="w-full flex  flex-col items-center  justify-center ">
              <Image src={noblock} alt="No blocked users" width={400} />
              <p className="text-xl font-semibold"> No blocked users found</p>
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
