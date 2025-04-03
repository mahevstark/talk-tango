import { useState } from "react";
import { X } from "lucide-react";

export default function Component({ name, userid, convoid, block, unblock }) {
  const [isOpen, setIsOpen] = useState(true);
  const userName = name;
  console.log("blocking status", unblock);

  const token = localStorage.getItem("token");
  const handleClose = () => setIsOpen(false);
  const handleBlockUser = () => {

    const axios = require("axios");
    let data = JSON.stringify({
      token: token,
      convo_id: convoid,
      block_status: unblock,
      block_to: userid,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://talktango.estamart.com/api/blockUser",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.action === "success") {
          if (typeof window !== "undefined") {
            window.location.reload();
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });

    setIsOpen(false);
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
        <div className="bg-white rounded-lg shadow-lg w-80 p-6">
          <div className="flex justify-center items-center border-b pb-2">
            <h2 className="text-lg text-center font-semibold">
              {block == 1 ? "Unblock User " : "Block User"}
            </h2>
           
          </div>
          <div className="mt-4">
            <p className="text-sm">
              Are you sure you want to {block == 1 ? "Unblock" : "Block"}{" "}
              <span className="font-bold">{userName}</span>?
            </p>
          </div>
          <div className="flex justify-end mt-6 space-x-2 ">
            <button
              onClick={handleClose}
              className="px-4 py-2 border w-full border-[#049C01] text-[#049C01]  rounded-lg hover:bg-green-50"
            >
              Cancel
            </button>
            <button
              onClick={handleBlockUser}
              className="px-4 py-2 w-full  bg-[#049C01] text-white rounded-lg hover:bg-green-600"
            >
              {block == 1 ? "Unblock User" : " Block User"}
            </button>
          </div>
        </div>
      </div>
    )
  );
}
