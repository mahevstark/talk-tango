"use client";

import Link from "next/link";
import SidebarLayout from "../../../components/Layouts/SideBarLayout";
import Back from "../../../../public/svgs/back.svg";
import Image from "next/image";
import whatsp from "../../../../public/svgs/whatsp.svg";
import msg from "../../../../public/svgs/msg.svg";
import ib from "../../../../public/svgs/ib.svg";
import { useState } from "react";
import share from "../../../../public/svgs/share.svg";
import Share from "../../../components/Popups/Share";

// Local URL for sign-up page
const signUpUrl = "https://localhost:3000/auth-flow/sign-up";

const inviteOptions = [
  {
    id: "whatsapp",
    icon: whatsp,
    text: "Invite Friends by WhatsApp",
    link: `https://wa.me/?text=Hey%20I%20just%20signed%20up%20for%20this%20awesome%20app!%20Join%20me%20now%20at%20${encodeURIComponent(
      signUpUrl
    )}%20`,
  },
  {
    id: "email",
    icon: msg,
    text: "Invite Friends by email",
    link: `mailto:?subject=Join%20Me%20on%20This%20App&body=Hey,%20I%20just%20signed%20up%20for%20this%20amazing%20app.%20Join%20me%20now%20at%20${encodeURIComponent(
      signUpUrl
    )}%20`,
  },
  {
    id: "sms",
    icon: ib,
    text: "Invite Friends by sms",
    link: `sms:?body=Hey%20I%20just%20signed%20up%20for%20this%20awesome%20app!%20Join%20me%20now%20at%20${encodeURIComponent(
      signUpUrl
    )}`,
  },
  {
    id: "share",
    icon: share,
    text: "Share Invitation",
    link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      signUpUrl
    )}`,
  },
];

export default function invite() {
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <SidebarLayout>
      {/* Share Component */}
      {isShareOpen && (
        <Share isOpen={isShareOpen} onOpenChange={setIsShareOpen} />
      )}

      <div className="max-w-md mt-12 sm:mt-3 sm:p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-9 w-9"
          >
            <Image src={Back} alt="Go back"  />
            <span className="sr-only">Go back</span>
          </Link>
          <h1 className="text-lg font-medium">Invite Friends</h1>
        </div>

        {/* Invite Options */}
        <div className="space-y-3">
          {inviteOptions.map((option, index) => {
            const isLast = index === inviteOptions.length - 1;

            if (isLast) {
              return (
                <button
                  key={option.id}
                  onClick={() => setIsShareOpen(true)} // Open the share modal
                  className="flex items-center w-full gap-2 p-3 rounded-full hover:shadow-md border border-[#E9EAEB]"
                >
                  <div className="flex h-6 w-6 items-center justify-center">
                    <Image src={option.icon} alt={option.text} loading="lazy" />
                  </div>
                  <span>{option.text}</span>
                </button>
              );
            }

            return (
              <a
                key={option.id}
                href={option.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-full hover:shadow-md border border-[#E9EAEB]"
              >
                <div className="flex h-6 w-6 items-center justify-center">
                  <Image src={option.icon} alt={option.text} loading="lazy" />
                </div>
                <span>{option.text}</span>
              </a>
            );
          })}
        </div>
      </div>
    </SidebarLayout>
  );
}
