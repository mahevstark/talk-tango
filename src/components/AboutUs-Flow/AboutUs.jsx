"use client";

import React from "react";
import { motion } from "framer-motion";
import Mainlayout from "../Layout-home";
import Link from "next/link";
export default function aboutus() {
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
      <div className="bg-[#049C01]">
        <motion.main
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerChildren}
          className="text-black bg-[#049C01] pt-8 md:pt-24 gap-6 sm:px-8 md:px-12 lg:px-12 xl:px-14  2xl:px-12 max-2xl:px-5 customcss
        justify-center items-start container mx-auto flex flex-col md:flex-row"
        >
          <motion.div
            variants={fadeInUp}
            className="flex flex-col items-start  space-y-4 md:w-1/2"
          >
            <motion.h1
              variants={slideIn("left")}
              className="text-3xl md:text-5xl font-medium tracking-tight text-white"
            >
              About US
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-lg text-white "
            >
              Stay connected with your loved ones and manage your finances all
              in one place. GranaMe  offers a safe and easy way to send
              instant messages, share photos, and transfer funds across the
              globe with just a few clicks.
            </motion.p>
            <Link href="/">
              <motion.button
                className="bg-white py-2 px-6 rounded-full  text-black hover:bg-[#049C01] font-medium border border-white hover:text-white transition-colors duration-300 text-[16px] "
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </Link>
          </motion.div>
          <motion.div
            variants={slideIn("right")}
            className="relative mx-auto w-full md:w-1/2 mt-8 md:mt-0 flex justify-center items-center"
          >
            <img
              src="assets/contact-image.svg"
              alt="Contact illustration"
              className="object-contain w-full md:w-3/4 lg:w-2/3 h-auto"
            />
          </motion.div>
        </motion.main>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerChildren}
          className="flex bg-white py-12 md:py-24 justify-around 
        px-4 items-center flex-col md:flex-row"
        >
          <motion.span
            variants={slideIn("left")}
            className="text-3xl md:text-4xl text-center md:text-left text-black font-semibold mb-6 md:mb-0"
          >
            We build bridges
            <br /> between people
          </motion.span>
          <motion.span
            variants={slideIn("right")}
            className="text-lg md:text-xl md:w-1/2 text-[#868686] font-normal"
          >
            Platforms that combine messaging and money transfer features offer a
            convenient way to send money while communicating. Depending on your
            needs—whether it's social interaction, ease of use, or
            security—there's likely a platform that fits well.
          </motion.span>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={scaleIn}
          className="flex justify-center"
        >
          <img
            src="/assets/about-image.png"
            alt="About illustration"
            className="object-contain w-full"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerChildren}
          className="flex justify-around bg-white py-12 md:py-24 
        px-4 flex-col md:flex-row"
        >
          <motion.span
            variants={slideIn("left")}
            className="text-3xl md:text-4xl text-center md:text-left text-black font-semibold mb-6 md:mb-0"
          >
            Together we
            <br />
            are strong
          </motion.span>
          <motion.span
            variants={slideIn("right")}
            className="text-lg md:text-xl md:w-1/2 text-[#868686] font-normal"
          >
            Messaging and money transfer platforms have revolutionized the way
            people communicate and transact, offering a seamless experience that
            combines social interaction with financial convenience. With
            features like integrated chat functions, users can discuss payment
            details in real time, enhancing collaboration when splitting bills
            or sending funds to friends and family. The social aspects of these
            platforms, such as the ability to add comments or emojis to
            transactions, create a more engaging experience that resonates
            particularly with younger audiences.
          </motion.span>
        </motion.div>

        <div className="bg-[#868686] h-[0.5px]"></div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerChildren}
          className="bg-white gap-8 justify-evenly py-12 items-center text-center flex flex-col md:flex-row"
        >
          {[
            { label: "Team Members", value: "25+" },
            { label: "Year Experience", value: "12+" },
            { label: "Our User Over", value: "20k+" },
          ].map((item, index) => (
            <motion.span
              key={index}
              variants={scaleIn}
              className="flex flex-col space-y-2"
            >
              <motion.div variants={fadeInUp} className="text-base text-black">
                {item.label}
              </motion.div>
              <motion.div
                variants={scaleIn}
                className="text-5xl md:text-6xl font-medium text-black"
              >
                {item.value}
              </motion.div>
            </motion.span>
          ))}
        </motion.div>
      </div>
    </Mainlayout>
  );
}
