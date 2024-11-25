import Collaborate from "../components/Home-Flow/Collaborate";
import Featuresection from "../components/Home-Flow/Feature-section";
import Hero from "../components/Home-Flow/hero";
import React from "react";
import MainLayout from "../components/Layout-home";

export default function Home() {
  return (
    <MainLayout>
      <Hero />
      <Collaborate />
      <Featuresection />
    </MainLayout>
  );
}
