import React from "react";
import LeftSidebar from "../../components/Layouts/LeftSideBar";

const SidebarLayout = ({ children }) => {
  return (
    <div className="flex">

      <div className="sm:ml-28">
        <LeftSidebar />
      </div>

      <main className="flex justify-between w-full h-auto sm:h-[100vh] pb-5  z-1">{children}</main>
    </div>
  );
};

export default SidebarLayout;
