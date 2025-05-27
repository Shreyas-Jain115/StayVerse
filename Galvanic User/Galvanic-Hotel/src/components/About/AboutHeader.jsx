import React from "react";

const AboutHeader = () => {
  return (
    <div className="flex flex-col md:flex-row items-center bg-gray-100 dark:bg-gray-800 p-5 rounded-lg mb-6">
      <div className="w-full md:w-1/2 text-gray-800 dark:text-gray-200 md:pr-6">
        <h2 className="text-7xl font-bold mb-4 p-2 font-barlow">
          Welcome to CheckinGo
        </h2>
        <p className="p-4  text-cyan-600">
           Empowering modern hotels with smart management and seamless guest experiences.
        </p>
        <p className="mb-4 pl-4">
         CheckinGo is a cutting-edge hotel management platform designed to streamline operations, 
          enhance safety, and deliver frictionless travel experiences. Whether you're managing a boutique inn or a full-scale resort, 
          our AI-powered facial recognition, intuitive dashboards, and secure infrastructure ensure efficient and convenient stays for your guests. 
          Experience the future of hospitality with CheckinGo, your trusted partner in smart hotel management.
        </p>
      </div>
      <div className="w-full md:w-1/2 flex justify-end p-4 shadow-xl">
        <img
           src= "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg"
          alt="Hotel Galvanic"
          className="rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default AboutHeader;
