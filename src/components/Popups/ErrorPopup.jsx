"is client";
import React, { useState, useEffect } from "react";
import { XCircle } from "lucide-react";

const ErrorPopup = ({ message, duration = 5000, onClose }) => {
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

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
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
