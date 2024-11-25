"use client";
import Link from "next/link";
import SidebarLayout from "../../../components/Layouts/SideBarLayout";
import Back from "../../../../public/svgs/back.svg";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Component() {
  const [feedback, setFeedback] = useState("");
  const router = useRouter();
  const sendFeedback = async (event) => {
    event.preventDefault();
    if (feedback === "") {
      alert("Please fill all the fields");
      return;
    }
    const token = localStorage.getItem("token");
    //api call
    const axios = require("axios");
    let data = JSON.stringify({
      token: token,
      feedback: feedback,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://talktango.estamart.com/api/feedback",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.action === "success") {
          router.push("/dashboard/settings");
          console.log(JSON.stringify(response.data));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <SidebarLayout>
      <div className="sm:w-[540px] w-full p-4 mt-10 sm:mt-3">
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="dashboard/settings"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-9 w-9"
          >
            <Image src={Back} alt="something"  />
            <span className="sr-only">Go back</span>
          </Link>
          <h1 className="text-lg font-medium">Feedback</h1>
        </div>
        <p className="text-[#3A3A3A] text-sm w-full sm:w-80">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
          tristique leo a turpis consequat malesuada. In eu neque sit amet
        </p>
        <textarea
          name=""
          id=""
          rows={6}
          cols={60}
          className="focus:outline-none border border-[#E9EAEB] resize-none rounded-2xl mt-5 p-4 text-sm w-full"
          placeholder="Your feedback"
          onChange={(e) => setFeedback(e.target.value)}
        ></textarea>

        <button
          className="bg-[#049C01] mt-12 sm:w-full w-auto px-3 py-2 rounded-full text-white"
          onClick={sendFeedback}
        >
          Send Feedback
        </button>
      </div>
    </SidebarLayout>
  );
}
