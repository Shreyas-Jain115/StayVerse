// Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 px-2 text-center">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div>
          <p className="text-lg font-semibold">Hotel CheckinGo</p>
          <p className="text-sm mt-1">Address: 123 Hotel Street, City, Country</p>
          <p className="text-sm">Phone: +1234567890</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-center gap-2">
          <a
            href="#"
            className="text-white hover:text-cyan-400 transition duration-300 mx-2 text-sm"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-white hover:text-cyan-400 transition duration-300 mx-2 text-sm"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
