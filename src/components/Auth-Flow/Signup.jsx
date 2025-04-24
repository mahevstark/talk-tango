"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { IoKeyOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import loginIllustation from "../../../public/assets/signup-image.png";
import axios from "axios";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Loader from "../loader";
import Errorpopup from "../.../../../components/Popups/ErrorPopup";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPass, setConfirmPass] = useState("");

  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");

  //signup api
  const Router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setErrorMessage(null);
    }, 3000);

    return () => clearInterval(interval); // Cleanup on unmount/re-render
  }, []); // Empty dependency array ensures it runs only once

  const Signup = async (event) => {
    event.preventDefault();
    setErrorMessage(null);
    setloading(true);
    const values = { email: username, password };
    const validateEmail = (email) => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    };


    if (username === "" || password === "") {
      setError("One or more fields are empty");
      setloading(false);

      return;
    } else if (password.length < 8) {
      setError("Password must be 8 characters long");
      setloading(false);
      return;
    } else if (!validateEmail(username)) {
      setError("Invalid Email");
      setloading(false);
      return;
    }


    else if (password !== confirmPass) {

      setError("Passwords not matched")
      setloading(false);
      return;
    }


    try {
      const response = await axios.post(
        "https://talktango.estamart.com/api/signup",
        values
      );


      if (response.data.action === "success") {

        const token = response.data.data.token;
        localStorage.removeItem("token");
        localStorage.setItem("token", token);
        localStorage.removeItem("username__");

        setloading(false);

        Router.push("/auth/otp");
      } else {
        setError("user already exists please try with another email");
        setloading(false);

        console.log("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.log("signup failed", error);
      setError("Signup failed");

      setloading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // Stagger Animation Variants
  const fadeInUpVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1, // Delay between each child
      },
    },
  };

  return (
    <div className="flex flex-col md:flex-row h-screen text-black overflow-hidden">
      {/* Left Image Section with Slide-in Animation */}
      <motion.div
        className="md:w-1/2 w-full flex items-center justify-center bg-[#049C01] h-1/3 md:h-auto"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
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
        className="md:w-1/2 w-full flex items-center justify-center p-8 bg-white relative overflow-hidden h-2/3 md:h-auto"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
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

        <motion.div
          className="w-full max-w-md space-y-6 z-10 relative overflow-y-auto h-full justify-center flex flex-col "
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.h2 className="text-3xl font-bold" variants={fadeInUpVariants}>
            Create new account
          </motion.h2>

          <form className="space-y-[24px]">
            <motion.div
              className="relative flex flex-row items-center"
              variants={fadeInUpVariants}
            >
              <span className="absolute left-3 text-gray-500">
                <MdOutlineMail className="w-[20px] h-[20px]" />
              </span>
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full border rounded-[90px] p-3 pl-10 focus:outline-[#049C01]"
                onChange={(e) => setusername(e.target.value)}
              />
            </motion.div>

            <motion.div
              className="relative flex flex-row items-center"
              variants={fadeInUpVariants}
            >
              <span className="absolute left-3 text-gray-500">
                <IoKeyOutline className="w-[20px] h-[20px]" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className="w-full border rounded-[90px] p-3 pl-10 focus:outline-[#049C01]"
                onChange={(e) => setpassword(e.target.value)}
                minLength={8}
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
              variants={fadeInUpVariants}
            >
              <span className="absolute left-3 text-gray-500">
                <IoKeyOutline className="w-[20px] h-[20px]" />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                required
                className="w-full border rounded-[90px] p-3 pl-10 focus:outline-[#049C01]"
                onChange={(e) => {
                  setConfirmPass(e.target.value)
                }}
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

            <motion.div variants={fadeInUpVariants}>
              <button
                className="w-full bg-[#049C01] mt-[24px] border-2 border-[#049C01] transition-all duration-300 font-medium text-white p-3 rounded-[90px] flex items-center  gap-4 justify-center"
                onClick={Signup}
              >
                {errorMessage ? (
                  <p className="text-white text-sm font-semibold text-center">
                    {errorMessage}
                  </p>
                ) : loading ? (
                  <span className="flex gap-3">
                    Sign Up <Loader />
                  </span>
                ) : (
                  <p>Sign Up</p>
                )}
              </button>
            </motion.div>
          </form>

          <motion.div className="text-center" variants={fadeInUpVariants}>
            <p>
              Already have an account?{" "}
              <Link href="/auth/login" className="text-[#506CFB]">
                SIGN IN
              </Link>
            </p>
          </motion.div>

          {/* <motion.div
            className="flex items-center justify-between my-4"
            variants={fadeInUpVariants}
          >
            <span className="border-b w-1/5 lg:w-1/4"></span>
            <p className="text-center text-sm text-gray-500">or</p>
            <span className="border-b w-1/5 lg:w-1/4"></span>
          </motion.div> */}

          {/* <motion.div
            className="text-[#868686] justify-center items-center flex flex-col"
            variants={fadeInUpVariants}
          >
            continue with
          </motion.div> */}
          {/* <motion.div
            className="flex justify-center space-x-4"
            variants={staggerContainer}
          >
            <motion.button
              className="p-3 bg-gray-100 rounded-full"
              variants={fadeInUpVariants}
            >
              <FcGoogle className="w-[65px] h-[35px]" />
            </motion.button>
            <motion.button
              className="p-3 bg-gray-100 rounded-full"
              variants={fadeInUpVariants}
            >
              <FaFacebook className="text-[#1877F2] w-[65px] h-[35px]" />
            </motion.button>
            <motion.button
              className="p-3 bg-gray-100 rounded-full"
              variants={fadeInUpVariants}
            >
              <FaApple className="text-[#868686] w-[65px] h-[35px]" />
            </motion.button>
          </motion.div> */}
        </motion.div>
      </motion.div>
      {error && <Errorpopup message={error} onClose={() => setError("")} />}
    </div>
  );
}
