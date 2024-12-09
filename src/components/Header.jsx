"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

export default function header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // Remove <HTMLDivElement> type annotation
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about-us" },
    { name: "Contact Us", path: "/contact-us" },
  ];

  const authItems = [
    { name: "Log In", path: "/auth/login" },
    { name: "Sign Up", path: "/auth/signup" },
  ];

  return (
    <header className=" bg-[#049C01]  border-green-500 sticky top-0 z-50 sm:px-12 px-2">
      <motion.div
        className="container mx-auto justify-between flex max-md:h-20 md:h-24 px-2 items-center "
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex gap-10 items-center">
          <Link className="flex items-center space-x-2 text-white" href="/">
            <motion.img
              className=""
              src="/assets/tango-logo.png"
              alt="Logo"
              initial={{ y: -30 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
            />
          </Link>
          <motion.nav className="hidden items-center space-x-8 lg:flex">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ y: -30 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  className="text-[16px] font-semibold text-white transition-colors"
                  href={item.path}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ y: -30 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </motion.nav>
        </div>

        <div className="flex items-center space-x-4">
          {authItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ y: -30 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={item.path}>
                <button
                  className={`hidden bg-[#049C01] transition-all duration-300 px-3 py-1 text-[20px]  lg:inline-flex ${
                    index === 1
                      ? "rounded-full border text-black bg-white "
                      : "text-white "
                  }`}
                >
                  {item.name}
                </button>
              </Link>
            </motion.div>
          ))}

          <motion.button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <FaTimes className="h-6 w-6 text-white" />
            ) : (
              <FaBars className="h-6 w-6 text-white" />
            )}
          </motion.button>
        </div>
      </motion.div>

      {isMenuOpen && (
        <motion.div
          ref={menuRef}
          className="absolute left-0 right-0 top-20 bg-[#049C01] px-4 py-4 shadow-lg lg:hidden  border-green-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.nav
            className="flex flex-col space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.2, duration: 0.8 }}
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ y: -30 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              >
                <Link
                  className="text-lg font-medium text-white hover:text-green-200 transition-colors"
                  href={item.path}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ y: -30 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="relative hidden">
                <input
                  className="w-full bg-white text-[#049C01] px-4 text-[20px] py-[3px] focus:outline-[#049C01] rounded-xl placeholder-[#049C01] border-green-500 focus:border-green-400"
                  placeholder="Search..."
                  aria-label="Search"
                />
                <button
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                >
                  <FaSearch className="h-[20px] mr-2 text-[#049C01] w-[20px]" />
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ y: -30 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex flex-row w-full space-x-2">
                {authItems.map((item) => (
                  <Link key={item.name} href={item.path} className="flex-1">
                    <button className="w-full bg-[#049C01] p-2 rounded-lg  border border-white hover:text-[#049C01] text-white transition-colors">
                      {item.name}
                    </button>
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.nav>
        </motion.div>
      )}
    </header>
  );
}
