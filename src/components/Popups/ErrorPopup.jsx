"is client";
import React, { useState, useEffect } from "react";
import { XCircle } from "lucide-react";

const ErrorPopup = ({ message, duration = 2000, onClose, color }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose && onClose();
  };

  if (!isVisible) return null;
  console.log('coloor', color);

  const colors = {
    red: 'bg-red-200 border border-red-400 text-red-700',
    green: 'bg-green-200 border border-green-400 text-green-700',
    blue: 'bg-blue-200 border border-blue-400 text-blue-700',
    // add more colors as needed
  };
  return (
    <div className="fixed top-4 right-4 z-[1000000] max-w-sm ">
      <div
        className={`${colors[color] || colors.red} px-4 py-3 rounded relative`}
        role="alert"
      >

        <span className="block sm:inline"> {message}</span>
        <button
          onClick={handleClose}
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
        >

        </button>
      </div>
    </div>
  );
};

export default ErrorPopup;
