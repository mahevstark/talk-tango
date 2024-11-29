"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";
import { MdOutlineMail } from "react-icons/md";
import { IoKeyOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import axios from "axios";
import loginIllustation from "../../../public/assets/login-image.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Loader from "../loader";
import Errorpopup from "../.../../../components/Popups/ErrorPopup";
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [username, setusername] = useState("");
  const [mounted, Ismounted] = useState(false);
  const [password, setpassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setloading] = useState(false);
  const Router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setErrorMessage(null);
    }, 3000);

    return () => clearInterval(interval); // Cleanup on unmount/re-render
  }, []); // Empty dependency array ensures it runs only once

  const Login = async (event) => {
    event.preventDefault();
    setErrorMessage(null);
    setloading(true);

    if (username === "" || password === "") {
      setErrorMessage("One or more fields are empty");
      setError("One or more fields are empty");
      setloading(false);

      return;
    }
    if (!/\S+@\S+\.\S+/.test(username)) {
      setError("Invalid Email");
      setloading(false);
      return;
    }
    const values = { email: username, password };

    try {
      const response = await axios.post(
        "https://talktango.estamart.com/api/login_with_email",
        values
      );
      console.log("response", response);

      if (response.data.action === "success") {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("id", response.data.data.id);
        // localStorage.setItem("email", response.data.data.email);
        localStorage.setItem("name", response.data.data.name);
        localStorage.setItem("about", response.data.data.about);
        localStorage.setItem("usersdata", JSON.stringify(response.data.data));
        localStorage.setItem("image", response.data.data.profile_pic);

        console.log("success");
        setloading(false);
        Router.push("/dashboard/messages");
      } else {
        console.log("Unexpected response status:", response);
        setError("Invalid credentials");
        setloading(false);
      }
    } catch (error) {
      console.log("Login failed", error);
      setloading(false);
      setErrorMessage("Login failed");
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  useEffect(() => {
    setAnimate(true);
    Ismounted(true);
  }, []);

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col text-black md:flex-row h-screen">
      {/* Left Image Section */}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="md:w-1/2 w-full flex items-center justify-center bg-[#049C01] transition-opacity duration-1000 transform"
      >
        <Image
          src={loginIllustation}
          alt="Login Illustration"
          className="max-w-full h-auto p-4"
          loading="lazy"
        />
      </motion.div>

      {/* Right Form Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
        className="md:w-1/2 w-full flex items-center justify-center p-8 bg-white transition-opacity duration-1000 transform relative"
      >
        {/* Radial Background Animation */}
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

        <div className="w-full max-w-md space-y-[24px] z-10">
          <motion.h2 variants={fadeInUp} className="text-[32px] font-semibold">
            Welcome Back
          </motion.h2>

          <motion.form variants={staggerChildren} className="space-y-[24px]">
            <motion.div
              variants={fadeInUp}
              className="relative flex flex-row justify-center items-center"
            >
              <span className="absolute left-3 text-gray-500">
                <MdOutlineMail className="w-[20px] h-[20px]" />
              </span>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border p-3 pl-10 rounded-[90px] focus:outline-[#049C01]"
                required
                onChange={(e) => setusername(e.target.value)}
              />
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="relative flex flex-col gap-4 text-[#868686] w-full"
            >
              <div className="relative flex items-center">
                <span className="absolute left-3">
                  <IoKeyOutline className="w-[20px] h-[20px] text-gray-500" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full pl-10 pr-10 p-3 border rounded-[90px] focus:outline-[#049C01]"
                  required
                  onChange={(e) => setpassword(e.target.value)}
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
              </div>
              <div className="flex justify-end w-full">
                <Link href="/auth/forgot-password">
                  <span className="text-sm text-[#868686]">
                    Forgot password?
                  </span>
                </Link>
              </div>
            </motion.div>

            <motion.button
              variants={fadeInUp}
              className="w-full bg-[#049C01]  border-2 border-[#049C01] transition-all duration-300 text-white p-3 mt-[24px] rounded-[90px] flex items-center  gap-4 justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={Login}
            >
              {errorMessage ? (
                <p className="text-white text-sm font-semibold text-center">
                  {errorMessage}
                </p>
              ) : loading ? (
                <span className="flex gap-3">
                  Sign In <Loader />{" "}
                </span>
              ) : (
                <p>Sign In</p>
              )}
            </motion.button>

            {/* {errorMessage && <p>{errorMessage}</p>} */}
          </motion.form>

          <motion.div variants={fadeInUp} className="text-center">
            <p>
              Don’t have an account?{" "}
              <Link href="/auth/signup" className="text-[#506CFB]">
                SIGN UP
              </Link>
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="flex items-center justify-between my-4"
          >
            <span className="border-b w-1/5 lg:w-1/4"></span>
            {/* <p className="text-center text-sm text-gray-500">or</p> */}
            <span className="border-b w-1/5 lg:w-1/4"></span>
          </motion.div>

          {/* <motion.div
            variants={fadeInUp}
            className="text-[#868686] justify-center items-center flex flex-col"
          >
            continue with
          </motion.div>
          <motion.div
            variants={staggerChildren}
            className="flex justify-center space-x-4"
          >
            <motion.button
              variants={fadeInUp}
              className="p-3 bg-gray-100 rounded-full"
            >
              <FcGoogle className="w-[65px] h-[35px]" />
            </motion.button>
            <motion.button
              variants={fadeInUp}
              className="p-3 bg-gray-100 rounded-full"
            >
              <FaFacebook className="text-[#1877F2] w-[65px] h-[35px]" />
            </motion.button>
            <motion.button
              variants={fadeInUp}
              className="p-3 bg-gray-100 rounded-full"
            >
              <FaApple className="text-[#868686] w-[65px] h-[35px]" />
            </motion.button>
          </motion.div> */}
        </div>
        {error && <Errorpopup message={error} onClose={() => setError("")} />}
      </motion.div>
    </div>
  );
}
