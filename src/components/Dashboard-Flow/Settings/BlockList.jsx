"use client";
import Link from "next/link";
import SidebarLayout from "../../../components/Layouts/SideBarLayout";
import Back from "../../../../public/svgs/back.svg";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Component() {
  const [blockList, setBlockList] = useState([]);

  const fetchBlockList = async () => {
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
        setBlockList(response.data.data); // Set the blockList here
        console.log("Block list:", response.data.data);
      }
    } catch (error) {
      console.log("Error fetching blocked users:", error);
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
    console.log("dataaaa", data);

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
      <div className="max-w-md mt-12 sm:mt-3 sm:p-4">
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
        <div>
          {blockList ? (
            blockList.map((item, index) => (
              <div key={index} className="flex gap-4 items-center">
                <Image
                  src={item.profile_pic}
                  alt="Profile picture"
                  width={44}
                  className="rounded-full"
                  height={44}
                />
                <p key={index}>{item.name}</p>
                <button
                  className="bg-red-700 text-white px-4 pt-1 pb-1"
                  onClick={() => {
                    handleUnBlockUser(item.convo_id, item.id);
                  }}
                >
                  Unblock User
                </button>
              </div>
            ))
          ) : (
            <p>No blocked users</p>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
