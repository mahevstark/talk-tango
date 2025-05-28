"use client";
import Image from "next/image";
import SidebarLayout from "../../../components/Layouts/SideBarLayout";
import LeftLayoutMessages from "../../../components/Layouts/LeftSideBar";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import nopayment from "../../../../public/svgs/nopayment.svg";
import PaymentRequest from "../../Popups/PaymentRequest";
import arrow from "../../../../public/svgs/arrow.svg";
import receive from "../../../../public/svgs/receive.svg";
import user from "../../../../public/messages/user.svg";
import Back from "../../../../public/svgs/back.svg";
import { Skeleton } from "@/components/ui/skeleton";

export default function paymenthistory() {
  const [data, setData] = useState([]);
  const [loading, setloading] = useState(false);
  const [loadingpayment, setloadingpayment] = useState(false);

  const [media, setMedia] = useState([]);
  var userid;
  const fetchdata = async () => {
    setloadingpayment(true);
    userid = localStorage.getItem("newid");


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

        setData(response.data.data);
        setMedia(response.data.media);
        setloadingpayment(false);
      })
      .catch((error) => {
        console.log(error);
        setloadingpayment(false);
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
    setloading(true);

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
        setloading(false);
      })
      .catch((error) => {
        console.log(error);
        setloading(false);
      });
  };

  useEffect(() => {
    fetchusercontacts();
  }, []);

  const handleContactClick = (contactId, contactname, userid, block, newid, contact) => {
    setSelectedContact(contactId);
    console.log('clicked', contact);

    getPaymenthistory(contact?.user_id)


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
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   console.log('i am here')
  //   const axios = require("axios");
  //   var userid = localStorage.getItem("newid");

  //   const convoid = localStorage.getItem("contactId");
  //   let data = JSON.stringify({
  //     token: token,
  //     "other_user_id": convoid

  //   });
  //   // here to get history 
  //   let config = {
  //     method: "post",
  //     maxBodyLength: Infinity,
  //     url: "https://talktango.estamart.com/api/single_user_payment_history",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     data: data,
  //   };

  //   axios
  //     .request(config)
  //     .then((response) => {

  //       console.log('response.data.data', response.data.data);


  //       setPaymentData(response.data.data);
  //       // console.log("my data", JSON.stringify(response.data));
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  const [myid, setMyid] = useState(null)
  const getPaymenthistory = async (id) => {
    const user = JSON.parse(localStorage.getItem("usersdata"));

    setMyid(user?.id)
    console.log('id for getting', id);
    console.log('id mine', user?.id);


    const axios = require("axios");
    const token = localStorage.getItem("token");
    console.log('fetcing for..', Number(id));


    let data = JSON.stringify({
      token: token,
      "other_user_id": Number(id)

    });
    // here to get history 
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://talktango.estamart.com/api/single_user_payment_history",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    console.log(data);

    axios
      .request(config)
      .then((response) => {



        // const filteredData = response.data.data.filter(
        //   (item) => item.t_with === String(id) && item.user_id === String(user?.id)
        // );

        const filteredData = response.data.data.filter(
          (item) => item.t_with === String(user?.id) && item.user_id === String(id) || item.t_with === String(id) && item.user_id === String(user?.id)
        );
        console.log('filteredData:', response.data.data);
        setPaymentData(filteredData);
      })
      .catch((error) => {
        console.log(error);
      });
  }


  useEffect(() => {
    const userid = localStorage.getItem("newid");

    getPaymenthistory(userid)
  }, [])





  return (
    <SidebarLayout>
      <div className="flex sm:flex-row flex-col sm:mt-0  pt-1.5 gap-4 w-full mr-6">
        <div className="sm:w-1/4 sm:pl-3 sm:mt-4 w-full md:block">
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
            {loading ? (
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </div>
            ) : filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`flex items-start gap-3 px-4 py-2 cursor-pointer ${selectedContact === contact.id
                    ? "bg-[#049C01] text-white"
                    : ""
                    }`}
                  onClick={() =>
                    handleContactClick(
                      contact.id,
                      contact.title,
                      contact.user_id,
                      contact.is_blocked,
                      contact.user_id,
                      contact,
                      contact?.image,
                      contact?.is_blocked,

                    )
                  }
                >
                  <div className=" flex-shrink-0">
                    <Image
                      src={contact?.image || user}
                      alt="User"
                      width={45}
                      height={45}
                      loading="lazy"
                      className="rounded-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h2 className="font-semibold truncate">
                        {contact.title}
                      </h2>
                    </div>
                    <p
                      className={`text-sm truncate ${selectedContact === contact.id
                        ? "text-white "
                        : "text-[#6E7485]"
                        }`}
                    >
                      {contact.last_msg.image ? (
                        <span>Image</span>
                      ) : contact.last_msg.audio ? (
                        <span>Audio</span>
                      ) : (
                        <span>{contact.last_msg.text}</span>
                      )}
                    </p>
                  </div>
                  <div className="text-white text-xs rounded-full gap-1 flex items-end justify-center flex-col">
                    <span
                      className={`text-sm truncate ${selectedContact === contact.id
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
              <span className="flex gap-1 flex-col items-center justify-center mt-5">
                <p className="text-center text-[#6E7485]">No chats found</p>
                <Link href="/dashboard/contact-list">
                  <button className="text-sm text-center bg-[#049C02] px-4 py-2 rounded-md text-white">
                    Start by adding contacts!
                  </button>
                </Link>
              </span>
            )}
          </div>
        </div>
        <div className="flex w-full bg-white h-[700px] pt-4 sm:flex-row flex-col border shadow-lg rounded-lg  min-h-screen px-8 my-4 overflow-scroll  scrollbar-hide ">
          {/* Left Sidebar */}
          {/* <LeftLayoutMessages /> */}
          <div className="sm:pt-0 pt-7  sm:w-full w-full">
            <span className="flex gap-1 items-center">
              <Link href="/dashboard/messages/">
                <Image src={Back} alt="back" width={18} loading="lazy" />
              </Link>
              <p className="text-black font-semibold">Payment History</p>
            </span>
            {loadingpayment ? (
              <div className="flex items-center space-x-4 mt-12">

                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </div>
            ) : paymentData && paymentData.length > 0 ? (
              <div className="py-4">
                {
                  paymentData.map((day, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex sm:items-center sm:justify-between w-full flex-col justify-start items-start gap-4 sm:gap-0 sm:flex-row ">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                            {day?.user_id === myid ? (
                              <Image src={arrow || "/placeholder.svg"} alt="Received" />

                            ) : (
                              <Image src={receive || "/placeholder.svg"} alt="Sent" />

                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-base font-base text-black">
                              {day.user_id === myid ? "Sent" : "Received"}
                            </span>

                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-medium text-black">
                            $ {day.amount}
                          </span>
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
                  ))
                }
              </div>
            ) : (
              <div className="flex w-full items-center justify-center mt-24 h-[50vh] text-center flex-col gap-4">
                <Image src={nopayment} alt="No Payment" />
                <p className="text-[#666666] text-xl w-1/2">
                  It looks like you haven’t made any payments yet. Once you do,
                  they’ll show up here
                </p>
                <span className="flex">
                  <p className="flex items-center py-1 rounded-md text-[#666666]">
                    Click to make a Payment
                  </p>
                  <PaymentRequest userid={userid} />
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
