import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="sticky bottom-0 left-0 rounded-t-[40px] w-[80%] mx-auto bg-[#5985B3] flex flex-col gap-4 items-center justify-evenly py-4">
      <ul className="inline-flex gap-4 md:gap-8 lg:gap-10 flex-wrap font-semibold my-2">
        <Link to={"/attributions"}>
          <li className="hover:scale-105 transition-all duration-150">
            Attributions
          </li>
        </Link>
        <a
          href="https://github.com/Hamza27-code/cybershield"
          target="_blank"
          rel="noreferrer"
        >
          <li className="hover:scale-105 transition-all duration-150">
            GitHub Repo
          </li>
        </a>
      </ul>
      <p className="text-center">
        @{new Date().getFullYear()} All rights reserved
      </p>
    </footer>
  );
};

export default Footer;
