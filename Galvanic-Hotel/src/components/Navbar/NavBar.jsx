// Navbar.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ManagerContext } from "../../context/ManagerContext";

const Navbar = () => {
  const [isNavbarFixed, setIsNavbarFixed] = useState(false);
  const { managerDao, setManagerDao } = useContext(ManagerContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 0 && !isNavbarFixed) {
        setIsNavbarFixed(true);
      } else if (scrollY === 0 && isNavbarFixed) {
        setIsNavbarFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isNavbarFixed]);

  const handleLogout = () => {
    setManagerDao(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav
      className={`${
        isNavbarFixed
          ? "fixed top-0 inset-x-0 bg-gray-800  shadow-xl z-50 transition-all duration-300 ease-in-out text-white"
          : "bg-gray-800 text-white"
      }`}
    >
      <div className="container mx-auto pr-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              className="h-20 p-5"
              src="./src/components/Navbar/logo.png"
              alt="Hotel Galavanic"
            />
            <span className="ml-2 text-lg font-semibold font-barlow">
              Hotel Galavanic
            </span>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <Link
              to="/"
              className={`${
                isNavbarFixed ? "text-white" : "text-gray-500"
              } hover:text-white transition duration-300`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`${
                isNavbarFixed ? "text-white" : "text-gray-500"
              } hover:text-white transition duration-300`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`${
                isNavbarFixed ? "text-white" : "text-gray-500"
              } hover:text-white transition duration-300`}
            >
              Contact
            </Link>
            <Link
              to="/qr-code"
              className={`${
                isNavbarFixed ? "text-white" : "text-gray-500"
              } hover:text-white transition duration-300`}
            >
              QR Code
            </Link>
            {managerDao ? (
              <>
                <Link
                  to="/customers"
                  className={`${
                    isNavbarFixed ? "text-white" : "text-gray-500"
                  } hover:text-white transition duration-300`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition ml-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-cyan-600 px-3 py-1 rounded hover:bg-cyan-700 transition"
              >
                Login
              </button>
            )}
          </div>
          {/* Hamburger menu for mobile view */}
          <div className="md:hidden">
            {/* Replace with your mobile menu toggle button */}
            <button className="text-white hover:text-gray-300">Menu</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
