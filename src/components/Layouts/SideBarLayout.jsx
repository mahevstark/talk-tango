import React from "react";
import LeftSidebar from "../../components/Layouts/LeftSideBar";

const SidebarLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <div className="sm:ml-28">
        <LeftSidebar />
      </div>

      {/* Main content area */}
      <main className="flex-1  p-4">{children}</main>
    </div>
  );
};

export default SidebarLayout;
