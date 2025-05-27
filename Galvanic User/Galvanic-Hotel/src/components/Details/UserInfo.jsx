import React, { useContext, useState } from "react";

import { UserContext } from "../../context/UserContext";

import { HiOutlineCalendar, HiOutlineOfficeBuilding, HiOutlineUser, HiOutlineExclamationCircle, HiOutlineCheckCircle } from "react-icons/hi"; // Added new icons

import { QrReader } from "react-qr-reader";

import { API_BASE_URL } from "../../api";

import { useLocation, useNavigate } from "react-router-dom";

import axios from 'axios'; // Import axios for consistent API calls and error handling

const UserInfo = () => {
    const { userDao, verified } = useContext(UserContext);
    const navigate = useNavigate();
    const [showScanner, setShowScanner] = useState(false);
    const [scanError, setScanError] = useState(null);
    const [scanningBooking, setScanningBooking] = useState(null);
    const [checkingIn, setCheckingIn] = useState(false);
    const [hasScanned, setHasScanned] = useState(false);
    const [checkingOut, setCheckingOut] = useState(false);
    const [checkoutMessage, setCheckoutMessage] = useState(null);

    // Using a more general `axios` configuration for consistency
    const axiosInstance = axios.create({
        headers: {
            "ngrok-skip-browser-warning": "true",
        },
        withCredentials: true, // For handling cookies/sessions
    });

    // Redirect if not verified and trying to access scanner
    if (showScanner && !verified) {
        navigate("/verify-face", {
            state: { message: "Please verify your identity before accessing this feature." },
        });
        return null; // Don't render component content before redirect
    }

    // Don't render if userDao is not available (e.g., still loading or not logged in)
    if (!userDao) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <p className="text-xl text-gray-600 dark:text-gray-300">Loading user data...</p>
            </div>
        );
    }

    const validateQr = (qrData) => {
        try {
            const data = JSON.parse(qrData);
            const now = Math.floor(Date.now() / 1000);
            // QR code is valid for 60 seconds (instead of 10 for more robustness)
            return Math.abs(now - data.timestamp) < 60;
        } catch (e) {
            console.error("QR validation error:", e);
            return false;
        }
    };

    const handleScan = async (qrData) => {
        if (!qrData || checkingIn) return; // Prevent multiple scans/requests
        setScanError(null);
        setCheckingIn(true); // Indicate processing

        if (!scanningBooking) {
            setScanError("No booking selected for check-in.");
            setCheckingIn(false);
            return;
        }

        const { checkInDate } = scanningBooking;
        const todayStr = new Date().toISOString().split("T")[0];

        if (checkInDate !== todayStr) {
            setScanError("Check-in is only allowed on your check-in date.");
            setCheckingIn(false);
            return;
        }

        if (!validateQr(qrData)) {
            setScanError("Invalid or expired QR code. Please try again.");
            setCheckingIn(false);
            return;
        }

        try {
            // Filter only bookings that need to be checked in for the current stay
            const bookingsToCheckIn = userDao.bookingList.filter(
                (b) =>
                    b.checkInDate === scanningBooking.checkInDate &&
                    b.checkOutDate === scanningBooking.checkOutDate &&
                    b.bookingStatus === "CONFIRMED" // Only confirmed bookings can be checked in
            );

            if (bookingsToCheckIn.length === 0) {
                setScanError("No eligible bookings found for check-in with the provided QR code and date.");
                return;
            }

            await Promise.all(
                bookingsToCheckIn.map((booking) =>
                    axiosInstance.put(`${API_BASE_URL}/booking/${booking.bookingId}/checkIn`)
                )
            );

            // Assuming check-in was successful, update the UI or refetch user data
            // For a real app, you'd likely refetch userDao or update the state more carefully
            // For this example, we'll just close the scanner and let the user see their current (possibly outdated) state
            // In a real app, you might re-fetch userDao: useContext(UserContext).fetchUserDao();
            alert("Check-in successful! Your booking status will be updated shortly."); // Simple feedback
            closeScanner();
        } catch (err) {
            console.error("Check-in API error:", err);
            setScanError(err.response?.data?.message || "Check-in failed. Please try again.");
        } finally {
            setCheckingIn(false);
        }
    };

    const handleQrResult = async (result, error) => {
        if (hasScanned || !result?.text) return; // Only process once per scan
        setHasScanned(true); // Set flag to prevent re-processing the same QR code
        await handleScan(result.text);
    };

    const closeScanner = () => {
        setShowScanner(false);
        setHasScanned(false);
        setScanError(null);
        setCheckingIn(false);
        setScanningBooking(null);
    };

    const handleCheckout = async (booking) => {
        setCheckoutMessage(null);
        setCheckingOut(true);
        try {
            // Find all bookings for the same stay (same check-in/out dates)
            const bookingsToCheckOut = userDao.bookingList.filter(
                (b) =>
                    b.checkInDate === booking.checkInDate &&
                    b.checkOutDate === booking.checkOutDate &&
                    b.bookingStatus === "CHECKED_IN" // Only checked-in bookings can be checked out
            );

            if (bookingsToCheckOut.length === 0) {
                setCheckoutMessage({ type: "error", text: "No eligible bookings to check out for this stay." });
                return;
            }

            await Promise.all(
                bookingsToCheckOut.map((b) =>
                    axiosInstance.put(`${API_BASE_URL}/booking/${b.bookingId}/checkOut`)
                )
            );

            setCheckoutMessage({ type: "success", text: "Checked out successfully!" });
            // TODO: Ideally, trigger a refresh of userDao or update local state
        } catch (err) {
            console.error("Check-out API error:", err);
            setCheckoutMessage({ type: "error", text: err.response?.data?.message || "Check-out failed. Please try again." });
        } finally {
            setCheckingOut(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 md:p-12 transition-transform duration-300">
                <h2 className="text-4xl font-extrabold mb-10 text-gray-800 dark:text-gray-100 flex items-center justify-center gap-4">
                    <HiOutlineUser className="text-cyan-600 text-5xl" />
                    My Account
                </h2>

                {/* User Information Section */}
                <section className="mb-12">
                    <h3 className="text-3xl font-bold mb-8 text-cyan-700 dark:text-cyan-400 flex items-center gap-3">
                        <HiOutlineUser className="text-cyan-600" size={32} />
                        Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { label: "Name", value: userDao.user.name },
                            { label: "Email", value: userDao.user.email },
                            { label: "Phone", value: userDao.user.phone },
                            { label: "Tier Level", value: userDao.user.tierLevel },
                            { label: "Role", value: userDao.user.role },
                        ].map((info, i) => (
                            <div
                                key={i}
                                className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition duration-200"
                            >
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">{info.label}:</p>
                                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{info.value}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Bookings Section */}
                <section>
                    <h3 className="text-3xl font-bold mb-8 text-cyan-700 dark:text-cyan-400 flex items-center gap-3">
                        <HiOutlineOfficeBuilding className="text-cyan-600" size={32} />
                        My Bookings
                    </h3>

                    {userDao.bookingList.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 rounded-lg shadow-md">
                                <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Hotel
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Check-In
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Check-Out
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {userDao.bookingList.map((booking) => (
                                        <tr key={booking.bookingId} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {booking.hotel.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                {booking.checkInDate}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                {booking.checkOutDate}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    booking.bookingStatus === "CHECKED_IN"
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                        : booking.bookingStatus === "CHECKED_OUT"
                                                        ? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                                                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                                }`}>
                                                    {booking.bookingStatus.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    {booking.bookingStatus === "CONFIRMED" && (
                                                        <button
                                                            className="px-4 py-2 bg-cyan-600 text-white rounded-md text-sm font-medium hover:bg-cyan-700 transition duration-300 shadow-sm"
                                                            onClick={() => {
                                                                setScanningBooking(booking);
                                                                setShowScanner(true);
                                                            }}
                                                        >
                                                            Check-In
                                                        </button>
                                                    )}
                                                    {booking.bookingStatus === "CHECKED_IN" && (
                                                        <button
                                                            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition duration-300 shadow-sm"
                                                            onClick={() => {
                                                                if (window.confirm("Are you sure you want to check out from this stay?")) {
                                                                    handleCheckout(booking);
                                                                }
                                                            }}
                                                            disabled={checkingOut}
                                                        >
                                                            {checkingOut ? "Checking Out..." : "Check-Out"}
                                                        </button>
                                                    )}
                                                </div>
                                                {checkoutMessage && checkoutMessage.text && (
                                                    <div className={`mt-2 p-2 rounded-md text-xs flex items-center ${
                                                        checkoutMessage.type === "success" ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200" : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                                                    }`}>
                                                        {checkoutMessage.type === "success" ? <HiOutlineCheckCircle className="mr-1" /> : <HiOutlineExclamationCircle className="mr-1" />}
                                                        {checkoutMessage.text}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-inner text-gray-500 dark:text-gray-400">
                            <HiOutlineCalendar className="mx-auto mb-5 text-6xl text-gray-400 dark:text-gray-500" />
                            <p className="text-xl font-medium mb-2">No bookings found.</p>
                            <p className="text-lg">Start planning your next adventure with us!</p>
                        </div>
                    )}
                </section>

                {/* QR Scanner Modal */}
                {showScanner && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-10 text-center w-full max-w-lg animate-fade-in-up">
                            <h2 className="text-3xl font-bold mb-6 text-cyan-700 dark:text-cyan-400">Scan QR Code</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">Align the QR code within the frame.</p>
                            <div className="w-full h-80 sm:h-96 mb-6 rounded-lg overflow-hidden border-4 border-cyan-500 relative flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                                <QrReader
                                    constraints={{ facingMode: "environment" }}
                                    onResult={handleQrResult}
                                    scanDelay={300} // Add a small delay to prevent rapid scans
                                    videoStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                                {/* Optional: Scanner overlay for visual effect */}
                                <div className="absolute inset-0 border-8 border-transparent pointer-events-none" style={{ boxShadow: '0 0 0 1000px rgba(0,0,0,0.6)' }}></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-dashed border-white rounded-lg opacity-70"></div>
                            </div>
                            {scanError && (
                                <p className="text-red-600 dark:text-red-400 mb-4 flex items-center justify-center font-medium">
                                    <HiOutlineExclamationCircle className="mr-2" size={20} />{scanError}
                                </p>
                            )}
                            {checkingIn && (
                                <p className="text-blue-600 dark:text-blue-400 mb-4 flex items-center justify-center font-medium">
                                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></span>
                                    Processing check-in...
                                </p>
                            )}
                            <button
                                className="mt-4 px-8 py-3 bg-gray-500 text-white rounded-full font-bold hover:bg-gray-600 transition duration-300 shadow-md"
                                onClick={closeScanner}
                                disabled={checkingIn}
                            >
                                Close Scanner
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserInfo;