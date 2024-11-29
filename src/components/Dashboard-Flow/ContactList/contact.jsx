"use client";
import { useEffect, useState, useRef } from "react";
import { ArrowLeft, MoreVertical, X, Search } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import user from "../../../../public/messages/user.svg";
import SidebarLayout from "../../../components/Layouts/SideBarLayout";
import Picture from "../../../../public/messages/Picture.svg";
import PaymentRequest from "../../../components/Popups/PaymentRequest";
import Blockuser from "../../../components/Popups/BlockUser";
import Reportuser from "../../../components/Popups/ReportUser";
import Recording from "../../../components/Popups/Recording";
import audio from "../../../../public/messages/Audio.svg";
import PlayAudio from "../../Popups/PlayAudio";

import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { appendNewMsg } from "../../../../utils/Common";

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

export default function ContactList() {
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
  const filteredContacts = contactlist?.filter(
    (contact) =>
      contact.title &&
      contact.title.toLowerCase().includes(searchTerm.toLowerCase())
  );


  var channel = pusher.subscribe("chat-channel");

  const setupPusher = () => {
    if (!isFirstTime) return;
    isFirstTime = false;
    console.log("pusher running ");

    channel.bind("chat", function (data) {
      console.log(data?.to_alert + " with " + login_data?.id);

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

  const [usersid, setusersid] = useState([]);

  const handleContactClick = (
    contactId,
    contactname,
    userid,
    block,
    newid,
    img
  ) => {
    if (contactId) {
      setSelectedContact(contactId);
      setuserid(contactId);
    } else {
      setSelectedContact(null);
      setuserid(null);
    }
    setname(contactname);
    localStorage.setItem("contactname", contactname);
    // setuserid(userid);
    setblock(block);
    setnewid(newid);
    setProfilePic(img);

    localStorage.setItem("newid", newid); //

    localStorage.setItem("chatuserid", userid); //

    localStorage.setItem("contactId", contactId); //
    displaymessages(contactId);
  };

  const handleContactClicks = (
    contactId,
    contactname,
    userid,
    block,
    newid,
    img
  ) => {
    if (contactId) {
      setSelectedContact(contactId);
      setconvoid(contactId);
    } else {
      setSelectedContact(null);
      setconvoid(null);
    }
    setname(contactname);
    localStorage.setItem("contactname", contactname);
    setuserid(userid);
    setblock(block);
    setnewid(newid);
    setProfilePic(img);

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
        setloading(false);

        setMessages(
          Array.isArray(response.data.msgs)
            ? response.data.msgs.sort((a, b) => a.stamp - b.stamp)
            : response.data.msgs.sort((a, b) => a.stamp - b.stamp)
        );

        setupPusher();
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
        setloadingmessages(false);

        fetchusercontacts();
        setconvoid(response.data.convo_id);
        displaymessages(convoid);
      })
      .catch((error) => {
        console.log(error);
        setloadingmessages(false);
      });
  };

  const sendimage = () => {
    const token = localStorage.getItem("token");

    const axios = require("axios");
    let data = JSON.stringify({
      audio: null,
      convo_id: convoid,
      image: profileImage,
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
      }
      // } else {
      //   sendMessage(audio);
      // }
    }
  };
  const handleMediaChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log("Selected file:", selectedFile);
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
    setIsBlockUserOpen((prevState) => !prevState); // Toggle block user modal state
  };
  const handleToggleModals = () => {
    setunblock(0);
    setIsBlockUserOpen((prevState) => !prevState); // Toggle block user modal state
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

  const sendaudio = (url) => {
    const token = localStorage.getItem("token");

    

    const axios = require("axios");
    let data = JSON.stringify({
      audio: url,
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
        if (response.data.action === "success") {
          setloadingmessages(false);

          fetchusercontacts();
          displaymessages(convoid);
        }
      })
      .catch((error) => {
        console.log(error);
        setloadingmessages(false);
      });
  };

  const [profileImage, setProfileImage] = useState();

  useEffect(() => {
    setProfileImage(localStorage.getItem("image"));
  }, []);

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

      sendimage(result.filename);
    } else {
      setError("Error uploading image");
    }

    // setProfileImage(result.filename);
    // sendimage();
  };

  // fetching users by searching
  const [contacts, setcontacts] = useState([]);
  const searchusers = async () => {
    const token = localStorage.getItem("token");
    const axios = require("axios");
    let data = JSON.stringify({
      token: token,
      searchQuery: searchTerm,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://talktango.estamart.com/api/SeachForChat",
      headers: {
        "Content-Type": "application/json",
        Cookie: "ci_session=g28vgu9jbvgj0g0dqpr28e805hoq4v20",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setcontacts(response.data.data);
     
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const filteredContact = contacts?.filter(
    (contact) =>
      contact.name &&
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlesearching = (e) => {
    const value = e.target.value; // Get the current input value
    setSearchTerm(value);

    if (value.trim()) {
      // Perform search if input is not empty or whitespace
      searchusers();
    } else {
      // Clear filtered contacts if input is empty
      setcontacts([]);
    }
  };

  function isValidUrl(url) {
    try {
      new URL(url); // This will throw an error if the URL is invalid
      return true;
    } catch (e) {
      return false;
    }
  }
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

      <div className="flex w-full bg-white h-[700px] sm:pt-4 sm:flex-row flex-col pt-12 sm:mr-0 mr-4">
        <div className="sm:w-1/4 w-full md:block">
          <h1 className="text-xl text-[#049C01] font-semibold mx-6">
            Contact List
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
                onChange={handlesearching}
              />
            </div>
          </div>
          <div className="overflow-y-auto flex flex-col gap-4 max-h-[calc(100vh-200px)] sm:max-h-[500px]">
            {filteredContact?.length > 0 ? (
              filteredContact?.map((contact) => (
                <div
                  key={contact.id}
                  className={`flex items-start gap-3 px-4 py-2 cursor-pointer ${
                    selectedContact === contact.id
                      ? "bg-[#049C01] text-white"
                      : ""
                  }`}
                  onClick={() =>
                    handleContactClick(
                      contact?.id,
                      contact?.name,
                      // contact?.last_msg?.by_user_id,
                      contact.user_id,
                      contact?.is_blocked,
                      contact?.id,
                      contact?.profile_pic
                    )
                  }
                >
                  <div className="relative flex-shrink-0">
                    {/* <Image
                        src={contact?.profile_pic || user}
                        alt="User"
                        width={45}
                        height={45}
                        className="rounded-full"
                      /> */}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h2 className="font-semibold truncate">{contact.name}</h2>
                    </div>
                    <p
                      className={`text-sm truncate ${
                        selectedContact === contact.id
                          ? "text-white "
                          : "text-[#6E7485]"
                      }`}
                    >
                      {contact?.last_msg?.image ? (
                        <span>Image</span>
                      ) : contact?.last_msg?.audio ? (
                        <span>Audio</span>
                      ) : (
                        <span>
                          {contact?.last_msg?.text || "Tap to Send Message"}
                        </span>
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
                      {contact?.last_msg?.createdAt}
                    </span>

                    {contact?.last_msg?.unreadCount > 0 && (
                      <span className="text-xs text-white bg-[#049C01] rounded-full px-2">
                        {contact?.last_msg?.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : filteredContacts?.length > 0 ? (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`flex items-start gap-3 px-4 py-2 cursor-pointer ${
                    selectedContact === contact.id
                      ? "bg-[#049C01] text-white"
                      : ""
                  }`}
                  onClick={() =>
                    handleContactClicks(
                      contact?.id,
                      contact?.title,
                      // contact?.last_msg.by_user_id,
                      contact.user_id,
                      contact?.is_blocked,
                      contact?.user_id,
                      contact?.image
                    )
                  }
                >
                  <div className="relative flex-shrink-0">
                    <Image
                      src={contact?.image || user}
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
                      className={`text-sm truncate ${
                        selectedContact === contact.id
                          ? "text-white "
                          : "text-[#6E7485]"
                      }`}
                    >
                      {contact?.last_msg?.image ? (
                        <span>Image</span>
                      ) : contact?.last_msg?.audio ? (
                        <span>Audio</span>
                      ) : (
                        <span>{contact?.last_msg?.text}</span>
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
                      {contact?.last_msg?.createdAt}
                    </span>

                    {contact?.last_msg?.unreadCount > 0 && (
                      <span className="text-xs text-white bg-[#049C01] rounded-full px-2">
                        {contact.last_msg.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : filteredContacts.length > 0 && filteredContact.length > 0 ? (
              <p className="text-center text-[#6E7485]"> No contacts found</p>
            ) : loading ? (
              <p className="text-center text-[#6E7485]">
                Loading Contact List...
              </p>
            ) : null}

            {/* <div className="mt-4">
              {filteredContacts ?? null ? (
                filteredContacts?.length > 0 ? (
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
                          contact.last_msg.by_user_id,
                          contact.is_blocked,
                          contact.user_id,
                          contact.image
                        )
                      }
                    >
                      <div className="relative flex-shrink-0">
                        <Image
                          src={contact.image || "/default-user.png"}
                          alt="User"
                          width={45}
                          height={45}
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
                              ? "text-white"
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
                  <p className="text-center text-[#6E7485]">
                    No contacts found
                  </p>
                )
              ) : filteredContact?.length > 0 ? (
                filteredContact.map((contact) => (
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
                        contact.last_msg.by_user_id,
                        contact.is_blocked,
                        contact.user_id,
                        contact.image
                      )
                    }
                  >
                    <div className="relative flex-shrink-0">
                      <Image
                        src={contact.image || "/default-user.png"}
                        alt="User"
                        width={45}
                        height={45}
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
                            ? "text-white"
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
                <p className="text-center text-[#6E7485]">No chats found</p>
              )}
            </div> */}
          </div>
        </div>
        {selectedContact ? (
          <div className="flex-1 flex flex-col sm:ml-4 ml-0 sm:mr-4 mr-0 sm:h-auto  sm:mt-0 mt-12">
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
                  className="rounded-full"
                  loading="lazy"
                />
                <div>
                  <h2 className="font-semibold text-[#1D2026]">
                    {name || "Select a chat"}
                  </h2>
                  <p className="text-sm text-[#4E5566]">Online</p>
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
                    <Link href="contact-list/profile">
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                    </Link>
                    <Link href="contact-list/payment-history">
                      <DropdownMenuItem>Payment History</DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>
                      {block == 1 ? (
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
              className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-200px)] sm:max-h-[500px]"
            >
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex items-start gap-2 ${
                      message.by_user_id === userid
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div
                      className={`flex gap-3 items-center ${
                        message.by_user_id === userid
                          ? "flex-row"
                          : "flex-row-reverse"
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
                            : "text-black bg-[#f1f1f1]"
                        }`}
                      >
                        {message.text && (
                          <p className="text-sm">{message.text}</p>
                        )}

                        {message.audio && (
                          <PlayAudio audioUri={message.audio} />
                        )}
                        {message?.image && (
                          <Image
                            src={message.image}
                            alt="Image"
                            width={100}
                            height={100}
                            loading="lazy"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : loading ? (
                <p className="text-center text-[#6E7485]">
                  Loading Messages...
                </p>
              ) : null}
            </div>

            {block == 1 ? (
              <div className="text-red-500 text-center">
                <p>Unblock the User First To send Message </p>
              </div>
            ) : (
              <div className="py-1 border-2 flex items-center gap-3 px-4 rounded-lg mt-4 sm:mb-0 mb-12">
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
          </div>
        ) : (
          <div className="text-center flex justify-center items-center mt-12 sm:mt-0 w-full">
            <p className="mx-auto text-xl font-semibold">No Chat Selected!</p>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
