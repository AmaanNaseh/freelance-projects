import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isSideNavActive, setIsSideNavActive] = useState(false);

  return (
    <nav className="sticky top-1 left-0 rounded-full mx-1 lg:mx-10 bg-[#94B4C1] p-4 z-20 text-black flex items-center justify-between">
      <Link to={"/"}>
        <h1 className="text-2xl font-bold flex gap-2 items-center italic hover:scale-105 transition-all duration-300">
          <img src={logo} alt="logo" />
          Risk Analytics System
        </h1>
      </Link>
      <ul className="hidden lg:inline-flex gap-4">
        <Link to={"/login"}>
          <li className="p-2 rounded-[7px] min-w-[68px] text-center hover:scale-105 bg-[#547792] hover:bg-[#547792]/75 text-white font-bold text-md">
            Login
          </li>
        </Link>
        <Link to={"/signup"}>
          <li className="p-2 rounded-[7px] min-w-[68px] text-center hover:scale-105 bg-[#547792] hover:bg-[#547792]/75 text-white font-bold text-md">
            Signup
          </li>
        </Link>
        <Link to={"/profile"}>
          <li className="p-2 rounded-[7px] min-w-[68px] text-center hover:scale-105 bg-[#547792] hover:bg-[#547792]/75 text-white font-bold text-md">
            Profile
          </li>
        </Link>
      </ul>
      <GiHamburgerMenu
        className="lg:hidden text-3xl cursor-pointer"
        onClick={() => {
          setIsSideNavActive(!isSideNavActive);
        }}
      />
      {isSideNavActive ? (
        <div className="lg:hidden fixed top-[68px] z-20 right-2 px-8 py-10 bg-[#94B4C1]">
          <ul className="flex flex-col gap-4 items-center justify-center">
            <Link to={"/login"}>
              <li className="p-2 rounded-[7px] min-w-[68px] text-center hover:scale-105 bg-[#547792] hover:bg-[#547792]/75 text-white font-bold text-md">
                Login
              </li>
            </Link>
            <Link to={"/signup"}>
              <li className="p-2 rounded-[7px] min-w-[68px] text-center hover:scale-105 bg-[#547792] hover:bg-[#547792]/75 text-white font-bold text-md">
                Signup
              </li>
            </Link>
            <Link to={"/profile"}>
              <li className="p-2 rounded-[7px] min-w-[68px] text-center hover:scale-105 bg-[#547792] hover:bg-[#547792]/75 text-white font-bold text-md">
                Profile
              </li>
            </Link>
          </ul>
        </div>
      ) : (
        ""
      )}
    </nav>
  );
};

export default Navbar;
