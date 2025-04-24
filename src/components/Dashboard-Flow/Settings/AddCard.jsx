"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const [shownSuc, setShownSuc] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const iframeRef = useRef(null);

  // Base API URL
  const baseApiUrl = "https://talktango.estamart.com/";

  // Retrieve token from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
      }
      setLoading(false);
    }
  }, []);

  // Handle URL parameters for detecting success/failure
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('card_status');

    if (status === 'success' && !shownSuc) {
      handleSuccess();
    } else if (status === 'failure' && !shownSuc) {
      handleFailure();
    }
  }, []);

  // Helper functions for handling success/failure
  const handleSuccess = () => {
    if (shownSuc) return;
    setShownSuc(true);
    console.log("Card saving successful, navigating to settings");
    alert("Card has been saved successfully!");
    setTimeout(() => router.push('/dashboard/settings'), 300);
  };

  const handleFailure = () => {
    if (shownSuc) return;
    setShownSuc(true);
    console.log("Card saving failed");
    alert("Card saving failed. Please try again.");
  };

  // Set up message passing from iframe - CRITICAL PART
  useEffect(() => {
    const handleMessage = (event) => {
      console.log("Received message:", event.data);

      // Check for successful card save or success status
      if (
        (typeof event.data === 'object' && event.data.done1 === true) ||
        (typeof event.data === 'object' && event.data.url?.includes('card_has_been_saved')) ||
        (typeof event.data === 'object' && event.data.status === 'success') ||
        (typeof event.data === 'string' &&
          (event.data.includes('success') || event.data.includes('saved')))
      ) {
        console.log("Success condition met:", event.data);
        handleSuccess();
      }
      // Check for Stripe token creation
      else if (
        typeof event.data === 'object' &&
        event.data.object === 'token' &&
        event.data.id &&
        event.data.id.startsWith('tok_')
      ) {
        console.log("Stripe token created, waiting for completion");
        router.push('/dashboard/settings');
      }
      // Check for failure
      else if (
        (typeof event.data === 'object' && event.data.status === 'failure') ||
        (typeof event.data === 'string' && event.data.includes('fail'))
      ) {
        console.log("Failure condition met:", event.data);
        handleFailure();
      }
    };


    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [shownSuc, router]);

  // Construct URL with token and redirect parameters
  const getUrlToRender = () => {
    if (!token) return "";

    // Add origin for complete URLs and timestamp to prevent caching
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const successUrl = `${origin}/card-payment?card_status=success`;
    const failureUrl = `${origin}/card-payment?card_status=failure`;
    const timestamp = new Date().getTime();

    return `${baseApiUrl}welcome/card_saver?token=${token}&redirect_success=${encodeURIComponent(successUrl)}&redirect_failure=${encodeURIComponent(failureUrl)}&_=${timestamp}`;
  };

  // Manual navigation function
  const navigateToSettings = () => {
    router.push('/dashboard/settings');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-semibold mb-5">Add Your Card Here</h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : token ? (
        <>
          <iframe
            ref={iframeRef}
            src={getUrlToRender()}
            className="w-full max-w-3xl h-96 rounded-lg shadow-md"
            style={{ border: "none", overflow: "auto" }}
            allow="payment *"
          />

          <div className="mt-6">
            <button
              onClick={navigateToSettings}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              {shownSuc ? "Continue to Settings" : " Go to Settings"}
            </button>
          </div>
        </>
      ) : (
        <div className="text-red-600">
          <p>Authentication token not found.</p>
          <p className="mt-2">Please login again or contact support.</p>
        </div>
      )}
    </div>
  );
};

export default Home;