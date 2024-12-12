import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import Image from "next/image";
import user from "../../../../public/svgs/user.svg";
import edit from "../../../../public/svgs/edit.svg";
import invite from "../../../../public/svgs/invite.svg";
import bell from "../../../../public/svgs/bell.svg";
import feedback from "../../../../public/svgs/feedback.svg";
import blocklist from "../../../../public/svgs/blocklist.svg";
import bankacc from "../../../../public/svgs/bankacc.svg";
import privacy from "../../../../public/svgs/privacy.svg";
import terms from "../../../../public/svgs/terms.svg";
import logout from "../../../../public/svgs/logout.svg";
import SidebarLayout from "../../../components/Layouts/SideBarLayout";
import { useRouter } from "next/navigation";
import Deleteaccount from "../../../components/Popups/DeleteAccount";

export default function Settings() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [userData, setUserData] = useState({});

  const [notifications, setNotifications] = useState();
  const [profileImage, setProfileImage] = useState("");
  const [isClient, setIsClient] = useState(false); // Track if on client-side
  const router = useRouter();
  const fileInputRef = useRef(null); // Add this if you haven't already
  // Reference to the file input
  const [uploadedUrl, setUploadedUrl] = useState("");

  useEffect(() => {
    // Ensure code only runs on the client-side
    if (typeof window !== "undefined") {
      setIsClient(true);
      const name = localStorage.getItem("name");
      const role = localStorage.getItem("about");
      const userData = JSON.parse(localStorage.getItem("usersdata"));
      setNotifications(userData?.notification_status === "1" ? true : false);
      setUserData(userData);
      setName(name);
      setRole(role);

      const image = localStorage.getItem("image");
      setProfileImage(image);
    }
  }, []); // Only run once, after component mount

  const handleEdit = () => {
    setIsEditing((prev) => !prev);
    if (isEditing && isClient) {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");

      const data = JSON.stringify({
        token: token,
        about: role,
        name: name,
        email: email,
        profile_pic: profileImage,
      });

      const config = {
        method: "post",
        url: "https://talktango.estamart.com/api/edit_profile",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          if (response.data.action === "success") {
            localStorage.setItem("name", name);
            localStorage.setItem("about", role);
          }
        })
        .catch((error) => console.error(error));
    }
  };
  const handleLogout = () => {
    if (isClient) {
      localStorage.clear();
      router.push("/");
    }
  };

  const handleNotificationToggle = (checked) => {
    const token = localStorage?.getItem("token");
    const data = JSON.stringify({
      token: token,
      status: checked ? 1 : 0,
    });

    const config = {
      method: "post",
      url: "https://talktango.estamart.com/api/notification_status",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        localStorage.setItem("usersdata", JSON.stringify(response.data?.data));

        checked ? setNotifications(true) : setNotifications(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Early return if client-side data is not loaded
  if (!isClient) return null;

  const settings = [
    {
      label: "Invite Friends",
      link: "/dashboard/settings/invite-friends",
      hasSwitch: false,
      icon: invite,
    },
    { label: "Notification Setting", link: "", hasSwitch: true, icon: bell },
    {
      label: "Feedback",
      link: "/dashboard/settings/feedback",
      hasSwitch: false,
      icon: feedback,
    },
    {
      label: "Block List",
      link: "/dashboard/settings/block-list",
      hasSwitch: false,
      icon: blocklist,
    },
    {
      label: "Change Bank Account",
      link: "/dashboard/settings/change-account",
      hasSwitch: false,
      icon: bankacc,
    },
    {
      label: "Privacy Policy ",
      link: "/dashboard/settings/privacy-policy",
      hasSwitch: false,
      icon: privacy,
    },
    {
      label: "Terms of Use",
      link: "/dashboard/settings/terms",
      hasSwitch: false,
      icon: terms,
    },
    {
      label: "Logout",
      link: "",
      hasSwitch: false,
      icon: logout,
      action: handleLogout,
    },
    {
      label: "Delete",
      link: "",
      hasSwitch: false,
    },
  ];
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file)); // Temporarily show the selected image
      handleImageUpload(file); // Trigger upload
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    const token = localStorage.getItem("token");
    formData.append("token", token);

    if (!token) {
      alert("No token found. Please log in again.");
      // Stop uploading
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
      localStorage.removeItem("image");
      localStorage.setItem("image", result.filename);
    } else {
      setError("Error uploading image");
    }
  };

  // Handle click to trigger image file input
  const handleImageClick = () => {
    fileInputRef.current.click(); // Trigger the file input dialog when profile image is clicked
  };

  return (
    <SidebarLayout>
      <div className="sm:w-full p-4 sm:mt-4 mb-5 w-auto mt-8">
        <p className="text-lg font-semibold text-[#049C01] mb-5  mt-1  sm:mt-0">
          Settings
        </p>
        <div className="flex sm:items-center gap-80 items-start">
          <div className="flex items-center gap-2">
            <div onClick={handleImageClick} className="cursor-pointer">
              <Image
                src={profileImage || user} // Default to 'user' image if profile image is not available
                alt="User"
                width={40}
                height={44}
                className="rounded-full"
              />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden" // Hide the file input
            />

            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="max-w-[200px]"
                  />
                  <Input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="max-w-[200px]"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-sm font-semibold">{name}</h2>
                  <p className="text-sm text-muted-foreground">{role}</p>
                </>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-green-500 border w-24"
            onClick={handleEdit}
          >
          {isEditing ? "Save" : "Edit Profile"}
          </Button>
        </div>

        <div className="space-y-4 mt-3 max-w-full flex justify-between gap-10 flex-col sm:flex-row">
          <div className="flex flex-col gap-4 sm:w-[526px] w-auto">
            {settings.map((setting, index) => (
              <Link href={setting.link} key={index}>
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-full hover:shadow-md border border-[#E9EAEB]"
                >
                  <div
                    className="flex items-center gap-3"
                    onClick={setting.action}
                  >
                    {setting.label === "Logout" ? (
                      <Button variant="ghost" className="hover:bg-white px-2">
                        <Image src={logout} alt="Logout" width={18} />
                      </Button>
                    ) : setting.label === "Delete" ? (
                      <Deleteaccount />
                    ) : (
                      <Image src={setting.icon} alt="Setting" width={18} />
                    )}

                    {setting.label !== "Delete" && <span>{setting.label}</span>}
                  </div>

                  {setting.hasSwitch && (
                    <Switch
                      checked={notifications}
                      onCheckedChange={handleNotificationToggle}
                    />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
