import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="w-full mx-auto my-2 flex flex-col items-center justify-center gap-4">
      <Link
        to={"/attributions"}
        className="font-bold hover:scale-105 transition-transform duration-100"
      >
        Attributions
      </Link>
      <p className="text-center">
        @{new Date().getFullYear()} All Rights Reserved
      </p>
    </div>
  );
};

export default Footer;
