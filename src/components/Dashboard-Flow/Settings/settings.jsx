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
import Reward from '../../../../public/reward/reward.png'
import gifts from '../../../../public/svgs/gift.svg'
import users from '../../../../public/svgs/users.svg'



export default function Settings() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [userData, setUserData] = useState({});
  const [loading, setloading] = useState(false);

  const [notifications, setNotifications] = useState();
  const [profileImage, setProfileImage] = useState("");
  const [isClient, setIsClient] = useState(false); // Track if on client-side
  const router = useRouter();
  const fileInputRef = useRef(null); // Add this if you haven't already
  // Reference to the file input
  const [uploadedUrl, setUploadedUrl] = useState("");

  const [uploadimage, setuploadimage] = useState("");


  useEffect(() => {
    // Ensure code only runs on the client-side
    if (typeof window !== "undefined") {
      setIsClient(true);
      const name = localStorage.getItem("name");
      const role = localStorage?.getItem("about");
      let userData = null;
      const rawData = localStorage.getItem("usersdata");

      if (rawData) {
        try {
          userData = JSON.parse(rawData);
        } catch (error) {
          console.log("Invalid JSON in localStorage for 'usersdata':", error);
        }
      }

      setNotifications(userData?.notification_status === "1" ? true : false);
      setUserData(userData);
      setName(name);
      setRole(role);

      const image = localStorage.getItem("image");
      setProfileImage(image);

      console.log('here is the new image', image);

    }
  }, []); // Only run once, after component mount

  const handleEdit = (newprofileimage) => {
    setIsEditing((prev) => !prev);
    if (isEditing && isClient) {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");



      // localStorage.setItem('image', newprofileimage);

      // console.log('the image from function passed', newprofileimage);


      console.log('hey new image', uploadimage);




      const data = JSON.stringify({
        token: token,
        about: role,
        name: name,
        email: "0codehorizonai0@gmail.com",
        profile_pic: uploadimage,
      });




      localStorage.setItem('image', uploadimage)


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
        .catch((error) => console.log(error));
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      // Check for client-side
      localStorage.clear();
      window.location.href = "/";
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
    }, {
      label: "Rewards",
      link: "/dashboard/settings/rewards",
      hasSwitch: false,
      icon: gifts,
    },
    {
      label: "Referrals",
      link: "/dashboard/settings/referrals",
      hasSwitch: false,
      icon: users,
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
    setloading(true);
    if (!file) {
      alert("Please select an image to upload.");
      setloading(false);
      return;
    }



    const formData = new FormData();
    formData.append("photo", file);

    const token = localStorage.getItem("token");
    formData.append("token", token);

    if (!token) {
      alert("No token found. Please log in again.");

      setloading(false);

      return;
    }

    const response = await fetch(
      "https://talktango.estamart.com/api/profile_picture",
      {
        method: "POST",

        body: formData,
      }
    );
    const result = await response.json();

    if (result.action === "success") {



      const newProfileImage = result.filename;


      setTimeout(() => {
        setuploadimage(newProfileImage);
        localStorage.setItem("image", profileImage);
        setloading(false);

      }, 1000);

      console.log('file name ');

      setProfileImage(newProfileImage);
      setuploadimage(newProfileImage);
      localStorage.setItem("image", profileImage);










    } else {
      setError("Error uploading image");
      setloading(false);

    }
  };

  // Handle click to trigger image file input
  const handleImageClick = () => {
    fileInputRef.current.click(); // Trigger the file input dialog when profile image is clicked
  };

  return (
    <SidebarLayout>
      <div className="sm:w-full p-4 sm:mt-0 mb-5 w-auto mt-8">
        <p className="text-lg font-semibold text-[#049C01] mb-5  mt-1  sm:mt-0">
          Settings
        </p>
        <div className="flex sm:items-center sm:gap-80 gap-10 items-start">
          <div className="flex items-center gap-2">
            <div onClick={handleImageClick} className="cursor-pointer">
              <Image
                src={profileImage || user}
                alt="User"
                width={40}
                height={40}
                className="rounded-full w-[36px] h-[37px]"
              />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpeg, .png , .jpg"
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

          {
            loading ?
              <Button
                variant="ghost"
                size="icon"
                className="text-green-500 border w-24"
                onClick={handleEdit}
              >
                Saving...


              </Button>
              :
              <Button
                variant="ghost"
                size="icon"
                className="text-green-500 border w-24"
                onClick={handleEdit}
              >
                {isEditing ? "Save" : "Edit Profile"}



              </Button>
          }
        </div>

        <div className="space-y-4 mt-3 max-w-full flex justify-between gap-10 flex-col sm:flex-row">
          <div className="flex flex-col gap-4 sm:w-[526px] w-auto">
            {settings.map((setting, index) => (
              <Link href={setting.link} key={index}>
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-full shadow-md hover:shadow-lg border border-[#E9EAEB]"
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
