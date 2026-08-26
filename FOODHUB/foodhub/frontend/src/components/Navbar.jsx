import { Link, useNavigate } from "react-router-dom";
import menuIcon from "../assets/menuIcon.png";
import { useState } from "react";

export default function Navbar() {
  const [isSideNav, setIsSideNav] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login"); // Redirect to login
  };

  return (
    <nav className="sticky top-0 g-secondary p-4 shadow-md flex justify-between items-center bg-[#FFC252] z-20">
      <Link to="/">
        <h1 className="text-sm md:text-lg lg:text-xl font-bold hover:scale-105 transition-transform duration-500">
          FoodHub
        </h1>
      </Link>

      <img
        src={menuIcon}
        className="w-[25px] h-[25px] lg:hidden cursor-pointer"
        alt="..."
        onClick={() => {
          setIsSideNav(!isSideNav);
        }}
      />

      {isSideNav ? (
        <div className="bg-[#FFC252] z-20 fixed top-[57px] right-0 px-8 py-4 pb-20 lg:hidden">
          <ul className="flex flex-col items-center justify-center gap-4 font-semibold">
            {isAdmin ? (
              <>
                <Link to="/dashboard">
                  <li className="hover:scale-105 transition-all duration-300">
                    Dashboard
                  </li>
                </Link>
              </>
            ) : (
              ""
            )}

            {user ? (
              <>
                <Link to="/cart">
                  <li className="hover:scale-105 transition-all duration-300">
                    Cart
                  </li>
                </Link>
                <Link to="/orders">
                  <li className="hover:scale-105 transition-all duration-300">
                    Orders
                  </li>
                </Link>
              </>
            ) : (
              ""
            )}

            {!user ? (
              <>
                <Link to="/login">
                  <li className="hover:scale-105 transition-all duration-300">
                    Login
                  </li>
                </Link>
                <Link to="/signup">
                  <li className="hover:scale-105 transition-all duration-300">
                    Signup
                  </li>
                </Link>
              </>
            ) : (
              <>
                <Link to="/profile">
                  <li className="hover:scale-105 transition-all duration-300">
                    Profile
                  </li>
                </Link>
                <li
                  onClick={handleLogout}
                  className="bg-red-500 text-white py-2 w-fit px-4 rounded hover:scale-105 transition-all duration-300 cursor-pointer font-bold"
                >
                  Logout
                </li>
              </>
            )}
          </ul>
        </div>
      ) : (
        ""
      )}

      <ul className="hidden lg:inline-flex items-center list-none font-semibold gap-4">
        {isAdmin ? (
          <>
            <Link to="/dashboard">
              <li className="hover:scale-105 transition-all duration-300">
                Dashboard
              </li>
            </Link>
          </>
        ) : (
          ""
        )}

        {user ? (
          <>
            <Link to="/cart">
              <li className="hover:scale-105 transition-all duration-300">
                Cart
              </li>
            </Link>
            <Link to="/orders">
              <li className="hover:scale-105 transition-all duration-300">
                Orders
              </li>
            </Link>
          </>
        ) : (
          ""
        )}

        {!user ? (
          <>
            <Link to="/login">
              <li className="hover:scale-105 transition-all duration-300">
                Login
              </li>
            </Link>
            <Link to="/signup">
              <li className="hover:scale-105 transition-all duration-300">
                Signup
              </li>
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile">
              <li className="hover:scale-105 transition-all duration-300">
                Profile
              </li>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 w-fit px-4 rounded hover:scale-105 transition-all duration-300 cursor-pointer font-bold"
            >
              Logout
            </button>
          </>
        )}
      </ul>
    </nav>
  );
}
