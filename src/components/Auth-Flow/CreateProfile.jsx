"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaUser, FaPhone, FaBriefcase } from "react-icons/fa";
import { IoCameraSharp } from "react-icons/io5";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Loader from "../loader";
import Errorpopup from "../.../../../components/Popups/ErrorPopup";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Component() {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [about, setAbout] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");
  const [color, setColor] = useState('red');


  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setErrorMessage(null);
    }, 3000);

    return () => clearInterval(interval); // Cleanup on unmount/re-render
  }, []); // Empty dependency array ensures it runs only once

  const createProfile = async (event) => {
    event.preventDefault();
    setloading(true);

    if (name === "" || phone === "" || about === "") {
      setError("One or more fields are empty");
      setloading(false);
      return;
    }

    const token = localStorage.getItem("token");

    const axios = require("axios");
    let data = JSON.stringify({
      about: about,
      name: name,
      password: 123456789,
      phone: phone,
      profile_pic: profileImage,
      social: about,
      token: token,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://talktango.estamart.com/api/create_profile",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.action === "success") {
          setColor('green')

          setError("Profile Created Successfully");
          setloading(false);
          setTimeout(() => {
            router.push("/auth/login");
          }, 1000);
        } else {
          setColor('red')

          setError("Profile Creation Failed");
          setloading(false);
        }
      })
      .catch((error) => {
        setColor('red')
        setError("Profile Creation Faileds");
        setloading(false);
        console.log(error);
      });
  };

  const [image, setImage] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  // profile pic uploading :
  const fileInputRef = useRef(null); // Reference to the file input

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Set the selected image file

      handleImageUpload(file);
    }
  };
  const handleImageUpload = async (file) => {
    if (!file) {
      alert("Please select an image to upload.");
      return;
    }
    setUploading(true);
    const formData = new FormData();

    formData.append("photo", file);

    const token = localStorage.getItem("token");
    formData.append("token", token);

    const response = await fetch(
      "https://talktango.estamart.com/api/profile_picture",
      {
        method: "POST",

        body: formData, // Send formData with the file
      }
    );
    const result = await response.json();

    if (result.action === "success") {
      setUploading(false);
      setColor('green')
      setError("Image Uploaded.");
      setProfileImage(result.filename);
      localStorage.removeItem("image");
      localStorage.setItem("image", result.filename);
    } else {
      setUploading(false);
      setColor('red')

      setError("Error uploading image");
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-100 text-black flex flex-col items-center px-4 py-12 relative overflow-hidden"
      initial="initial"
      animate="animate"
      variants={stagger}
    >
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: [
            "radial-gradient(circle, rgba(4,156,1,0.1) 0%, rgba(255,255,255,0) 70%)",
            "radial-gradient(circle, rgba(4,156,1,0.2) 0%, rgba(255,255,255,0) 70%)",
            "radial-gradient(circle, rgba(4,156,1,0.1) 0%, rgba(255,255,255,0) 70%)",
          ],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <motion.h1
        className="max-md:text-[30px] md:text-[48px] leading-tight max-md:font-medium md:font-semibold text-[#049C01] mb-2"
        variants={fadeIn}
      >
        Create Profile
      </motion.h1>

      <motion.div className="relative mb-8 z-10" variants={fadeIn}>
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <FaUser className="w-12 h-12 text-gray-400" />
          )}
        </div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute bottom-0 right-0"
        >
          <label htmlFor="profileImageInput" className="cursor-pointer">
            <IoCameraSharp className="w-[28px] text-white h-[28px] bg-[#049C01] rounded-full border-2 border-white p-1" />
          </label>
          <input
            id="profileImageInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="w-full max-w-md space-y-[24px] z-10"
        variants={stagger}
      >
        <motion.div className="relative space-x-1" variants={fadeIn}>
          <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <motion.input
            whileFocus={{ scale: 1.02 }}
            className="w-full pl-10 py-3 bg-white border border-gray-300 rounded-[50px] focus:outline-none focus:ring-2 focus:ring-[#049C01]"
            placeholder="Name"
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
        </motion.div>

        <motion.div className="relative space-x-1" variants={fadeIn}>
          <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <motion.input
            whileFocus={{ scale: 1.02 }}
            className="w-full pl-10 py-3 bg-white border border-gray-300 rounded-[50px] focus:outline-none focus:ring-2 focus:ring-[#049C01]"
            placeholder="Phone No"
            type="tel"
            onChange={(e) => setPhone(e.target.value)}
          />
        </motion.div>

        <motion.div className="relative space-x-1" variants={fadeIn}>
          <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <motion.input
            whileFocus={{ scale: 1.02 }}
            className="w-full pl-10 py-3 bg-white border border-gray-300 rounded-[50px] focus:outline-none focus:ring-2 focus:ring-[#049C01]"
            placeholder="About"
            type="text"
            onChange={(e) => setAbout(e.target.value)}
          />
        </motion.div>

        <motion.button
          variants={fadeIn}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.95 }}
          className="w-full  text-white bg-[#049C01] border-2 border-[#049C01] py-3 rounded-[20px] mt-[24px] transition duration-300 ease-in-out flex items-center  gap-4 justify-center"
          onClick={createProfile}
        >
          {

            uploading ? (
              <span className="flex gap-3">
                Uploading Image <Loader />{" "}
              </span>
            ) :
              errorMessage ? (
                <p className="text-white text-sm font-semibold text-center">
                  {errorMessage}
                </p>
              ) : loading ? (
                <span className="flex gap-3">
                  Next <Loader />{" "}
                </span>
              ) : (
                <p>Next</p>
              )}
        </motion.button>
      </motion.div>
      {error && <Errorpopup message={error} onClose={() => setError("")} color={color} />}
    </motion.div>
  );
}
