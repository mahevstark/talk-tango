// components/WebView.js

import { useEffect, useState } from "react";

const WebView = ({ urlToRender, onUrlChange }) => {
  const [currentUrl, setCurrentUrl] = useState(urlToRender);

  useEffect(() => {
    const handleUrlChange = (event) => {
      // The iframe would send messages to the parent window
      const url = event.origin;
      console.log("URL changed:", url);
      setCurrentUrl(url);
      onUrlChange(url); // Pass the URL to the parent component
    };

    window.addEventListener("message", handleUrlChange);

    return () => {
      window.removeEventListener("message", handleUrlChange);
    };
  }, [onUrlChange]);

  return (
    <iframe
      src={currentUrl}
      className="h-[800px] w-[90vw] mt-5" // Tailwind CSS classes for styling
      onLoad={() => console.log("Iframe loaded")}
    />
  );
};

export default WebView;
