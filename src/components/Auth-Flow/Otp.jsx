"use client";
import React, { useState, useRef, useEffect } from "react";
import loginIllustation from "../../../public/assets/forgotpassword-image.png";
import Image from "next/image";
import { motion } from "framer-motion";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Loader from "../loader";
import Errorpopup from "../.../../../components/Popups/ErrorPopup";

export default function OTPPage() {
  const [timer, setTimer] = useState(60);
  const [values, setValues] = useState("");
  const [isOtpExpired, setIsOtpExpired] = useState(false); // Track if OTP is expired
  const inputRefs = useRef([]);
  const [intervalId, setIntervalId] = useState(null); // To store the interval ID for timer
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");
  const [color, setColor] = useState('red');

  useEffect(() => {
    const interval = setInterval(() => {
      setErrorMessage(null);
    }, 3000);

    return () => clearInterval(interval); // Cleanup on unmount/re-render
  }, []); // Empty dependency array ensures it runs only once

  useEffect(() => {
    if (timer === 0) {
      setIsOtpExpired(true); // Mark OTP as expired when timer hits 0
      return;
    }

    const countdown = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);
    setIntervalId(countdown); // Save the interval ID

    return () => clearInterval(countdown); // Clean up the interval when the component is unmounted
  }, [timer]);
  // error wou;d be here
  const { pathname } = router;
  const params = new URLSearchParams(pathname?.split("?")[1]);

  const source = params.get("username");
  const email = source;

  // let searchParams;
  // let source;

  // let email;

  // searchParams = useSearchParams();
  // source = searchParams.get("username");

  // email = searchParams.get("username");

  const handleInputChange = (e, index) => {
    const value = e.target.value;

    // Concatenate the value to the OTP string
    setValues((prevOtp) => {
      const updatedOtp = [...prevOtp];
      updatedOtp[index] = value;
      return updatedOtp.join(""); // Join the array into a string
    });

    // Automatically move to the next input when the value length is 1
    if (value.length === 1 && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const resetTimer = () => {
    setTimer(60); // Restart timer to 60 seconds
    setIsOtpExpired(false); // Reset OTP expiration state
    clearInterval(intervalId); // Clear the previous interval
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
  };

  // API call for OTP validation for signup screen
  const handleOtp = async (event) => {
    event.preventDefault();
    setloading(true);
    if (isOtpExpired) {
      setError("OTP has expired. Please request a new one.");

      setloading(false);
      return; // Don't proceed if OTP has expired
    }

    if (values.length < 4) {
      setError("Please enter valid OTP");
      setloading(false);
      return;
    }

    const otp = parseInt(values);
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username__");

    let url = "";
    username
      ? (url = "https://talktango.estamart.com/api/confirm_forgot_otp")
      : (url = "https://talktango.estamart.com/api/confirm_otp");


    try {
      const response = await axios.post(
        url,
        source ? { email, token, otp } : { otp, token },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.action === "success") {
        console.log("success");
        clearInterval(intervalId);
        // localStorage.setItem("token", response.data.data.token);
        setColor('green')
        setError("OTP confirmed successfully!");
        setloading(false);
        username
          ? router.push("/auth/create-password")
          : router.push("/auth/create-profile");
        localStorage.removeItem("username__");
      } else {
        setColor('')
        setColor('red')
        setError("Invalid OTP");

        setloading(false);
      }
    } catch (error) {
      console.log("error of api of otp", error);
      setloading(false);
      resetTimer(); // Restart the timer on API error
    }
  };

  // api call for resend the otp
  //   const resendOtp = async (event) => {
  //     event.preventDefault();
  // resetTimer();

  //     const token = localStorage.getItem("token");

  //     try {
  //       const response = await axios.post(
  //         "https://talktango.estamart.com/api/confirm_otp",
  //         { otp, token },
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       if (response.data.action === "success") {
  //         console.log("success");
  //         clearInterval(intervalId);
  //         alert("OTP confirmed successfully!");
  //       } else {
  //         alert("Invalid OTP");
  //         resetTimer(); // Restart the timer if OTP is invalid
  //       }
  //     } catch (error) {
  //       console.log("error of api of otp", error);
  //       alert("Error occurred while validating OTP");
  //       resetTimer(); // Restart the timer on API error
  //     }
  //   };

  // resend otp api calll

  const handleresendotp = async (event) => {
    event.preventDefault();
    resetTimer();
    setloading(true);
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username__");

    // Create the request payload
    const data = JSON.stringify({
      email: username,
      token: token,
    });

    // Axios configuration
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://talktango.estamart.com/api/forgot_pw",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    // Make the API request
    try {
      const response = await axios.request(config);

      if (response.data.action === "success") {
        setErrorMessage("OTP sent successfully!");
        setloading(false);
      } else {
        console.log("Unexpected response:", response);
        setError("Failed to send OTP. Please try again.");
        setloading(false);
      }
    } catch (error) {
      console.log("Error during forgot password request:", error);
      setError("An error occurred. Please try again.");
      setloading(false);
    }
  };

  return (
    <div className="flex text-[#049C01] flex-col md:flex-row h-screen">
      {/* Left Image Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="md:w-1/2 w-full flex items-center justify-center bg-[#049C01]"
      >
        <Image
          src={loginIllustation}
          alt="OTP Illustration"
          className="max-w-full h-auto p-4"
          loading="lazy"
        />
      </motion.div>

      {/* Right Form Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="md:w-1/2 w-full flex items-center justify-center p-8 bg-white relative"
      >
        {/* Radial Background Animation */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
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
          className="w-full max-w-md space-y-[24px]"
          variants={fadeInUp}
        >
          <motion.h2
            className="text-3xl font-bold text-black z-10"
            variants={fadeInUp}
          >
            OTP
          </motion.h2>
          <motion.p className="text-gray-500 z-10" variants={fadeInUp}>
            Please enter OTP code for confirmation
          </motion.p>

          <form className="space-y-4">
            <motion.div
              className="flex justify-center space-x-[24px]"
              variants={fadeInUp}
            >
              {[...Array(4)].map((_, index) => (
                <motion.input
                  key={index}
                  type="text"
                  maxLength="1"
                  required
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleInputChange(e, index)}
                  className="max-md:w-16 md:w-24 h-14 border rounded-lg text-center text-2xl focus:outline-[#049C01] z-10"
                  variants={scaleIn}
                />
              ))}
            </motion.div>

            <motion.div
              className="text-center text-[#049C01] mt-4 z-10"
              variants={fadeInUp}
            >
              {timer > 0 ? (
                <span>00:{timer.toString().padStart(2, "0")}</span>
              ) : (
                <button
                  className="text-green-600 cursor-pointer"
                  onClick={handleresendotp}
                >
                  Send again
                </button>
              )}
            </motion.div>

            <motion.button
              variants={scaleIn}
              className="w-full transition-all duration-300 bg-[#049C01] text-lg mt-[30px] font-medium text-white a
                  p-3 rounded-full  border-2 border-[#049C01] flex items-center  gap-4 justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOtp}
            >
              {errorMessage ? (
                <p className="text-white text-sm font-semibold text-center">
                  {errorMessage}
                </p>
              ) : loading ? (
                <span className="flex gap-3">
                  Confirm <Loader />{" "}
                </span>
              ) : (
                <p>Confirm</p>
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
      {error && <Errorpopup message={error} onClose={() => setError("")} color={color} />}
    </div>
  );
}
