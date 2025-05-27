import React, { useState, useContext } from "react";
import { UserContext } from '../../context/UserContext';
import UserInfo from './UserInfo';
import Hotels from "./Hotels";
import AadhaarUpload from "./AadhaarUpload";
import { HiUserCircle, HiBuildingOffice2 } from "react-icons/hi2";
import { HiDocumentText } from "react-icons/hi";

const Details = () => {
  const { refershUserDao } = useContext(UserContext);
  const [activeComponent, setActiveComponent] = useState("UserInfo");

  const renderComponent = () => {
    switch (activeComponent) {
      case "UserInfo":
        return <UserInfo />;
      case "Hotels":
        return <Hotels />;
      case "DocumentUpload":
        return <AadhaarUpload />;
      default:
        return <UserInfo />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white transition-all">
      {/* Sidebar */}
      <aside className="w-64 hidden sm:flex flex-col bg-white dark:bg-gray-800 shadow-md border-r border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-xl font-bold mb-6 text-cyan-700 dark:text-cyan-400">Dashboard</h2>
        <SidebarButton
          label="User Info"
          icon={HiUserCircle}
          active={activeComponent === "UserInfo"}
          onClick={() => setActiveComponent("UserInfo")}
        />
        <SidebarButton
          label="Hotels"
          icon={HiBuildingOffice2}
          active={activeComponent === "Hotels"}
          onClick={() => setActiveComponent("Hotels")}
        />
        <SidebarButton
          label="Document Upload"
          icon={HiDocumentText}
          active={activeComponent === "DocumentUpload"}
          onClick={() => setActiveComponent("DocumentUpload")}
        />
        <button
          onClick={refershUserDao}
          className="mt-auto bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded shadow transition-all duration-200"
        >
          Refresh
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10">
        <h1 className="text-3xl font-bold mb-6 tracking-tight text-cyan-700 dark:text-cyan-400">
          {activeComponent.replace(/([A-Z])/g, " $1").trim()}
        </h1>
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all min-h-[500px]">
          {renderComponent()}
        </div>
      </main>
    </div>
  );
};

export default Details;

// Sidebar Button Component
const SidebarButton = ({ label, icon: Icon, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left text-sm font-medium mb-2 transition-all ${
        active
          ? "bg-cyan-100 dark:bg-cyan-700 text-cyan-900 dark:text-white"
          : "hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      <Icon className="text-cyan-600 dark:text-cyan-300" size={20} />
      {label}
    </button>
  );
};
