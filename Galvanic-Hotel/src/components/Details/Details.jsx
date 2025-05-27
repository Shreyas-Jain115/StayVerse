import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Table from "./Table";
import ManageEntriesSection from "./ManageEntriesSection"; // Import ManageEntriesSection
import { ManagerContext } from "../../context/ManagerContext"; // Import ManagerContext
import { API_BASE_URL1 } from "../../services/api"; // Import API base URL
const Details = () => {
  const { managerDao, refreshManagerDao } = useContext(ManagerContext); // Add refreshManagerDao
  const [option, setOption] = useState("overview"); // Default option for displaying data
  // Modal state for document viewing
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docImageUrl, setDocImageUrl] = useState(null);
  const [docLoading, setDocLoading] = useState(false);
  const [docError, setDocError] = useState(null);

  const handleOptionChange = (selectedOption) => {
    setOption(selectedOption);
  };

  // Fetch Aadhaar/document image for a user
  const fetchAadhaar = async (userId) => {
    setDocLoading(true);
    setDocError(null);
    setDocImageUrl(null);
    console.log(API_BASE_URL1+"/getDocument");
    console.log(userId);
    try { 
      const response = await axios.get(
        `${API_BASE_URL1}/getDocument`, // <-- Update this to your actual endpoint
        {
          params: { userId },
          responseType: "blob",
          headers: { "ngrok-skip-browser-warning": "true" },
          withCredentials: true,
        }
      );
      const url = URL.createObjectURL(response.data);
      setDocImageUrl(url);
      setDocModalOpen(true);
    } catch (err) {
      setDocError("Failed to fetch document.");
    } finally {
      setDocLoading(false);
    }
  };

  // Clean up blob URL when modal closes
  useEffect(() => {
    return () => {
      if (docImageUrl) URL.revokeObjectURL(docImageUrl);
    };
  }, [docImageUrl]);

  return (
    <div>
      <main className="bg-gray-900 w-full pt-10 pb-10">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Manager Dashboard
              </h1>
              <p className="text-gray-700 dark:text-gray-300">
                Welcome, {managerDao?.user?.name || "Manager"}! Here is an overview of your hotel, rooms, bookings, and payments.
              </p>
            </div>
            <button
              type="button"
              className="ml-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-sm px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-green-400"
              onClick={refreshManagerDao}
              title="Refresh Data"
            >
              Refresh
            </button>
          </div>

          {/* Navigation Buttons */}
          <div className="flex space-x-4 mt-6">
            <button
              type="button"
              className={`flex-1 text-white ${
                option === "overview"
                  ? "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
                  : "bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300"
              } font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 shadow-md`}
              onClick={() => handleOptionChange("overview")}
            >
              Overview
            </button>
            <button
              type="button"
              className={`flex-1 text-white ${
                option === "rooms"
                  ? "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
                  : "bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300"
              } font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 shadow-md`}
              onClick={() => handleOptionChange("rooms")}
            >
              Rooms
            </button>
            <button
              type="button"
              className={`flex-1 text-white ${
                option === "bookings"
                  ? "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
                  : "bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300"
              } font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 shadow-md`}
              onClick={() => handleOptionChange("bookings")}
            >
              Bookings
            </button>
            <button
              type="button"
              className={`flex-1 text-white ${
                option === "payments"
                  ? "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
                  : "bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300"
              } font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 shadow-md`}
              onClick={() => handleOptionChange("payments")}
            >
              Payments
            </button>
          </div>

          {/* Conditional Rendering Based on Selected Option */}
          <div className="mt-6">
            {option === "overview" && (
              <div className="bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Hotel Overview
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Hotel Name:</strong> {managerDao?.hotelDao?.hotel?.name || "N/A"}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Location:</strong> {managerDao?.hotelDao?.hotel?.location || "N/A"}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Description:</strong> {managerDao?.hotelDao?.hotel?.description || "N/A"}
                </p>
              </div>
            )}

            {option === "rooms" && (
              <div className="bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Rooms
                </h2>
                <Table
                  data={managerDao?.roomDaoList?.map((roomDao) => ({
                    roomId: roomDao.room.roomId,
                    roomType: roomDao.room.roomType,
                    pricePerNight: roomDao.room.pricePerNight,
                    capacity: roomDao.room.capacity,
                    availabilityStatus: roomDao.room.availabilityStatus,
                  }))}
                  headers={["Room ID", "Room Type", "Price Per Night", "Capacity", "Availability"]}
                />
              </div>
            )}

            {option === "bookings" && (
              <div className="bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Bookings
                </h2>
                <Table
                  data={managerDao?.bookingList?.map((booking) => ({
                    bookingId: booking.bookingId,
                    userName: booking.user.name,
                    checkInDate: booking.checkInDate,
                    checkOutDate: booking.checkOutDate,
                    bookingStatus: booking.bookingStatus,
                    discount: booking.discount,
                    viewDocument: (
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                        onClick={() => fetchAadhaar(booking.user.userId)}
                        title="View Aadhaar/Document"
                      >
                        View Document
                      </button>
                    ),
                  }))}
                  headers={[
                    "Booking ID",
                    "User Name",
                    "Check-In",
                    "Check-Out",
                    "Status",
                    "Discount",
                    "Document"
                  ]}
                />
              </div>
            )}

            {option === "payments" && (
              <div className="bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Payments
                </h2>
                <Table
                  data={managerDao?.paymentList?.map((payment) => ({
                    paymentId: payment.paymentId,
                    bookingId: payment.booking.bookingId,
                    amount: payment.amount,
                    paymentMethod: payment.paymentMethod,
                    paymentStatus: payment.paymentStatus,
                  }))}
                  headers={["Payment ID", "Booking ID", "Amount", "Method", "Status"]}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Manage Entries Section */}
      <div className="container mx-auto px-6">
        <ManageEntriesSection />
      </div>

      {/* Document Modal */}
      {docModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-700 hover:text-red-600"
              onClick={() => {
                setDocModalOpen(false);
                setDocImageUrl(null);
                setDocError(null);
              }}
              title="Close"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">User Document</h3>
            {docLoading && <div>Loading...</div>}
            {docError && <div className="text-red-600">{docError}</div>}
            {docImageUrl && (
              <img
                src={docImageUrl}
                alt="User Document"
                className="max-w-full max-h-96 border rounded"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Details;