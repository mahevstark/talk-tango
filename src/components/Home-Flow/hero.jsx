"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 1.2, ease: [0.6, -0.05, 0.01, 0.99] },
    },
  };

  return (
    <div className="bg-[#049C01] overflow-hidden">
      <motion.main
        className="container mx-auto sm:px-16 px-4 py-12 lg:py-20 grid gap-8 lg:gap-12 items-start lg:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Section */}
        <motion.div
          className="flex flex-col items-start gap-6 "
          variants={containerVariants}
        >
          <motion.h1
            className="md:text-[50px] max-md:text-[30px]  max-md:font-semibold md:font-bold tracking-tight text-white"
            variants={itemVariants}
          >
            Seamless Messaging & Effortless Money Exchange Platform
          </motion.h1>

          <motion.p
            className="text-base md:text-lg text-white/90"
            variants={itemVariants}
          >
            Stay connected with your loved ones and manage your finances all in
            one place. SwiftConnect offers a safe and easy way to send instant
            messages, share photos, and transfer funds across the globe with
            just a few clicks.
          </motion.p>
          <Link href="/auth/login">
            <motion.button
              className="bg-white py-2 px-6 rounded-full text-black hover:bg-[#049C01] font-medium border border-white hover:text-white transition-colors duration-300 text-[16px]   "
              variants={itemVariants}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </Link>
        </motion.div>

        {/* Right Section */}
        <motion.div
          className="relative w-full max-w-2xl mx-auto lg:mx-0 "
          variants={containerVariants}
        >
          <motion.div
            className="aspect-[4/3] overflow-hidden rounded-xl shadow-md"
            variants={imageVariants}
          >
            <motion.img
              alt="Talk Tango interface preview"
              className="object-cover w-full h-full"
              src="assets/landing-page.png"
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: [0.6, -0.05, 0.01, 0.99] }}
            />
          </motion.div>
          <motion.div
            className="absolute -bottom-4 -left-4 w-24 h-24 bg-yellow-400 rounded-full px-16"
            variants={itemVariants}
            style={{ zIndex: -1 }}
          />
          <motion.div
            className="absolute -top-4 -right-4 w-32 h-32 bg-blue-500 rounded-full"
            variants={itemVariants}
            style={{ zIndex: -1 }}
          />
        </motion.div>
      </motion.main>
    </div>
  );
}
