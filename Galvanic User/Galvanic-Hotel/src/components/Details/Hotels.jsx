import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HotelDetails from './HotelDetails';
import { API_BASE_URL } from '../../api';

function Hotels() {
    const [error, setError] = useState(null);
    const [hotels, setHotels] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        const fetchHotels = async () => {
            setLoading(true); // Start loading
            setError(null); // Clear previous errors
            try {
                // console.log('API_BASE_URL:', API_BASE_URL + "/hotels"); // Optional: for debugging
                const response = await axios.get(`${API_BASE_URL}/hotels`, {
                    method: 'GET',
                    headers: {
                        "ngrok-skip-browser-warning": "true"
                    },
                    withCredentials: true // Important for handling cookies/sessions
                });

                // Check for HTML response, indicating a backend/tunnel issue
                if (typeof response.data === "string" && response.data.startsWith("<!DOCTYPE html>")) {
                    setError("Backend is not accessible. Make sure your backend/ngrok tunnel is active and correctly configured.");
                    setHotels([]); // Clear hotels on error
                } else {
                    setHotels(Array.isArray(response.data) ? response.data : []);
                    setError(null); // Ensure error is null if successful
                }
            } catch (err) {
                // More detailed error messages
                if (axios.isAxiosError(err)) {
                    if (err.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        setError(err.response.data?.message || `Server responded with an error: ${err.response.status}`);
                    } else if (err.request) {
                        // The request was made but no response was received
                        setError('Network error: Could not connect to the backend. Check your API URL and ngrok tunnel.');
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        setError('Error setting up the request: ' + err.message);
                    }
                } else {
                    setError('An unexpected error occurred: ' + err.message);
                }
                setHotels([]); // Clear hotels on error
                console.error('Error fetching hotels:', err);
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchHotels();
    }, []);

    if (selectedHotel) {
        return <HotelDetails hotelDao={selectedHotel} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Main Heading - Unhide and enhance */}
                <h1 className="text-5xl font-extrabold text-center mb-16 text-gray-800 dark:text-gray-100 tracking-tight drop-shadow-md">
                    Discover Your Perfect Stay
                </h1>

                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500"></div>
                        <p className="ml-4 text-xl text-gray-600 dark:text-gray-300">Loading amazing hotels...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg shadow-md mb-12 flex items-center justify-center text-lg">
                        <svg className="h-6 w-6 mr-3 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                        <p>{error}</p>
                    </div>
                )}

                {!loading && hotels.length === 0 && !error && (
                    <div className="text-center text-gray-600 dark:text-gray-300 text-2xl py-10">
                        <p className="mb-4">No hotels available at the moment.</p>
                        <p>Please check back later or try refreshing the page.</p>
                    </div>
                )}

                {!loading && hotels.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"> {/* Increased gap */}
                        {hotels.map((hotelDao) => {
                            const hotel = hotelDao.hotel;
                            const validImages = (hotelDao.imageList || []).filter(img => img?.img);
                            const displayImage = validImages.length > 0 ? validImages[0].img : 'https://via.placeholder.com/600x400?text=No+Image+Available';

                            return (
                                <div
                                    key={hotel.hotelId}
                                    className="bg-white dark:bg-gray-850 rounded-3xl shadow-xl overflow-hidden
                                               transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl
                                               border border-gray-100 dark:border-gray-700
                                               flex flex-col h-full cursor-pointer" // Added cursor-pointer
                                    onClick={() => setSelectedHotel(hotelDao)} // Made the whole card clickable
                                >
                                    <div className="relative w-full h-56 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                        <img
                                            src={displayImage}
                                            alt={hotel.name}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" // Slower, smoother zoom
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/600x400?text=Image+Load+Error'; }}
                                        />
                                        {/* Optional gradient overlay for better text contrast if text was over image */}
                                        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div> */}
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <h2 className="text-2xl md:text-2xl font-bold text-gray-800 dark:text-gray-50 mb-3 text-center leading-tight">
                                            {hotel.name}
                                        </h2>

                                        <div className="text-center text-gray-600 dark:text-gray-300 text-base space-y-2 mb-4">
                                            <p className="flex items-center justify-center">
                                                <svg className="w-5 h-5 mr-2 text-cyan-500 dark:text-cyan-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                                                <span className="font-semibold">Location:</span> <span className="ml-1">{hotel.location}</span>
                                            </p>
                                            <p className="flex items-center justify-center">
                                                <svg className="w-5 h-5 mr-2 text-cyan-500 dark:text-cyan-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.774a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74A1 1 0 0118 16.847V19a1 1 0 01-1 1H3a1 1 0 01-1-1V3z"></path></svg>
                                                <span className="font-semibold">Contact:</span> <span className="ml-1">{hotel.contactNumber}</span>
                                            </p>
                                        </div>

                                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 flex-grow line-clamp-3 text-center leading-relaxed">
                                            {hotel.description}
                                        </p>

                                        {/* Removed the button, made the whole card clickable */}
                                        {/* You can re-add it if you prefer a separate button */}
                                        {/* <button
                                            onClick={() => setSelectedHotel(hotelDao)}
                                            className="mt-auto mx-auto px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600
                                                       text-white rounded-full font-bold text-lg shadow-lg transition-all duration-300
                                                       focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800"
                                        >
                                            View Details
                                        </button> */}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Hotels;