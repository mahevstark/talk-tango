"use client";
import React, { useState } from "react";
import Link from "next/link";
import { IoKeyOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import loginIllustation from "../../../public/assets/signup-image.png";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const CreatePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const Router = useRouter();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // api call:
  const Signin = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (password === confirmPassword) {
      alert("Password Matched");
    } else {
      alert("Password not matched");
      return;
    }

    const axios = require("axios");
    let data = JSON.stringify({
      password: password,
      token: token,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://talktango.estamart.com/api/create_new_pass",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response);
        Router.push("/auth/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="flex text-black max-md:flex-col h-screen max-sm:h-full">
      {/* Left Image Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="md:w-1/2 bg-[#049C01] flex items-center justify-center max-sm:w-full"
      >
        <Image
          src={loginIllustation}
          alt="Login Illustration"
          className="max-w-full h-auto p-4"
        />
      </motion.div>

      {/* Right Form Section with Animated Radial Background */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="md:w-1/2 flex items-center justify-center bg-white max-sm:w-full p-8 relative overflow-hidden"
      >
        {/* Animated Radial Background */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="absolute inset-0 z-0"
          variants={{
            hidden: {
              background:
                "radial-gradient(circle, rgba(4,156,1,0.1) 0%, rgba(255,255,255,0) 70%)",
            },
            visible: {
              background: [
                "radial-gradient(circle, rgba(4,156,1,0.1) 0%, rgba(255,255,255,0) 70%)",
                "radial-gradient(circle, rgba(4,156,1,0.2) 0%, rgba(255,255,255,0) 70%)",
                "radial-gradient(circle, rgba(4,156,1,0.1) 0%, rgba(255,255,255,0) 70%)",
              ],
            },
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        <div className="md:w-3/4 max-w-md w-full z-10">
          <h2 className="text-[32px] max-md:font-medium md:font-semibold  mb-6">
            Create Password
          </h2>
          <form className="space-y-[24px]">
            <motion.div
              className="relative flex flex-row items-center"
              variants={fadeIn}
            >
              <span className="absolute left-3 text-gray-500">
                <IoKeyOutline className="w-[20px] h-[20px]" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full border rounded-[90px] p-3 pl-10 focus:outline-[#049C01]"
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="absolute right-3 cursor-pointer text-gray-500"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <IoEyeOffOutline className="w-[20px] h-[20px]" />
                ) : (
                  <IoEyeOutline className="w-[20px] h-[20px]" />
                )}
              </span>
            </motion.div>

            <motion.div
              className="relative flex flex-row items-center"
              variants={fadeIn}
            >
              <span className="absolute left-3 text-gray-500">
                <IoKeyOutline className="w-[20px] h-[20px]" />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full border rounded-[90px] p-3 pl-10 focus:outline-[#049C01]"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                className="absolute right-3 cursor-pointer text-gray-500"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <IoEyeOffOutline className="w-[20px] h-[20px]" />
                ) : (
                  <IoEyeOutline className="w-[20px] h-[20px]" />
                )}
              </span>
            </motion.div>

            <Link href="/landing-page">
              <motion.button
                variants={fadeIn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-[#049C01] hover:bg-white hover:text-[#049C01] border-2 border-[#049C01] transition-all duration-300 text-[20px] mt-[24px] font-medium text-white p-3 rounded-[90px]"
                onClick={Signin}
              >
                Sign in
              </motion.button>
            </Link>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreatePassword;
