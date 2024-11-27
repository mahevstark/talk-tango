"use client";
import React, { useEffect, useState } from "react";
import SidebarLayout from "../../../components/Layouts/SideBarLayout";
import Image from "next/image";
import arrow from "../../../../public/svgs/arrow.svg";
import receive from "../../../../public/svgs/receive.svg";
import { parseISO, formatDistanceToNow } from "date-fns";

export default function Page() {
  const paymentData = [
    {
      date: "Today",
      transactions: [
        {
          type: "Send",
          account: "0817239419528913",
          amount: "+500$",
          time: "11:15",
          icon: arrow,
        },
      ],
    },
    {
      date: "Yesterday",
      transactions: [
        {
          type: "Receive",
          account: "0817239419528914",
          amount: "-200$",
          time: "14:30",
          icon: arrow,
        },
        {
          type: "Send",
          account: "0817239419528915",
          amount: "+300$",
          time: "16:45",
          icon: receive,
        },
      ],
    },
  ];

  const [Data, setData] = useState();
  const [payment, setpayment] = useState([]);
  const fetchpayment = async () => {
    const token = localStorage.getItem("token");
    const axios = require("axios");
    let data = JSON.stringify({
      token: token,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://talktango.estamart.com/api/payment_history",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.action === "success") {
          setpayment(response.data.data);

         
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchpayment();
   
  }, [fetchpayment]);

  return (
    <SidebarLayout>
      <div className="pt-6 pl-6 sm:w-[1311px] w-auto">
        <p className="text-[#049C01] font-semibold">Payment History</p>

        {payment ? (
          payment?.map((day, index) => (
            <div key={index} className="mt-4">
              <div
                key={index}
                className="flex sm:items-center sm:justify-between pt-5 w-full flex-col justify-start items-start gap-4 sm:gap-0 sm:flex-row"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                    {day.approval_status === "1" ? (
                      <Image src={receive} alt="Received" />
                    ) : (
                      <Image src={arrow} alt="Sent" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-black">
                      {day.approval_status === "1" ? "Received" : "Sent"}
                    </span>
                    <span className="text-sm text-[#666666]">
                      0817239419528913
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-medium text-black">$ {day.amount}</span>
                  <span className="text-sm text-[#666666]">
                    {day.created_at
                      .split(" ")[1]
                      .split(":")
                      .slice(0, 2)
                      .join(":")}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-[50vh]">
            <p className="text-[#666666] text-2xl">No Payment history yet</p>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
