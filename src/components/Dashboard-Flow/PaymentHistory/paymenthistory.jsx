"use client";
import React, { useEffect, useState } from "react";
import SidebarLayout from "../../../components/Layouts/SideBarLayout";
import Image from "next/image";
import arrow from "../../../../public/svgs/arrow.svg";
import receive from "../../../../public/svgs/receive.svg";

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

  const [data, setData] = useState();

  useEffect(() => {
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

       if(response.action === 'success'){
        console.log(response.data);
        setData(response.data);
       }

        
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <SidebarLayout>
      <div className="pt-6 pl-6 sm:w-[1311px] w-auto">
        <p className="text-[#049C01] font-semibold">Payment History</p>

        {data ? (
  data.map((day, index) => (
    <div key={index} className="mt-12">
      <p className="text-[#6D6D6D]">{day.date}</p>
      {day.transactions.map((transaction, idx) => (
        <div
          key={idx}
          className="flex sm:items-center sm:justify-between pt-5 w-full flex-col justify-start items-start gap-4 sm:gap-0 sm:flex-row"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
              <Image src={transaction.icon} alt="something" loading="lazy" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-black">
                {transaction.type}
              </span>
              <span className="text-sm text-[#666666]">
                {transaction.account}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-medium text-black">
              {transaction.amount}
            </span>
            <span className="text-sm text-[#666666]">
              {transaction.time}
            </span>
          </div>
        </div>
      ))}
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
