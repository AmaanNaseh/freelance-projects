import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const token = localStorage.getItem("token");

  return (
    <nav className="sticky top-0 z-20 p-4 px-6 flex items-center justify-between bg-[#0118D8] rounded-b-[32px] text-white font-semibold">
      <Link to={"/"}>
        <h1 className="font-bold text-2xl hover:scale-105 transition-all duration-150">
          Home
        </h1>
      </Link>
      <ul className="list-none inline-flex gap-4 text-sm md:text-lg">
        {!token ? (
          <>
            <Link to={"/login"}>
              <li className="bg-green-500 text-white px-4 py-2 rounded hover:scale-105 hover:bg-green-400 transition-transform duration-100">
                Login
              </li>
            </Link>
            <Link to={"/signup"}>
              <li className="bg-orange-500 text-white px-4 py-2 rounded hover:scale-105 hover:bg-orange-400 transition-transform duration-100">
                Signup
              </li>
            </Link>
          </>
        ) : (
          ""
        )}

        {token ? (
          <>
            <Link
              to={"/profile"}
              className="bg-green-500 text-white px-4 py-2 rounded hover:scale-105 hover:bg-green-400 transition-transform duration-100"
            >
              Profile
            </Link>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:scale-105 hover:bg-red-400 transition-transform duration-100"
            >
              Logout
            </button>
          </>
        ) : (
          ""
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
