"use client";
import Collaborate from "../components/Home-Flow/Collaborate";
import Featuresection from "../components/Home-Flow/Feature-section";
import Hero from "../components/Home-Flow/hero";
import React from "react";
import MainLayout from "../components/Layout-home";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.push("/dashboard/messages");
    }
  }, [router]);

  return (
    <MainLayout>
      <Hero />
      <Collaborate />
      <Featuresection />
    </MainLayout>
  );
}
