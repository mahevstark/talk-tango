"use client";
import Link from "next/link";
import SidebarLayout from "../../../components/Layouts/SideBarLayout";
import Back from "../../../../public/svgs/back.svg";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Component() {
  const [blockList, setBlockList] = useState([]);

  useEffect(() => {
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

    axios
      .request(config)
      .then((response) => {
        setBlockList(response.data.data);
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <SidebarLayout>
      <div className="max-w-md mt-12 sm:mt-3 sm:p-4 ">
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-9 w-9"
          >
            <Image src={Back} alt="Go back"  />
            <span className="sr-only">Go back</span>
          </Link>
          <h1 className="text-lg font-medium">Block List</h1>
        </div>
        <div>
          {/* Check if blockList has data */}
          {blockList === null ? (
            <p>No blocked users</p>
          ) : (
            blockList.map((item, index) => <p key={index}>{item.user_name}</p>)
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
