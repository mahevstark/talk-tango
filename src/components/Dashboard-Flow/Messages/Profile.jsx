"use client";
import Image from "next/image";
import SidebarLayout from "../../../components/Layouts/SideBarLayout";
import back from "../../../../public/svgs/back.svg";
import profilepic from "../../../../public/svgs/profile.svg";
import copyies from "../../../../public/svgs/copyies.svg";
import Link from "next/link";
import wallet from "../../../../public/svgs/wallet.svg";
import post from "../../../../public/svgs/post.svg";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import user from "../../../../public/messages/user.svg";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function profile() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }
  }, [router]);

  let userid;

  let convoid;
  let token;
  const handleContactClick = (contactId, contactname, userid, block, newid) => {


    setSelectedContact(contactId);

    localStorage.setItem("contactname", contactname);
    // setuserid(userid);

    localStorage.setItem("newid", newid); //
    localStorage.setItem("contactId", contactId); //
    // displaymessages(contactId);
    fetchdata();

  };
  useEffect(() => {
    userid = localStorage.getItem("newid");


    convoid = localStorage.getItem("contactId");
    token = localStorage.getItem("token");
  }, [handleContactClick]);

  console.log('i am in profile ');

  const [data, setData] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setloading] = useState(false);
  const [medialoading, setmedialoading] = useState(false);
  const [bac, setbac] = useState(null);

  const fetchdata = async () => {


    userid = localStorage.getItem("newid");
    convoid = localStorage.getItem("contactId");
    token = localStorage.getItem("token");
    const bankAcc = JSON.parse(localStorage.getItem("usersdata"));
    let ran = Math.floor(Math.random() * 10000);
    console.log(bankAcc?.stripe_customer_id);

    setbac(bankAcc?.stripe_customer_id ? bankAcc.stripe_customer_id + ran : "No stripe Account Setup");

    setmedialoading(true);
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
        setmedialoading(false);
      })
      .catch((error) => {
        setmedialoading(false);

        console.log(error);
      });
  };

  useEffect(() => {
    fetchdata();
  }, []);

  // copy

  const [copied, setCopied] = useState(false);

  // Bank account number
  const accountNumber = "273ss2834072382712";

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
        setloading(false);

        setcontactlist(
          Array.isArray(response.data.chats) ? response.data.chats : []
        );
      })
      .catch((error) => {
        setloading(false);

        console.log(error);
      });
  };

  useEffect(() => {
    fetchusercontacts();
  }, []);


  const [selectedContact, setSelectedContact] = useState();

  useEffect(() => {
    setSelectedContact(localStorage.getItem("contactId"));
  }, []);

  return (
    <SidebarLayout>
      <div className="flex sm:flex-row flex-col sm:mt-0  pt-1.5 gap-4 w-full">
        <div className="sm:w-1/4 sm:pl-3 sm:mt-4 w-full md:block">
          <h1 className="text-xl text-[#049C01] font-semibold mx-6">
            Messages
          </h1>
          <div className="p-4">
            <div className="flex rounded-full border-[#E9EAF0] bg-[#F5F5F5]">
              <Search className="absolute md:mt-2 md:ml-2 mt-2 ml-0 h-5 w-6 text-black" />
              <Input
                placeholder="Search..."
                className="pl-7 w-auto border-none ml-3 placeholder:text-black placeholder:font-medium text-black focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-y-auto flex flex-col gap-4 max-h-[calc(100vh-200px)] sm:max-h-[500px]">
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
                      contact?.image,
                      contact?.is_blocked
                    )
                  }
                >
                  <div className="relative flex-shrink-0">
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
        <div className="sm:w-[73%] bg-white w-full border shadow-lg rounded-lg px-5 ">
          <header className="flex items-center px-1 pt-4  gap-2">
            <Link href="/dashboard/messages">
              {" "}
              <Image src={back} alt="something" width={18} loading="lazy" />
            </Link>
            <h1 className=" font-semibold">back</h1>
          </header>

          <div className="p-4 text-center mt-6">
            <div className="flex justify-center items-center h-full">
              {medialoading ? (
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-20 w-20 rounded-full" />
                </div>
              ) : (
                <Image
                  src={data?.profile_pic || user}
                  alt="Maryam's profile picture"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
              )}
            </div>

            <h2 className="mt-4 text-xl font-medium">{data?.name}</h2>
            <p className="text-[#3C3C3C] text-small">{data?.about}</p>
          </div>

          <div className="px-4 py-4 rounded-xl shadow-md flex justify-between items-center border">
            <div className="flex items-center gap-4">
              <Image src={wallet} alt="wallet" loading="lazy" />
              <span>
                <p className="text-black">Bank Account Number</p>
                <p className="text-sm text-[#383838]">{bac}</p>
              </span>
            </div>
            {
              bac !== "No stripe Account Setup" ? (<span
                className="flex flex-col items-center gap-1"
                onClick={handleCopy}
              >
                <Image src={copyies} alt="copy icon" loading="lazy" />
                <p className="text-sm text-[#383838] cursor-pointer">
                  {copied ? "Copied!" : "Copy"}
                </p>
              </span>) : (null)
            }
          </div>
          <div className="p-4 ">
            <h3 className="font-medium mb-2">Media</h3>
            <div className="grid grid-cols-6 gap-1 h-64 overflow-scroll ">
              {medialoading ? (
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full " />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>
              ) : media && media.length > 0 ? (
                media.map((pic, i) => (
                  <div key={i} className="relative aspect-[10/7]   ">
                    <Image
                      src={pic.image}
                      alt="media"
                      fill
                      loading="lazy"
                    />
                  </div>
                ))
              ) : (
                <p>No media found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
