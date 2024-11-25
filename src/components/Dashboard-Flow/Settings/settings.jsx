import { useState, useEffect } from "react";
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
  const [notifications, setNotifications] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [isClient, setIsClient] = useState(false); // Track if on client-side
  const router = useRouter();

  useEffect(() => {
    // Ensure code only runs on the client-side
    if (typeof window !== "undefined") {
      setIsClient(true);
      const name = localStorage.getItem("name");
      const role = localStorage.getItem("about");
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
    setNotifications(checked);

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

    axios.request(config).catch((error) => console.log(error));
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
  ];

  return (
    <SidebarLayout>
      <div className="sm:w-full p-4 sm:mt-4 mb-5 w-auto mt-0">
        <p className="text-lg font-semibold text-[#049C01] mb-5 ml-10 mt-1 sm:ml-0 sm:mt-0">
          Settings
        </p>
        <div className="flex sm:items-center justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="cursor-pointer">
              <Image
                src={profileImage || user}
                alt="User"
                width={44}
                loading="lazy"
                height={44}
                className="rounded-full"
              />
            </div>
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
            className="text-green-500"
            onClick={handleEdit}
          >
            <Image src={edit} alt="Edit" width={18} loading="lazy" />
          </Button>
        </div>

        <div className="space-y-4 mt-3 max-w-full flex justify-between gap-10 flex-col sm:flex-row">
          <div className="flex flex-col gap-4 sm:w-[526px] w-auto">
            {settings.map((setting, index) => (
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
                  ) : (
                    <Image src={setting.icon} alt="Setting" width={18} />
                  )}
                  <Link href={setting.link}>
                    <span>{setting.label}</span>
                  </Link>
                </div>
                {setting.hasSwitch && (
                  <Switch
                    checked={notifications}
                    onCheckedChange={handleNotificationToggle}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            <span className="mt-auto text-sm flex flex-col gap-6">
              <p className="text-[#757575]">
                Donec vestibulum, velit sit amet dapibus rutrum, elit felis
                bibendum tellus, euismod sagittis neque enim eu felis. In
                interdum mollis nisl, vitae rutrum magna.
              </p>
              <span className="flex justify-end">
                <Deleteaccount />
              </span>
            </span>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
