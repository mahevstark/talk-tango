"use client";
import Image from "next/image";
import SidebarLayout from "../../../components/Layouts/SideBarLayout";
import LeftLayoutMessages from "../../../components/Layouts/LeftSideBar";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import user from "../../../../public/messages/user.svg";
import Back from "../../../../public/svgs/back.svg";

export default function paymenthistory() {
  const [data, setData] = useState([]);
  const [media, setMedia] = useState([]);
  const fetchdata = async () => {
    const userid = localStorage.getItem("newid");
    console.log("user id from id ", userid);

    const convoid = localStorage.getItem("contactId");
    const token = localStorage.getItem("token");
    const axios = require("axios");
    let data = JSON.stringify({
      token: token,
      user_id: userid,
      convo_id: convoid,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://talktango.estamart.com/api/get_user_profile",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setData(response.data.data);
        setMedia(response.data.media);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchdata();
  }, []);

  // copy

  const [copied, setCopied] = useState(false);

  // Bank account number
  const accountNumber = "2732834072382712";

  // Function to handle copying the text
  const handleCopy = () => {
    navigator.clipboard
      .writeText(accountNumber)
      .then(() => {
        // Set the state to show a successful copy message
        setCopied(true);
        // Reset the copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });
  };

  const [contactlist, setcontactlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredContacts = contactlist.filter(
    (contact) =>
      contact.title &&
      contact.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchusercontacts = async () => {
    const token = localStorage.getItem("token");
    const axios = require("axios");
    let data = JSON.stringify({
      token: token,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://talktango.estamart.com/api/get_chat_c",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setcontactlist(
          Array.isArray(response.data.chats) ? response.data.chats : []
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchusercontacts();
  }, []);

  const handleContactClick = (contactId, contactname, userid, block, newid) => {
    setSelectedContact(contactId);

    localStorage.setItem("contactname", contactname);
    // setuserid(userid);

    localStorage.setItem("newid", newid); //
    localStorage.setItem("contactId", contactId); //
    // displaymessages(contactId);
    fetchdata();
  };
  const [selectedContact, setSelectedContact] = useState();

  useEffect(() => {
    const abc = localStorage.getItem("contactId");
    setSelectedContact(abc);
  }, []);

  const [paymentData, setPaymentData] = useState([]);
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
        setPaymentData(response.data.data);
        console.log("my data", JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <SidebarLayout>
      <div className="flex sm:flex-row flex-col sm:mt-0 mt-14 ">
        <div className="sm:w-1/4 pl-3 mt-4 w-full md:block">
          <h1 className="text-xl text-[#049C01] font-semibold mx-6">
            Messages
          </h1>
          <div className="p-4">
            <div className="relative rounded-full border-[#E9EAF0] bg-[#F5F5F5]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-6 text-black" />
              <Input
                placeholder="Search..."
                className="pl-7 w-auto border-none ml-3 placeholder:text-black placeholder:font-medium text-black focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-y-auto flex flex-col gap-4">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`flex items-start gap-3 px-6 py-2 cursor-pointer ${
                    selectedContact === contact.id
                      ? "bg-[#049C01] text-white"
                      : ""
                  }`}
                  onClick={() =>
                    handleContactClick(
                      contact.id,
                      contact.title,
                      contact.last_msg.by_user_id,
                      contact.is_blocked,
                      contact.user_id
                    )
                  }
                >
                  <div className="relative">
                    <Image
                      src={contact.image || user}
                      alt="User"
                      width={45}
                      height={45}
                      className="rounded-full"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h2 className="font-semibold truncate">
                        {contact.title}
                      </h2>
                    </div>
                    <p
                      className={`text-sm truncate text-[#6E7485] ${
                        selectedContact === contact.id
                          ? "text-white"
                          : "text-[#6E7485]"
                      }`}
                    >
                      {contact.last_msg.text}
                    </p>
                  </div>
                  <div className="text-white text-xs rounded-full gap-3 flex items-end justify-center flex-col">
                    <span
                      className={`text-sm truncate text-[#6E7485] ${
                        selectedContact === contact.id
                          ? "text-white"
                          : "text-[#6E7485]"
                      }`}
                    >
                      {contact.last_msg.createdAt}
                    </span>

                    {contact.last_msg.unreadCount > 0 && (
                      <span className="text-xs text-white bg-[#049C01] rounded-full px-2">
                        {contact.last_msg.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-[#6E7485]">No chats found</p>
            )}
          </div>
        </div>
        <div className="flex w-full bg-white h-[700px] pt-4 sm:flex-row flex-col ">
          {/* Left Sidebar */}
          {/* <LeftLayoutMessages /> */}
          <div className="sm:pt-0 pt-7 pl-6 sm:w-[1311px] w-auto">
            <span className="flex gap-1 items-center">
              <Link href="/dashboard/messages/">
                <Image src={Back} alt="back" width={18} loading="lazy" />
              </Link>
              <p className="text-black font-semibold">Payment History</p>
            </span>
            {paymentData && paymentData.length > 0 ? (
              paymentData.map((day, index) => (
                <div key={index} className="mt-5">
                  <p className="text-[#6D6D6D] text-sm">{day.date}</p>
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
              <p className="mt-12 h-screen text-center">
                No Payment Data Found
              </p>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}

