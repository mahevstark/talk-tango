"use client";
import React, { useEffect, useState } from "react";
import SidebarLayout from "../../../components/Layouts/SideBarLayout";
import Image from "next/image";
import arrow from "../../../../public/svgs/arrow.svg";
import receive from "../../../../public/svgs/receive.svg";
import nopayment from "../../../../public/svgs/nopayment.svg";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [id, setid] = useState(null);

  const [payment, setpayment] = useState([]);
  const fetchpayment = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("id");

    setid(user);
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
        console.log('rr', response);

        if (response.data.action === "success") {
          setpayment(response.data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchpayment();
  }, []);

  return (
    <SidebarLayout>
      <div className="sm:pt-6 mt-2 pl-10 sm:w-[1311px] w-auto">
        <p className="text-[#049C01] font-semibold">Payment History</p>

        {loading ? (
          <div className="flex items-center space-x-4 mt-12">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ) : payment && payment.length > 0 ? (
          <div className="py-4">{
            payment?.map((day, index) => (
              <div key={index} className="mb-6">
                <div className="flex sm:items-center sm:justify-between w-full flex-col justify-start items-start gap-4 sm:gap-0 sm:flex-row">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                      {day.user_id !== id ? (
                        <Image src={receive || "/placeholder.svg"} alt="Received" />

                      ) : (
                        <Image src={arrow || "/placeholder.svg"} alt="Sent" />

                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-black">{day.user_id !== id ? "Received" : "Sent"}</span>
                      <span className="text-sm text-[#666666]">0817239419528913</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-medium text-black">$ {day?.amount}</span>
                    <span className="text-sm text-[#666666]">
                      {new Date(day?.created_at).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}

                    </span>
                  </div>
                </div>
              </div>
            ))}</div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 text-center">
            <div className="max-w-md mx-auto">
              <Image src={nopayment || "/placeholder.svg"} alt="No Payment" className="mx-auto" />
              <p className="text-[#666666] md:text-xl text-sm mt-4">
                It looks like you haven't made any payments yet. Once you do, they'll show up here
              </p>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
