import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HotelDetails from './HotelDetails';
import { API_BASE_URL } from '../../api';

function Hotels() {
  const [error, setError] = useState(null);
  const [hotels, setHotels] = useState([]); // Store all hotels
  const [selectedHotel, setSelectedHotel] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        console.log('API_BASE_URL:', API_BASE_URL + "/hotels");
        const response = await axios.get(`${API_BASE_URL}/hotels`, {
          method: 'GET',
          headers: {
            "ngrok-skip-browser-warning": "true"
          },
          credentials: 'include'
        });
        console.log('Hotels response:', response.data);
        if (
          typeof response.data === "string" &&
          response.data.startsWith("<!DOCTYPE html>")
        ) {
          setError("API is returning an HTML error page. This usually means your backend is NOT accessible from the browser. This can happen if:\n- Your backend is not running\n- Your ngrok tunnel is not active or expired\n- Your backend is not accessible from the public internet\n- You are using the wrong ngrok URL\n\nNote: curl works because it runs from your machine, but the browser must reach the backend from the internet. Try opening the API URL directly in your browser. If you see an ngrok error page, the problem is with your backend/tunnel, not your React code.");
          return;
        }
        setHotels(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        if (err.response) {
          setError(err.response?.data?.message || 'Failed to load hotels. Please try again later.');
        } else if (err.request) {
          setError('Network error: Could not reach the backend. Check your API URL and ngrok tunnel.');
        } else {
          setError('Unknown error occurred.');
        }
        console.error('Error fetching hotels:', err);
      }
    };

    fetchHotels();
  }, []);

  if (selectedHotel) {
    console.log('Selected hotel:', selectedHotel);
    return <HotelDetails hotelDao={selectedHotel} />; // Pass only hotel object as before
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-10 text-cyan-700 dark:text-cyan-400 tracking-tight drop-shadow-lg">Hotels</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {hotels.map((hotelDao, idx) => {
          // Filter out images with null img property
          const validImages = (hotelDao.imageList || []).filter(imgObj => imgObj.img);
          return (
            <div
              key={hotelDao.hotel.hotelId}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center hover:scale-105 hover:shadow-cyan-200 dark:hover:shadow-cyan-900 transition-all duration-300 min-h-[420px] w-full"
              style={{ minWidth: 340, maxWidth: 420 }}
            >
              {validImages.length > 0 && (
                <img
                  src={validImages[0].img}
                  alt={hotelDao.hotel.name}
                  className="w-full h-56 object-cover rounded-xl mb-6 shadow-lg"
                />
              )}
              <h2 className="text-2xl font-bold text-cyan-700 mb-2">{hotelDao.hotel.name}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-1 text-lg">
                <strong>Location:</strong> {hotelDao.hotel.location}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-1 text-lg">
                <strong>Contact:</strong> {hotelDao.hotel.contactNumber}
              </p>
              <p className="text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 text-base">
                {hotelDao.hotel.description}
              </p>
              <button
                className="mt-auto px-6 py-2 bg-cyan-600 text-white rounded-full font-semibold text-lg hover:bg-cyan-700 shadow-md transition-all"
                onClick={() => setSelectedHotel(hotelDao)}
              >
                View Details
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Hotels;
