// Navbar.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const Navbar = () => {
  const [isNavbarFixed, setIsNavbarFixed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userDao, logout } = useContext(UserContext);
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
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const navLinks = (
    <>
      <Link
        to="/"
        className={`block md:inline ${
          isNavbarFixed ? "text-white" : "text-gray-500"
        } hover:text-cyan-400 transition duration-300 py-2 px-4`}
        onClick={() => setMobileMenuOpen(false)}
      >
        Home
      </Link>
      <Link
        to="/about"
        className={`block md:inline ${
          isNavbarFixed ? "text-white" : "text-gray-500"
        } hover:text-cyan-400 transition duration-300 py-2 px-4`}
        onClick={() => setMobileMenuOpen(false)}
      >
        About
      </Link>
      <Link
        to="/contact"
        className={`block md:inline ${
          isNavbarFixed ? "text-white" : "text-gray-500"
        } hover:text-cyan-400 transition duration-300 py-2 px-4`}
        onClick={() => setMobileMenuOpen(false)}
      >
        Contact
      </Link>
      {userDao && (
        <Link
          to="/customers"
          className={`block md:inline ${
            isNavbarFixed ? "text-white" : "text-gray-500"
          } hover:text-cyan-400 transition duration-300 py-2 px-4`}
          onClick={() => setMobileMenuOpen(false)}
        >
          Dashboard
        </Link>
      )}
      {!userDao ? (
        <button
          className="block md:inline ml-0 md:ml-6 w-full md:w-auto px-6 py-2 bg-cyan-600 text-white rounded-full font-semibold hover:bg-cyan-700 transition-all mt-2 md:mt-0"
          onClick={() => {
            setMobileMenuOpen(false);
            navigate("/login");
          }}
        >
          Login
        </button>
      ) : (
        <button
          className="block md:inline ml-0 md:ml-6 w-full md:w-auto px-6 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-all mt-2 md:mt-0"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
    </>
  );

  return (
    <nav
      className={`${
        isNavbarFixed
          ? "fixed top-0 inset-x-0 bg-gray-800 shadow-xl z-50 transition-all duration-300 ease-in-out text-white"
          : "bg-gray-800 text-white"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <img
              className="h-14 w-14 p-2 object-contain"
              src="./src/components/Navbar/logo.png"
              alt="Hotel Galavanic"
            />
            <span className="ml-2 text-lg font-semibold font-barlow whitespace-nowrap">
              CheckinGo
            </span>
          </div>
          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-2 items-center">{navLinks}</div>
          {/* Hamburger menu for mobile view */}
          <div className="md:hidden flex items-center">
            <button
              className="text-white hover:text-cyan-400 focus:outline-none p-2"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-800 rounded-b-xl shadow-lg py-2 flex flex-col items-start z-50">
            {navLinks}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
