"use client";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Framer Motion for animations
import Link from "next/link";

export default function Collaborate() {
  const [inView, setInView] = useState(false);

  // Intersection Observer to trigger animation on view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setInView(true); // Set inView to true when the component is in view
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the component is in view
    );

    const element = document.querySelector("#collaborate-content");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  return (
    <div className="relative min-h-screen text-black bg-white">
      <div className="container mx-auto sm:px-16 py-20 px-4">
        <div className="relative z-10">
          {/* Floating avatars and messages */}
          <motion.div
            className="absolute left-1/4 top-16opacity-100 max-md:opacity-40"
            animate={{ opacity: inView ? 1 : 0, y: [0, -10, 0] }} // Custom bounce effect
            transition={{
              duration: 2,
              ease: "easeInOut",
              delay: 0,
              repeat: Infinity,
            }} // Infinite loop with delay
          >
            <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 shadow-md">
              <img
                className="h-[24px] w-[24px] rounded-full"
                src="assets/float-1.png"
                alt="avatar"
              />
              <span className="text-sm">Just perfect 🔥</span>
            </div>
          </motion.div>

          <motion.div
            className="absolute right-1/4 top-20 opacity-100 max-md:opacity-40"
            animate={{ opacity: inView ? 1 : 0, y: [0, -10, 0] }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              delay: 0.2,
              repeat: Infinity,
            }}
          >
            <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 shadow-md">
              <img
                className="h-[24px] w-[24px] rounded-full"
                src="assets/float-2.png"
                alt="avatar"
              />
              <span className="text-sm">aww Thats great 💖</span>
            </div>
          </motion.div>

          <motion.div
            className="absolute right-10 bottom-1/4 opacity-100 max-md:opacity-40"
            animate={{ opacity: inView ? 1 : 0, y: [0, -10, 0] }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              delay: 0.4,
              repeat: Infinity,
            }}
          >
            <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 shadow-md">
              <img
                className="h-[24px] w-[24px] rounded-full"
                src="assets/float-3.png"
                alt="avatar"
              />
              <span className="text-sm">woohooo this is fun 🙌</span>
            </div>
          </motion.div>

          <motion.div
            className="absolute left-1/5 bottom-10 opacity-100 max-md:opacity-40"
            animate={{ opacity: inView ? 1 : 0, y: [0, -10, 0] }}
            transition={{ duration: 2, delay: 0.6, repeat: Infinity }}
          >
            <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 shadow-md">
              <img
                className="h-[24px] w-[24px] rounded-full"
                src="assets/float-4.png"
                alt="avatar"
              />
              <span className="text-sm">amazing 😎</span>
            </div>
          </motion.div>

          <motion.div
            className="absolute right-1/5 top-1/4 max-md:opacity-[0.4]"
            animate={{ opacity: inView ? 1 : 0, y: [0, -10, 0] }}
            transition={{ duration: 2, delay: 1, repeat: Infinity }}
          >
            <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 shadow-md">
              <img
                className="h-[24px] w-[24px] rounded-full"
                src="assets/float-5.png"
                alt="avatar"
              />
              <span className="text-sm">aww 🥺</span>
            </div>
          </motion.div>

          {/* Main content */}
          <motion.div
            id="collaborate-content"
            className="relative z-20 mb-20 pt-32 text-center"
            animate={{ opacity: inView ? 1 : 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <h1 className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl">
              Connect, share and{" "}
              <span className="text-green-500">collaborate</span>
              <br />
              with anyone, anywhere
            </h1>
            <div className="mx-auto mb-8 flex max-w-xs justify-center gap-4">
              <button className="flex items-center md:py-3 md:px-4 max-md:p-3 rounded-[90px] gap-2 bg-black text-white hover:bg-white hover:text-black border border-black transition-all duration-300">
                <FaApple className="h-[20px] w-[20px]" />
                App Store
              </button>
              <button className="flex items-center md:py-3 md:px-4 max-md:p-2 rounded-[90px] gap-2 bg-black text-white hover:bg-white hover:text-black border border-black transition-all duration-300">
                <FaGooglePlay className="h-[20px] w-[20px]" />
                Google Play
              </button>
            </div>
          </motion.div>
        </div>

        {/* Features section */}
        <motion.div
          className="grid gap-12 md:grid-cols-2 md:items-start"
          animate={{ opacity: inView ? 1 : 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <div className="space-y-6">
            <div className="text-[18px] font-semibold uppercase tracking-wider text-green-500">
              SEAMLESS MESSAGING
            </div>
            <h2
              className="text-[40px] md:font-semibold font-medium"
              style={{ lineHeight: "normal" }}
            >
              Connect people with high-
              <br />
              quality messaging
            </h2>

            <p className="text-lg text-gray-600">
              ClearLink is designed to give you a seamless messaging experience
              with unparalleled quality, clarity, and security. Connect with
              friends, family, and colleagues through crystal-clear messages,
              video calls, and photo sharing – all in a secure, easy-to-use
              platform.
            </p>
            <Link href="/auth/login">
              <button className="rounded-full border text-[18px] font-medium p-3 border-[#049C01] bg-white text-[#049C01] hover:text-white transition-all duration-300 hover:bg-[#049C01] mt-3">
                Get Started For Free
              </button>
            </Link>
          </div>
          <div className="relative flex justify-center items-center">
            {/* Background container behind the card */}
            <div className="absolute inset-0 bg-[#DFE1E1] rounded-[30px]"></div>

            {/* Card with image */}
            <img
              className="z-10 h-full transform max-md:translate-x-4 max-md:translate-y-7 md:translate-x-[20px] rounded-[30px] md:translate-y-[30px] w-full"
              src="svgs/collab.svg"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
