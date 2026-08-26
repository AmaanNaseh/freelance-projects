import React, { useState } from "react";
import logo from "../assets/Prediction.png";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
  const [isSideNavActive, setIsSideNavActive] = useState(false);
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <nav className="sticky top-0 z-20 bg-[#9EDF9C] flex items-center justify-between px-4 py-3">
      <Link to={"/"}>
        <div className="flex gap-4 items-center justify-center hover:scale-105">
          <div className="w-[50px]">
            <img src={logo} alt="logo" className="w-full" />
          </div>
          <h1 className="text-lg md:text-2xl font-bold">CareConnect</h1>
        </div>
      </Link>
      <ul className="hidden lg:inline-flex gap-4 items-center justify-center ml-8">
        <Link to={"/login"}>
          <li className="p-2 rounded-[7px] min-w-[95px] text-center hover:scale-105 bg-green-700 hover:bg-green-600 text-white font-bold text-xl md:text-2xl">
            Login
          </li>
        </Link>
        <Link to={"/signup"}>
          <li className="p-2 rounded-[7px] hover:scale-105 bg-green-700 hover:bg-green-600 text-white font-bold text-xl md:text-2xl">
            Signup
          </li>
        </Link>
        {isLoggedIn && (
          <Link to="/profile">
            <li className="p-2 rounded-[7px] hover:scale-105 bg-green-700 hover:bg-green-600 text-white font-bold text-xl md:text-2xl">
              Profile
            </li>
          </Link>
        )}
      </ul>
      <GiHamburgerMenu
        className="lg:hidden text-3xl cursor-pointer"
        onClick={() => {
          setIsSideNavActive(!isSideNavActive);
        }}
      />
      {isSideNavActive ? (
        <div className="lg:hidden fixed top-[70px] z-20 right-0 bottom-0 px-8 py-4 bg-[#9EDF9C]">
          <ul className="flex flex-col gap-4 items-center justify-center">
            <Link to={"/login"}>
              <li className="p-2 rounded-[7px] min-w-[68px] text-center hover:scale-105 bg-green-700 hover:bg-green-600 text-white font-bold text-md">
                Login
              </li>
            </Link>
            <Link to={"/signup"}>
              <li className="p-2 rounded-[7px] min-w-[68px] text-center hover:scale-105 bg-green-700 hover:bg-green-600 text-white font-bold text-md">
                Signup
              </li>
            </Link>
            {isLoggedIn && (
              <Link to="/profile">
                <li className="p-2 rounded-[7px] min-w-[68px] text-center hover:scale-105 bg-green-700 hover:bg-green-600 text-white font-bold text-md">
                  Profile
                </li>
              </Link>
            )}
          </ul>
        </div>
      ) : (
        ""
      )}
    </nav>
  );
};

export default Navbar;
