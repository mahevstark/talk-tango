"use client";

import React from "react";
import { motion } from "framer-motion";
import ContactForm from "../ContactUs-Flow/ContactForm";
import Mainlayout from "../Layout-home";
export default function Hero() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
  };

  const slideIn = (direction) => ({
    hidden: { x: direction === "left" ? -50 : 50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
  });

  return (
    <Mainlayout>
      <div className="bg-[#049C01] ">
        <motion.main
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerChildren}
          className="text-black bg-[#049C01] max-md:pl-[10px] max-md:pt-[40px] md:pt-[60px] gap-6 
        justify-center items-start container mx-auto flex md:flex-row max-md:flex-col px-12 sm:px-16"
        >
          <motion.div
            variants={fadeInUp}
            className="flex flex-col items-start space-y-4"
          >
            <motion.h1
              variants={slideIn("left")}
              className="max-md:text-[30px] md:text-[48px] font-medium tracking-tight text-white"
            >
              Contact Us
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-[20px] text-wrap text-white"
            >
              Stay connected with your loved ones and manage your finances all
              in one place. SwiftConnect offers a safe and easy way to send
              instant messages, share photos, and transfer funds across the
              globe with just a few clicks.
            </motion.p>
            <motion.button
              className="bg-white py-2 px-6 rounded-full  text-[#049C01] hover:bg-[#049C01] font-medium border border-white hover:text-white transition-colors duration-300 text-[16px] "
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </motion.div>
          <motion.div
            variants={slideIn("right")}
            className="relative mx-auto w-full max-w-2xl"
          >
            <motion.img
              src="assets/contact-image.png"
              alt="Contact illustration"
              className="object-contain w-full aspect-[1.18] max-md:max-w-full"
              variants={scaleIn}
            />
          </motion.div>
        </motion.main>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInUp}
        >
          <ContactForm />
        </motion.div>
      </div>
    </Mainlayout>
  );
}
