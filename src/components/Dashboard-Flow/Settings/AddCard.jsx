"use client";
import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
const Home = () => {
  const [shownSuc, setShownSuc] = useState(false);
  const [token, setToken] = useState(null);
  // URLs to check in the WebView
  const urls = {
    API: "https://talktango.estamart.com/", // Replace with your actual API URL
  };

  // Retrieve token from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const onNavigationStateChange = (url) => {
    console.log("Detected URL change:", url);

    // Check if the URL matches the "card_has_been_saved" and "card_has_been_failed"
    if (url === `${urls.API}card_has_been_saved` && !shownSuc) {
      setShownSuc(true);
      console.log("Card has been saved");
      alert("Card has been saved");

      setTimeout(() => {}, 2000);
    }

    if (url === `${urls.API}card_has_been_failed` && !shownSuc) {
      setShownSuc(true);
      console.log("Card saving failed");
      alert("Card saving has been failed");
    }
  };

  // Dynamically construct the URL with the token
  const urlToRender = token
    ? `${urls.API}welcome/card_saver?token=${token}`
    : "";

  console.log("Generated URL to render: ", urlToRender);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 ">
      <h1 className="text-3xl font-semibold mb-5">Add Your Card Here </h1>

      {token ? (
        <iframe
          src={urlToRender}
          className="w-full h-64"
          onLoad={(e) => {
            const currentUrl = e.target.contentWindow.location.href;
            onNavigationStateChange(currentUrl);
          }}
          style={{ border: "none" }}
        />
      ) : (
        <p>Loading...</p> // Show loading message if token is not yet available
      )}
    </div>
  );
};

export default Home;
