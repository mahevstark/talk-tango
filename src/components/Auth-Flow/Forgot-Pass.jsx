"use client";

import React, { useState, useEffect } from "react";
import { MdOutlineMail } from "react-icons/md";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState("");
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setErrorMessage(null);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    setLoading(true);

    localStorage.setItem("username__", username);

    const token = isClient ? localStorage.getItem("token") : null;

    const data = JSON.stringify({
      email: username,
      token: token,
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://talktango.estamart.com/api/forgot_pw",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const response = await axios.request(config);

      if (response.data.action === "success") {
        console.log("OTP sent successfully!");
        router.push(`/auth/otp?username=${username}`);
      } else {
        console.log("Unexpected response:", response);
        setErrorMessage("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error during forgot password request:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="flex flex-col text-black md:flex-row h-screen">
      <div className="md:w-1/2 w-full flex items-center justify-center bg-[#049C01]">
        <Image
          src="/assets/forgotpassword-image.png"
          alt="Forgot Password Illustration"
          width={500}
          height={500}
          className="max-w-full h-auto p-4"
        />
      </div>

      <div className="md:w-1/2 w-full flex flex-col items-center md:pt-[181px] p-8 bg-white relative">
        <h2 className="max-md:text-[32px] md:text-[40px] font-medium mb-[24px]">
          Forgot Password
        </h2>
        <p className="text-[#3A3A3A] text-[18px] text-center max-md:font-normal leading-tight md:font-medium mt-[2px] mb-[24px]">
          Please enter the email address associated <br /> with your account
        </p>

        <form
          onSubmit={handleForgotPassword}
          className="w-full max-w-md space-y-[30px]"
        >
          <div className="relative flex flex-row justify-center items-center">
            <span className="absolute left-3 text-gray-500">
              <MdOutlineMail className="w-[20px] h-[20px]" />
            </span>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border p-3 pl-10 rounded-full focus:outline-[#049C01]"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <button
            className="w-full transition-all duration-300 bg-[#049C01] text-lg mt-[30px] font-medium text-white 
              p-3 rounded-full hover:bg-white hover:text-[#049C01] border-2 border-[#049C01]"
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
      </div>
    </div>
  );
}
