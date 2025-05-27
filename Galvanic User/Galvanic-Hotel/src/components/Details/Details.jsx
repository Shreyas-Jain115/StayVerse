import React, { useState, useContext } from "react";
import { UserContext } from '../../context/UserContext';
import UserInfo from './UserInfo';
import Hotels from "./Hotels";
import AadhaarUpload from "./AadhaarUpload";
import { HiUserCircle, HiBuildingOffice2 } from "react-icons/hi2";
import { HiDocumentText } from "react-icons/hi";

const Details = () => {
  const { userDao, refershUserDao } = useContext(UserContext);
  const [activeComponent, setActiveComponent] = useState("UserInfo");

  return (
    <div className="bg-gradient-to-br from-cyan-50 via-gray-100 to-cyan-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen flex flex-col items-center py-6 sm:py-12 px-2">
      {/* Header */}
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-cyan-700 dark:text-cyan-400 tracking-tight drop-shadow-lg text-center">
        Dashboard
      </h1>
      {/* Refresh Button */}
      <div className="flex gap-4 mb-6 sm:mb-8">
        <button
          onClick={refershUserDao}
          className="px-6 sm:px-8 py-2 rounded-full bg-cyan-600 text-white font-semibold shadow-lg hover:bg-cyan-700 transition-all text-base sm:text-lg"
        >
          Refresh
        </button>
      </div>
      {/* Toggle Buttons */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-10">
        <button
          onClick={() => setActiveComponent("UserInfo")}
          className={`flex items-center gap-2 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 focus:outline-none shadow-md ${
            activeComponent === "UserInfo"
              ? "bg-cyan-700 text-white scale-105"
              : "bg-white dark:bg-gray-700 text-cyan-700 dark:text-cyan-200 hover:bg-cyan-100 dark:hover:bg-gray-600"
          }`}
        >
          <HiUserCircle size={10} className="sm:size-6" />
          User Info
        </button>
        <button
          onClick={() => setActiveComponent("Hotels")}
          className={`flex items-center gap-2 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 focus:outline-none shadow-md ${
            activeComponent === "Hotels"
              ? "bg-cyan-700 text-white scale-105"
              : "bg-white dark:bg-gray-700 text-cyan-700 dark:text-cyan-200 hover:bg-cyan-100 dark:hover:bg-gray-600"
          }`}
        >
          <HiBuildingOffice2 size={10} className="sm:size-6" />
          Hotels
        </button>
        <button
          onClick={() => setActiveComponent("DocumentUpload")}
          className={`flex items-center gap-2 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 focus:outline-none shadow-md ${
            activeComponent === "DocumentUpload"
              ? "bg-cyan-700 text-white scale-105"
              : "bg-white dark:bg-gray-700 text-cyan-700 dark:text-cyan-200 hover:bg-cyan-100 dark:hover:bg-gray-600"
          }`}
        >
          <HiDocumentText size={10} className="sm:size-6" />
          Document Upload
        </button>
      </div>
      {/* Component Wrapper */}
      <div className="w-full max-w-7xl p-2 sm:p-10 bg-white rounded-2xl sm:rounded-3xl shadow-2xl dark:bg-gray-800 dark:border dark:border-gray-700 transition-all duration-300 min-h-[400px] sm:min-h-[600px]">
        {activeComponent === "UserInfo" ? (
          <UserInfo />
        ) : activeComponent === "Hotels" ? (
          <Hotels />
        ) : (
          <AadhaarUpload />
        )}
      </div>
    </div>
  );
};

export default Details;


