"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useClerk, useSignIn, useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";

const SocialLogin = () => {
  const [loading, setLoading] = useState(false);
  const { signOut, isLoaded } = useClerk();
  const { signIn } = useSignIn();
  const { user } = useUser();
  const router = useRouter();

  // Function to handle Google sign-in
  const onPressGoogle = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      // Start Google OAuth flow with Clerk
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/auth/login", // Specify the redirect URL after successful authentication
      });
    } catch (err) {
      console.error("OAuth error", err);
      alert({
        type: "error",
        title: "Error",
        message: "Google Sign-In failed.",
      });
    } finally {
      setLoading(false);
    }
  }, [loading, signIn]);

  // This effect runs when the user is authenticated and session is loaded
  useEffect(() => {
    if (isLoaded && user) {
      // Log the authenticated user details
      console.log("Authenticated User:", user);
      console.log("Full Name:", user.fullName);
      console.log("Username:", user.username);

      // Redirect to your desired page after login
      return;
      router.push("/auth/login"); // Redirects user to the login page
    }
  }, [user, isLoaded, router]);

  return (
    <div>
      <button onClick={onPressGoogle} disabled={loading}>
        {loading ? "Signing in..." : "Sign in with Google"}
      </button>

      {/* Show a message or perform logic while session is loading */}
      {!isLoaded && <p>Loading user data...</p>}
    </div>
  );
};

export default SocialLogin;