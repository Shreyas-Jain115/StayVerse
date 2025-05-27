import React, { useState } from "react";
import AboutHeader from "./AboutHeader";

const About = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleAccordionClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Moved accordionItems here from your first code snippet
  const accordionItems = [
    {
      title: "About CheckinGo",
      content: (
        <>
          <p className="mb-2 text-gray-500 dark:text-gray-400">
            CheckinGo is a cutting-edge hotel management platform designed for modern hospitality needs.
            We empower multiple hotels to register and manage their operations under one smart ecosystem.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Our platform focuses on streamlining operations, enhancing safety, and delivering frictionless travel experiences.
            Whether you're managing a boutique inn or a full-scale resort, CheckinGo is your trusted partner in elevating hospitality through technology.
          </p>
        </>
      ),
    },
    {
      title: "Smart Check-In & Check-Out",
      content: (
        <>
          <p className="mb-2 text-gray-500 dark:text-gray-400">
            CheckinGo revolutionizes the guest experience with AI-powered facial recognition technology
            for secure and seamless self check-in and check-out processes.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            This advanced feature minimizes wait times, eliminates the need for physical keys or cards, and enhances overall guest convenience.
          </p>
        </>
      ),
    },
    {
      title: "Hotel & Guest Dashboard",
      content: (
        <>
          <p className="mb-2 text-gray-500 dark:text-gray-400">
            Our intuitive dashboards provide real-time insights and control for both hotel administrators and guests.
            Hotels can monitor operations, manage bookings, and view analytics, while guests can track their stay, request services, and more.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            The user-friendly interface ensures a smooth digital experience, making management and communication effortless.
          </p>
        </>
      ),
    },
    {
      title: "Secure & Scalable Infrastructure",
      content: (
        <>
          <p className="mb-2 text-gray-500 dark:text-gray-400">
            Security is at the heart of CheckinGo. We ensure data protection through encrypted storage,
            secure facial recognition, and robust authentication mechanisms.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Our platform is scalable to support the evolving needs of hotel chains and individual properties alike.
          </p>
        </>
      ),
    },
    {
      title: "Why Choose CheckinGo?",
      content: (
        <>
          <p className="mb-2 text-gray-500 dark:text-gray-400">
            We bridge the gap between innovation and hospitality with a tech-driven approach.
            From smooth check-ins to real-time management, our system boosts efficiency, guest satisfaction, and business growth.
          </p>
          <p className="text-2ext-gray-500 dark:text-gray-400">
            Join a growing network of hotels transforming the way hospitality works—with CheckinGo, the future of stay starts now.
          </p>
        </>
      ),
    },
  ];

  return (
    <div>
      <AboutHeader />
      <div className="container mx-auto px-4 py-8">
        <div id="accordion-collapse" data-accordion="collapse">
          {accordionItems.map((item, index) => {
            const idx = index + 1; // Use 1-based index for IDs and active state
            const isActive = activeIndex === idx;
            return (
              <div key={idx}> {/* Add a unique key for each mapped item */}
                <h2 id={`accordion-collapse-heading-${idx}`}>
                  <button
                    type="button"
                    className={`flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 gap-3 ${
                      // Apply rounded top only to the first item
                      idx === 1 ? "rounded-t-xl" : ""
                    } ${
                      // Apply rounded bottom only to the last item
                      idx === accordionItems.length ? "rounded-b-xl" : ""
                    } ${
                      // Apply specific border-b-0 to all except the last item
                      idx !== accordionItems.length ? "border-b-0" : ""
                    } ${
                      isActive ? "bg-gray-100 dark:bg-gray-800" : "" // Active state background
                    }`}
                    onClick={() => handleAccordionClick(idx)}
                    aria-expanded={isActive}
                    aria-controls={`accordion-collapse-body-${idx}`}
                  >
                    <span>{item.title}</span> {/* Use item.title */}
                    <svg
                      data-accordion-icon
                      className={`w-3 h-3 transition-transform duration-200 ${isActive ? "rotate-180" : ""}`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5 5 1 1 5"
                      />
                    </svg>
                  </button>
                </h2>
                <div
                  id={`accordion-collapse-body-${idx}`}
                  className={`${isActive ? "block" : "hidden"}`}
                  aria-labelledby={`accordion-collapse-heading-${idx}`}
                >
                  <div className={`p-5 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 ${
                     // Apply border-t-0 to all except the first item's content
                     idx !== 1 ? "border-t-0" : ""
                  }`}>
                    {item.content} {/* Use item.content */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default About;