"use client";
import { useEffect, useState, useRef, use } from "react";
import { ArrowLeft, MoreVertical, X, Search } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import user from "../../../../public/messages/user.svg";
import SidebarLayout from "../../../components/Layouts/SideBarLayout";
import Picture from "../../../../public/messages/Picture.svg";
import startchat from "../../../../public/svgs/startchat.svg";
import PaymentRequest from "../../Popups/PaymentRequest";
import Blockuser from "../../Popups/BlockUser";
import Reportuser from "../../Popups/ReportUser";
import Recording from "../../Popups/Recording";
import Link from "next/link";
import PlayAudio from "../../Popups/PlayAudio";
import { Skeleton } from "@/components/ui/skeleton";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { appendNewMsg } from "../../../../utils/Common";
import { useRouter } from "next/navigation";

import Pusher from "pusher-js";
Pusher.logToConsole = true;
var pusher = new Pusher("d6efba574ecc9abf24b0", {
  cluster: "ap2",
  forceTLS: true,
  disableStats: true,
});

let isFirstTime = true;

let login_data = {
  id: 0,
};

export default function Messages() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }
  }, [router]);

  const [isMobileView, setIsMobileView] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]); // Current chat messages
  const [mediaFile, setMediaFile] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [convoid, setconvoid] = useState(null);
  const [contactlist, setcontactlist] = useState([]);
  const [name, setname] = useState(null);
  const [loading, setloading] = useState(false);
  const [loadingmessages, setloadingmessages] = useState(false);

  // const id = localStorage.getItem("id");
  let data;
  const [searchTerm, setSearchTerm] = useState("");

  const [currentchat, setcurrentchat] = useState(null);
  const filteredContacts = contactlist.filter(
    (contact) =>
      contact.title &&
      contact.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  var channel = pusher.subscribe("chat-channel");

  const setupPusher = () => {
    if (!isFirstTime) return;
    isFirstTime = false;

    channel.bind("chat", function (data) {
      console.log(data?.to_alert + " withs " + login_data?.id);

      let logged_user_id = localStorage.getItem("id");

      if (data?.to_alert == logged_user_id) {
        displaymessages(data?.convo_id);
        appendNewMsg(data?.msg);
      }
    });
  };

  const [selectedContact, setSelectedContact] = useState(null);

  const toggleMobileView = () => setIsMobileView(!isMobileView);

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
        // console.log("responsessss", response.data.chats);

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
  const [userid, setuserid] = useState(null);
  useEffect(() => {
    fetchusercontacts();
  }, []);

  const handleclearchat = () => {
    setMessages([]);
  };
  const [block, setblock] = useState([]);
  const [newid, setnewid] = useState([]);
  const [blocking, setblocking] = useState(0);
  const handleContactClick = (
    contactId,
    contactname,
    userid,
    block,
    newid,
    img,
    blck
  ) => {
    setSelectedContact(contactId);

    setconvoid(contactId);
    setname(contactname);
    localStorage.setItem("contactname", contactname);
    setuserid(userid);
    setblock(block);
    setnewid(newid);
    setProfilePic(img);

    setblocking(blck);

    localStorage.setItem("newid", newid); //

    localStorage.setItem("chatuserid", userid); //

    localStorage.setItem("contactId", contactId); //
    displaymessages(contactId);
  };

  const chatContainerRef = useRef(null);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const displaymessages = async (contactId) => {
    setloading(true);
    const token = localStorage.getItem("token");
    const axios = require("axios");
    let data = JSON.stringify({
      token: token,
      convo_id: parseInt(contactId),
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://talktango.estamart.com/api/get_msgs",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)

      .then((response) => {
        response.data.msgs.forEach((element) => {
          if (element.audio) {
            const audioBlob = new Blob([response.data.msgs.audio], {
              type: "audio/wav",
            });
            const audios = URL.createObjectURL(audioBlob);

            setAudioBlob(audios);
          }
        });

        setMessages(
          Array.isArray(response.data.msgs)
            ? response.data.msgs.sort((a, b) => a.stamp - b.stamp)
            : response.data.msgs.sort((a, b) => a.stamp - b.stamp)
        );

        setupPusher();
        setloading(false);
      })
      .catch((error) => {
        console.log(error);
        setloading(false);
      });
  };
  const sendMessage = (message) => {
    setloadingmessages(true);
    const token = localStorage.getItem("token");

    const axios = require("axios");
    let data = JSON.stringify({
      audio: null,
      convo_id: convoid,
      image: null,
      msg: message,
      to_id: userid,
      token: token,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://talktango.estamart.com/api/send_msg",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        fetchusercontacts();
        displaymessages(convoid);
        setloadingmessages(false);
      })

      .catch((error) => {
        console.log(error);
        setloadingmessages(false);
      });
  };

  const sendimage = (im) => {
    const token = localStorage.getItem("token");

    const axios = require("axios");
    let data = JSON.stringify({
      audio: null,
      convo_id: convoid,
      image: im,
      msg: null,
      to_id: userid,
      token: token,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://talktango.estamart.com/api/send_msg",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setloadingmessages(false);
        fetchusercontacts();
        displaymessages(convoid);
      })
      .catch((error) => {
        console.log(error);
        setloadingmessages(false);
      });
  };
  const [file, setFile] = useState(null);

  const handleKeyDown = (e) => {
    if (block == 1) {
      setNewMessage("unblock user first");
      alert("Unblock to send message!");
    } else if (e.key === "Enter" && newMessage.trim() !== "") {
      if (newMessage.trim() !== "") {
        sendMessage(newMessage);
        setNewMessage("");
      } else {
        sendMessage(audio);
      }
    }
  };
  const handleMediaChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  const [isBlockUserOpen, setIsBlockUserOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Function to open Blockuser modal
  const handleBlockUserClick = () => {
    setIsBlockUserOpen(true);
    setIsReportOpen(false);
  };

  // Function to close Blockuser modal
  const handleCloseBlockUser = () => {
    setIsBlockUserOpen(false);
  };
  const [unblock, setunblock] = useState();
  const handleToggleModal = () => {
    setunblock(1);
    setIsBlockUserOpen((prevState) => !prevState);
  };
  const handleToggleModals = () => {
    setunblock(0);
    setIsBlockUserOpen((prevState) => !prevState); // Toggle block user modal state
    const contactid = localStorage.getItem("contactId");

    displaymessages(contactid);
  };

  // Function to open Reportuser modal
  const handleReportUserClick = () => {
    setIsReportOpen(true);
    setIsBlockUserOpen(false);
  };

  // Function to close Reportuser modal
  const handleCloseReportUser = () => {
    setIsReportOpen(false);
  };

  const [audioUrl, setAudioUrl] = useState(null);

  const handleRecordingComplete = (url) => {
    setloadingmessages(true);

    setAudioUrl(url);
    sendaudio(url);
  };

  const sendaudio = (urls) => {
    const token = localStorage.getItem("token");

    const axios = require("axios");
    let data = JSON.stringify({
      audio: urls,
      convo_id: convoid,
      image: null,
      msg: null,
      to_id: userid,
      token: token,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://talktango.estamart.com/api/send_msg",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setloadingmessages(false);
        fetchusercontacts();
        displaymessages(convoid);
      })
      .catch((error) => {
        console.log(error);
        setloadingmessages(false);
      });
  };

  // const handlePlayAudio = () => {
  //   if (audioUrl) {
  //     const audio = new Audio(audioUrl);
  //     audio.play();
  //   }
  // };

  // image

  const [profileImage, setProfileImage] = useState([]);

  // localStorage.getItem("image")

  //localStorage.getItem("image")
  const fileInputRef = useRef(null); // Reference to the file input

  const [image, setImage] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input's click
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file); // Set the selected image file

      handleImageUpload(file); // Pass the file directly to the upload handler
    }
    e.target.value = null;
  };
  const handleImageUpload = async (file) => {
    setloadingmessages(true);
    if (!file) {
      alert("Please select an image to upload.");
      setloadingmessages(false);

      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("photo", file);

    const token = localStorage.getItem("token");
    formData.append("token", token);

    if (!token) {
      alert("No token found. Please log in again.");
      setUploading(false); // Stop uploading
      return;
    }

    const response = await fetch(
      "https://talktango.estamart.com/api/profile_picture",
      {
        method: "POST",

        body: formData, // Send formData with the file
      }
    );
    const result = await response.json();

    if (result.action === "success") {
      setProfileImage(result.filename);
      console.log("profileImage", profileImage);

      sendimage(result.filename);
    } else {
      setError("Error uploading image");
    }

    // setProfileImage(result.filename);
    // sendimage();
  };

  function isValidUrl(url) {
    try {
      new URL(url); // This will throw an error if the URL is invalid
      return true;
    } catch (e) {
      return false;
    }
  }

  useEffect(() => {
    setTimeout(() => {
      fetchusercontacts();
    }, 1000);
  }, []);

  return (
    <SidebarLayout>
      {isBlockUserOpen && (
        <Blockuser
          onClose={handleCloseBlockUser}
          name={name}
          userid={userid}
          convoid={convoid}
          block={block}
          unblock={unblock}
        />
      )}
      {isReportOpen && (
        <Reportuser
          onClose={handleCloseReportUser}
          name={name}
          userid={userid}
          convoid={convoid}
        />
      )}

      <div className="flex w-full  bg-white sm:h-[700px]  sm:pt-4 sm:flex-row flex-col pt-1.5 sm:mr-0 mr-4">
        <div className="sm:w-1/4 w-full md:block">
          <h1 className="text-xl text-[#049C01] font-semibold mx-6">
            Messages
          </h1>
          <div className="p-4">
            <div className="relative rounded-full border-[#E9EAF0] bg-[#F5F5F5]">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-6 text-black 
"
              />
              <Input
                placeholder="Search..."
                className="pl-10 w-full border-none placeholder:text-black placeholder:font-medium text-black focus:outline-none focus:ring-0 focus:border-none"
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
                  className={`flex items-start gap-3 px-4 py-2 cursor-pointer ${
                    selectedContact === contact.id
                      ? "bg-[#049C01] text-white"
                      : ""
                  }`}
                  onClick={() =>
                    handleContactClick(
                      contact.id,
                      contact.title,
                      contact.user_id,
                      // contact.last_msg.by_user_id,
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
                      className={`text-sm truncate ${
                        selectedContact === contact.id
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
                      className={`text-sm truncate ${
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
              <span className="flex gap-1 flex-col items-center justify-center mt-5">
                <p className="text-center text-[#6E7485]">No chats found</p>

                <Link href="/dashboard/contact-list">
                  <button className="text-sm text-center bg-green-600 px-4 py-2 rounded-md text-white">
                    {" "}
                    Start by adding contacts!
                  </button>
                </Link>
              </span>
            )}
          </div>
        </div>
        {selectedContact ? (
          <div className="flex-1 flex flex-col sm:ml-4 ml-0 sm:mr-4 mr-0 sm:h-auto  sm:mt-0 mt-12 border-l pl-4 border shadow-lg rounded-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full md:hidden"
                  onClick={toggleMobileView}
                >
                  {isMobileView ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <ArrowLeft className="h-5 w-5" />
                  )}
                </Button>
                <Image
                  src={profilePic || user}
                  alt={name || "User"}
                  width={40}
                  height={40}
                  loading="lazy"
                  className="rounded-full"
                />
                <div>
                  <h2 className="font-semibold text-[#1D2026]">
                    {name || "Select a chat"}
                  </h2>
                </div>
              </div>
              <div className="flex items-center">
                <PaymentRequest newid={newid} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-white"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href="/dashboard/messages/profile">
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard/messages/payment-history">
                      <DropdownMenuItem>Payment History</DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>
                      {blocking == 1 ? (
                        <button onClick={handleToggleModals}>
                          Unblock User
                        </button>
                      ) : (
                        <button onClick={handleToggleModal}>Block User</button>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <button onClick={handleReportUserClick}>Report</button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 "
            >
              {messages.length > 0 ? (
                messages?.map((message) => (
                  <div
                    key={message._id}
                    className={`flex items-start gap-2 ${
                      message.by_user_id !== userid
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex gap-3 items-center ${
                        message.by_user_id !== userid
                          ? "flex-row-reverse"
                          : "flex-row"
                      }`}
                    >
                      <Image
                        src={
                          isValidUrl(message?.by_user_image)
                            ? message?.by_user_image
                            : user
                        }
                        alt=""
                        width={32}
                        height={32}
                        className="rounded-full"
                        loading="lazy"
                      />
                      <div
                        className={`px-4 py-2 rounded-xl ${
                          message?.by_user_id !== userid &&
                          !message.audio &&
                          !message.image &&
                          !message.audio
                            ? "text-white bg-[#049C01]"
                            : !message.audio
                            ? "text-black bg-none"
                            : "text-black "
                        }`}
                      >
                        {message?.image && (
                          <Image
                            src={message.image}
                            alt="Image"
                            width={100}
                            height={100}
                            loading="lazy"
                          />
                        )}
                        {message?.text && (
                          <p className="text-sm">{message.text}</p>
                        )}
                        {message.audio && (
                          <PlayAudio audioUri={message.audio} />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : loading ? (
                <p className="text-center text-[#6E7485] mx-auto">
                  Loading Messages....
                </p>
              ) : null}
            </div>

            {blocking == 1 ? (
              <div className="text-red-500 text-center">
                <p>Unblock the User First To send Message </p>
              </div>
            ) : (
              <div className="py-1 ml-1 mr-5 border-2 flex items-center gap-3 px-4 rounded-lg   sm:mb-4 mb-12">
                <Input
                  placeholder={
                    block == 1 ? "Unblock user first" : "Type a message"
                  }
                  value={loadingmessages ? "Sending..." : newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 border-0"
                  onKeyDown={handleKeyDown}
                  disabled={block == 1 || loading || loadingmessages}
                />

                <div>
                  <Recording onRecordingComplete={handleRecordingComplete} />
                </div>
                <div>
                  <Image
                    src={Picture} // Use the selected image if available, otherwise the
                    alt="Upload"
                    onClick={handleImageClick}
                    className="w-6 h-6 cursor-pointer"
                    loading="lazy"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden" // Hide the file input
                  />
                </div>
              </div>
            )}
            {/* <div className="py-1 border-2 flex items-center gap-3 px-4 rounded-lg mt-4 sm:mb-0 mb-12">
              <Input
                placeholder={
                  block == 1 ? "Unblock user first" : "Type a message"
                }
                value={loadingmessages ? "Sending..." : newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border-0"
                onKeyDown={handleKeyDown}
                disabled={block == 1 || loading || loadingmessages}
              />

              <div>
                <Recording onRecordingComplete={handleRecordingComplete} />
              </div>
              <div>
                <Image
                  src={Picture} // Use the selected image if available, otherwise the
                  alt="Upload"
                  onClick={handleImageClick}
                  className="w-6 h-6 cursor-pointer"
                  loading="lazy"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden" // Hide the file input
                />
              </div>
            </div> */}
          </div>
        ) : (
          <div className="text-center  flex justify-center items-center mt-56 sm:mt-0 gap-3 w-full flex-col">
            <Image src={startchat} alt="Start Chat" />
            <p className="mx-auto text-xl font-semibold">
              {" "}
              Start a conversation !
            </p>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
