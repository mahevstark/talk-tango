"use client";

import * as React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import whatsapp from "../../../public/svgs/whatssapp.svg";
import copyies from "../../../public/svgs/copyies.svg";
import facebookIcon from "../../../public/svgs/facebook.svg";
import twitterIcon from "../../../public/svgs/twiter.svg";
import instagramIcon from "../../../public/svgs/instagram.svg";
import linkedinIcon from "../../../public/svgs/linkedin.svg";
import { useState } from "react";

const signUpUrl = "https://talk-tango-latest.vercel.app/auth/signup";

const shareData = {
  url: "https://talk-tango-latest.vercel.app/auth/signup",
  users: [
    { name: "Štefančík", image: "/placeholder.svg?height=32&width=32" },
    { name: "Roksolana", image: "/placeholder.svg?height=32&width=32" },
    { name: "Mathias", image: "/placeholder.svg?height=32&width=32" },
    { name: "Joshua Fuller", image: "/placeholder.svg?height=32&width=32" },
  ],
  socialLinks: [
    {
      name: "WhatsApp",
      icon: whatsapp,
      link: `https://wa.me/?text=Hey%20I%20just%20signed%20up%20for%20this%20awesome%20app!%20Join%20me%20now%20at%20${encodeURIComponent(
        signUpUrl
      )}%20`,
    },
    {
      name: "Facebook",
      icon: facebookIcon,
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        signUpUrl
      )}`,
    },
    {
      name: "Twitter",
      icon: twitterIcon,
      link: `https://twitter.com/intent/tweet?text=Hey%20I%20just%20signed%20up%20for%20this%20awesome%20app!%20Join%20me%20now%20at%20${encodeURIComponent(
        signUpUrl
      )}`,
    },
    {
      name: "Instagram",
      icon: instagramIcon,
      link: `mailto:?subject=Join%20Me%20on%20This%20App&body=Hey,%20I%20just%20signed%20up%20for%20this%20amazing%20app.%20Join%20me%20now%20at%20${encodeURIComponent(
        signUpUrl
      )}%20`,
    },
    {
      name: "LinkedIn",
      icon: linkedinIcon,
      link: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        signUpUrl
      )}`,
    },
  ],
};

export default function ShareDialog({ isOpen, onOpenChange }) {
  const [copied, setCopied] = useState(false);
  const login = "https://talk-tango-latest.vercel.app/auth/signup";

  const handleCopy = () => {
    navigator.clipboard
      .writeText(login)
      .then(() => {
        // Set the state to show a successful copy message
        setCopied(true);
        // Reset the copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="flex-1 rounded-md px-3 py-2 text-sm text-black">
              {shareData.url}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="border-none hover:bg-white"
            >
              <Image src={copyies} alt="copy icon" loading="lazy" />
              <p className="text-sm text-[#383838] cursor-pointer">
                {copied ? "Copied!" : "Copy"}
              </p>
            </Button>
          </div>

          {/* Social share buttons */}
          <div className="flex justify-between">
            {shareData.socialLinks.map((social) => (
              <div
                className="flex gap-2 items-center flex-col"
                key={social.name}
              >
                <a
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center items-center text-white border-0 h-12 w-12 rounded-full bg-gray-200"
                >
                  <Image src={social.icon} alt={social.name} loading="lazy" />
                </a>
                <p className="text-sm">{social.name}</p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
