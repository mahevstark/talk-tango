"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ContactForm() {
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

  return (
    <div className="bg-white px-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerChildren}
        className="container mx-auto flex flex-col md:flex-row items-center pb-[100px] justify-center md:space-x-[30px] space-y-[15px] md:space-y-0 max-md:pl-[10px] bg-white text-black min-h-screen"
      >
        <motion.div variants={fadeInUp} className="md:w-1/2 mt-[100px] w-full">
          <motion.h2
            variants={fadeInUp}
            className="text-[40px] font-medium mb-4"
          >
            Let's Chat, Reach Out to Us
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-[#868686] text-[16px] font-normal mb-6"
          >
            Have a question or feedback? We're here to help. Send us a message,
            and we'll respond within 24 hours.
          </motion.p>
          <motion.form variants={staggerChildren} className="space-y-[15px]">
            <motion.div
              variants={fadeInUp}
              className="flex flex-col md:flex-row md:space-x-[15px]"
            >
              <div className="w-full md:w-1/2">
                <label
                  htmlFor="firstName"
                  className="text-black text-[16px] font-medium mb-3 block"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  required
                  className="border rounded-[20px] p-3 focus:outline-[#049C01] text-[#868686] bg-[#F9F2F2] w-full"
                />
              </div>
              <div className="w-full md:w-1/2 mt-[15px] md:mt-0">
                <label
                  htmlFor="lastName"
                  className="text-black text-[16px] font-medium mb-3 block"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  required
                  className="border rounded-[20px] p-3 focus:outline-[#049C01] text-[#868686] bg-[#F9F2F2] w-full"
                />
              </div>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <label
                htmlFor="email"
                className="text-black text-[16px] font-medium mb-3 block"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email Address"
                required
                className="border rounded-[20px] p-3 focus:outline-[#049C01] text-[#868686] bg-[#F9F2F2] w-full"
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <label
                htmlFor="message"
                className="text-black text-[16px] font-medium mb-3 block"
              >
                Message
              </label>
              <textarea
                id="message"
                placeholder="Leave us a message"
                required
                className="border rounded-[20px] p-3 focus:outline-[#049C01] text-[#868686] bg-[#F9F2F2] w-full h-32"
              />
            </motion.div>
            <motion.button
              variants={scaleIn}
              type="submit"
              className="w-full bg-[#049C01] transition-all duration-300 rounded-[20px] hover:bg-white hover:text-[#049C01] text-[15px] hover:border-[#049C01] border-2 text-white p-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit
            </motion.button>
          </motion.form>
        </motion.div>
        <motion.div
          variants={fadeInUp}
          className="md:w-1/2 w-full flex justify-center"
        >
          <motion.img
            src="assets/contact-form.png"
            alt="Contact illustration"
            className="rounded-lg object-cover"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
