import React from "react";
import LeftSidebar from "../../components/Layouts/LeftSideBar";

const SidebarLayout = ({ children }) => {
  return (
    <>
      <div className="flex">
        <LeftSidebar />
        <main className="sm:w-full w-auto">{children}</main>
      </div>
    </>
  );
};

export default SidebarLayout;
