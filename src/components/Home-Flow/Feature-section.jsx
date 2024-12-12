"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function FeatureSection() {
  return (
    <div className="w-full">
      {/* Hero Section with Background Pattern */}
      <section className="relative bg-[#049C01] py-20 sm:px-16 px-4">
        <motion.div
          className="relative mx-auto max-w-2xl px-4 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }} // This triggers the animation when the element comes into view
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="mb-6 text-2xl font-semibold text-white sm:text-5xl">
            It's Easy to Get Started
          </h1>
          <p className="mb-8 text-sm text-white/90">
            Stay connected with your loved ones and manage your finances all in
            one place. SwiftConnect offers a safe and easy way to send instant
            messages, share photos, and transfer funds across the globe with
            just a few clicks.
          </p>
        <Link href="/auth/login">
        <motion.button
            className="rounded-full bg-white text-[black] hover:text-white border transition-all duration-300 py-2 px-6 text-[18px] font-normal border-white hover:bg-[#049C01]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }} // Triggering on view
            transition={{ duration: 1, delay: 0.2 }}
          >
            Get Started
          </motion.button></Link>
        </motion.div>
      </section>

      {/* Money Transfer Section */}
      <section className="py-20 bg-white text-black">
        <motion.div
          className="max-md:gap-10 container mx-auto flex gap-28 max-md:flex-col md:flex-row px-4 md:items-center"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }} // Triggering on view
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="relative md:w-1/2 max-md:mr-4 sm:px-16 px-4">
            {/* Background container behind the card */}
            <motion.div
              className="absolute inset-0 bg-[#DFE1E1] rounded-2xl left-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }} // Triggering opacity change on view
              transition={{ duration: 1, delay: 0.5 }}
            ></motion.div>

            {/* Card with translation */}
            <motion.div
              className="relative mx-auto bg-white overflow-hidden rounded-2xl shadow-2xl transform max-md:translate-x-[15px] max-md:pr-2 max-md:translate-y-[20px] md:translate-x-[40px] md:translate-y-[50px] sm:left-24  sm:top-16 top-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }} // Triggering scale and opacity change on view
              transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
            >
              <div className="space-y-[24px] p-6  ">
                <div className="mb-4 flex items-center justify-between">
                  <button className="text-gray-600">
                    <ArrowLeftIcon className="h-6 w-6" />
                  </button>
                  <h3 className="text-[24px] text-center font-semibold">
                    Request For Money
                  </h3>
                  <button className="text-gray-600">
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>
                <p className="mb-6 text-[20px] font-normal text-center text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                  tristique leo a turpis consequat.
                </p>
                <div className="mb-6 text-center">
                  <span className="text-[32px] font-semibold text-[#049C01]">
                    1500$
                  </span>
                </div>
                <button className="w-full p-3 rounded-[90px] text-[20px] font-normal bg-[#049C01] text-white transition-all duration-300 hover:bg-white border-2 border-[#049C01] hover:text-[#049C01]">
                  Send Money Request
                </button>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="space-y-[24px] sm:px-16 px-4"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }} // Triggering opacity and x-axis transition on view
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="text-[20px] font-medium text-[#049C01]">
              MONEY TRANSFER
            </div>
            <h2 className="sm:text-[40px] text-4xl font-medium">
              Effortless Money Exchange
            </h2>
            <p className="text-lg text-[#868686]">
              Streamline your financial transactions with ease. Send and receive
              money
              <br /> securely, making payments a breeze.
            </p>
           <Link href="/auth/login">
           <button className="rounded-full py-2 px-3 mt-5 sm:py-3 text-[20px] font-medium sm:px-6 border-2 border-black bg-white text-black transition-all duration-300 hover:text-white hover:border-[#049C01] hover:bg-[#049C01]">
              Get Started For Free
            </button></Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}

function ArrowLeftIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
