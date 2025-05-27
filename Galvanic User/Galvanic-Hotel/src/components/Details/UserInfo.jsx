import React, { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { HiOutlineCalendar, HiOutlineOfficeBuilding, HiOutlineUser } from "react-icons/hi";
import { QrReader } from "react-qr-reader"; // npm install react-qr-reader
import { API_BASE_URL } from "../../api";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const UserInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userDao,verified } = useContext(UserContext);
  const [showScanner, setShowScanner] = useState(false);
  const [scanError, setScanError] = useState(null);
  const [scanningBooking, setScanningBooking] = useState(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  if(showScanner&&!verified) {
    navigate("/verify-face", {
      state: {
        message: "Please verify your identity before accessing this page.",
      },
    });
    return null;
  }
  if (!userDao) return null;

  // Validate QR code logic (should match QRCodePage logic)
  const validateQr = (qrData) => {
    try {
      const data = JSON.parse(qrData);
      const now = Math.floor(Date.now() / 1000);
      // Accept if timestamp is within 10 seconds
      return Math.abs(now - data.timestamp) < 10;
    } catch {
      return false;
    }
  };

  const handleScan = async (qrData) => {
    if (!qrData) return;
    setScanError(null);

    // Check if checkInDate is today
    const { checkInDate, checkOutDate } = scanningBooking;
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    console.log("Today:", todayStr);
    console.log("Check-in Date:", checkInDate); 
    if (checkInDate !== todayStr) {
      setScanError("Check-in is only allowed on your check-in date.");
      return;
    }

    if (!validateQr(qrData)) {
      setScanError("Invalid or expired QR code. Please try again.");
      return;
    }
    setCheckingIn(true);
    try {
      // Find all bookings with same check-in and check-out as the selected booking
      const bookingsToCheckIn = userDao.bookingList.filter(
        (b) =>
          b.checkInDate === checkInDate &&
          b.checkOutDate === checkOutDate &&
          b.bookingStatus !== "CHECKED_IN"
      );
      // Call check-in API for each
      for (const booking of bookingsToCheckIn) {
        await fetch(
          `${API_BASE_URL}/booking/${booking.bookingId}/checkIn`,
          { method: "PUT" }
        );
      }
      setShowScanner(false);
      setScanError(null);
      QrReader.closeScanner();
    } catch (err) {
      setScanError("Check-in failed. Please try again.");
    } finally {
      setCheckingIn(false);
    }
  };

  const handleQrResult = async (result, error) => {
    if (hasScanned) return;
    if (!!result) {
      setHasScanned(true);
      await handleScan(result?.text);
    }
    if (!!error) {
      // Optionally handle error
    }
  };

  const stopCamera = () => {
    const stream = document.querySelector('video')?.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
    setScanning(false);
  };

  const closeScanner = () => {
    setShowScanner(false);
    setHasScanned(false);
    setScanError(null);
    setCheckingIn(false);
    setScanningBooking(null);
    QrReader.closeScanner();
  };

  // Checkout logic
  const handleCheckout = async (booking) => {
    setCheckoutError(null);
    setCheckoutSuccess(false);
    setCheckingOut(true);
    try {
      // Find all bookings with same check-in and check-out as the selected booking and not already checked out
      const { checkInDate, checkOutDate } = booking;
      const bookingsToCheckOut = userDao.bookingList.filter(
        (b) =>
          b.checkInDate === checkInDate &&
          b.checkOutDate === checkOutDate &&
          b.bookingStatus !== "CHECKED_OUT"
      );
      for (const b of bookingsToCheckOut) {
        await fetch(
          `${API_BASE_URL}/booking/${b.bookingId}/checkOut`,
          { method: "PUT" }
        );
      }
      setCheckoutSuccess(true);
      QrReader.closeScanner();
    } catch (err) {
      setCheckoutError("Check-out failed. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-2xl mb-6 max-w-4xl mx-auto transition-transform hover:scale-[1.01]">
      <h2 className="text-3xl font-extrabold mb-6 text-cyan-700 dark:text-cyan-400 flex items-center gap-2">
        <HiOutlineUser className="text-cyan-600" size={32} />
        User Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {[
          { label: "Name", value: userDao.user.name },
          { label: "Email", value: userDao.user.email },
          { label: "Phone", value: userDao.user.phone },
          { label: "Tier Level", value: userDao.user.tierLevel },
          { label: "Role", value: userDao.user.role },
        ].map((info, index) => (
          <p
            key={index}
            className="text-gray-700 dark:text-gray-200 p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md text-lg"
          >
            <strong>{info.label}:</strong> {info.value}
          </p>
        ))}
      </div>
      <h3 className="text-2xl font-bold mb-6 text-cyan-700 dark:text-cyan-400 flex items-center gap-2">
        <HiOutlineOfficeBuilding className="text-cyan-600" size={28} />
        Bookings
      </h3>
      {userDao.bookingList.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {userDao.bookingList.map((booking) => (
            <li
              key={booking.bookingId}
              className="p-8 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-lg transition hover:bg-cyan-50 dark:hover:bg-gray-700 flex flex-col"
              aria-label={`Booking at ${booking.hotel.name}`}
            >
              <p className="text-gray-700 dark:text-gray-200 mb-2 text-lg">
                <strong>Hotel:</strong> {booking.hotel.name}
              </p>
              <p className="text-gray-700 dark:text-gray-200 mb-2 text-lg">
                <strong>Check-In:</strong> {booking.checkInDate}
              </p>
              <p className="text-gray-700 dark:text-gray-200 mb-2 text-lg">
                <strong>Check-Out:</strong> {booking.checkOutDate}
              </p>
              <p className="text-gray-700 dark:text-gray-200 text-lg">
                <strong>Status:</strong> {booking.bookingStatus}
              </p>
              {/* Check-In Button */}
              {booking.bookingStatus !== "CHECKED_IN" && booking.bookingStatus!=="CHECKED_OUT" && (
                <button
                  className="mt-6 px-6 py-2 bg-cyan-600 text-white rounded-full font-bold text-lg hover:bg-cyan-700 transition-all shadow-md"
                  onClick={() => {
                    setScanningBooking(booking);
                    setShowScanner(true);
                    setScanError(null);
                  }}
                >
                  Check-In
                </button>
              )}
              {/* Check-Out Button */}
              {booking.bookingStatus === "CHECKED_IN" && (
                <button
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full font-bold text-lg hover:bg-green-700 transition-all shadow-md"
                  onClick={async () => {
                    if (
                      window.confirm(
                        "Are you sure you want to check out? This will check out all your bookings for this stay."
                      )
                    ) {
                      await handleCheckout(booking);
                    }
                  }}
                  disabled={checkingOut}
                >
                  {checkingOut ? "Checking Out..." : "Check-Out"}
                </button>
              )}
              {/* Show checkout success/error messages */}
              {checkoutSuccess && (
                <p className="text-green-600 mt-2">Checked out successfully!</p>
              )}
              {checkoutError && (
                <p className="text-red-600 mt-2">{checkoutError}</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <HiOutlineCalendar className="mx-auto mb-4 text-5xl" />
          <p>No bookings found. Start planning your next trip!</p>
        </div>
      )}
      {/* QR Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6 text-cyan-700 dark:text-cyan-400">Scan QR Code to Check-In</h2>
            <div className="w-72 h-72 mb-6">
              <QrReader
                constraints={{ facingMode: "environment" }}
                onResult={handleQrResult}
                style={{ width: "100%" }}
              />
            </div>
            {scanError && <p className="text-red-500 mb-2">{scanError}</p>}
            <button
              className="mt-2 px-6 py-2 bg-gray-400 text-white rounded-full font-bold text-lg hover:bg-gray-500"
              onClick={closeScanner}
              disabled={checkingIn}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
