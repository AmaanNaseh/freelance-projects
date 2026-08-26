import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="sticky bottom-0 left-0 w-full bg-[#00712d] flex flex-col gap-4 items-center justify-evenly py-4">
      <ul className="inline-flex gap-4 flex-wrap text-white font-semibold my-2 mb-8">
        <Link to={"/about"}>
          <li>About</li>
        </Link>

        <a
          href="https://github.com/FaizaQ27/careconnect"
          target="_blank"
          rel="noreferrer"
        >
          <li>GitHub Repo</li>
        </a>
      </ul>
      <p className="text-center text-white mb-2">
        @{new Date().getFullYear()} All rights reserved
      </p>
    </footer>
  );
};

export default Footer;
