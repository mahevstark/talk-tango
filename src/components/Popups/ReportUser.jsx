import { useState } from "react";
import { X } from "lucide-react";

export default function Component({ userid, convoid }) {
  const [isOpen, setIsOpen] = useState(true);
  const [report, setreport] = useState();
  const [selectedOption, setSelectedOption] = useState(null); // Track the selected option

  const handleClose = () => setIsOpen(false);
  const handleReportUser = () => {
    const token = localStorage.getItem("token");
    const axios = require("axios");
    let data = JSON.stringify({
      token: token,
      report_text: report,
      reported_to: userid,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://talktango.estamart.com/api/report_user",
      headers: {
        "Content-Type": "application/json",
        Cookie: "ci_session=m4qbje105o5208ulbq4l0ac0dm1bv9tm",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOptionClick = (optionText) => {
    setreport(optionText);
    setSelectedOption(optionText);
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
        <div className="bg-white rounded-lg shadow-lg w-80 p-6">
          <div className="flex justify-between items-center border-b pb-2">
            <div className="w-5" /> {/* Spacer to balance the close button */}
            <h2 className="text-lg font-semibold flex-grow text-center">
              Report User
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm">
              Encountered inappropriate behavior? Help us keep the community safe by reporting this user
            </p>
          </div>
          <div className="mt-4 space-y-2">
            {[
              "Spam",
              "Harrasment",
              "Inappropiate Content",
              "Fake Profile",
              "Hate Speech",
              "Scam or Fraud"
            ].map((option, index) => (
              <div
                key={index}
                className={`py-2 px-4 rounded-full text-center cursor-pointer ${selectedOption === option ? "bg-blue-300" : "bg-gray-100"
                  }`} // Highlight selected option
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </div>
            ))}
          </div>
          <div className="mt-6">
            <button
              onClick={handleReportUser}
              className="w-full py-2 bg-[#049C01] text-white rounded-full hover:bg-green-600"
            >
              Report User
            </button>
          </div>
        </div>
      </div>
    )
  );
}
