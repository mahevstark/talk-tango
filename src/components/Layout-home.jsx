import React, { Fragment } from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layouthome = ({ children }) => {
  return (
    <Fragment>
      <div className="">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </Fragment>
  );
};

export default Layouthome;
