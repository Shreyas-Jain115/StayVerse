import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';
import { API_BASE_URL,API_BASE_URL2} from '../../api';
function Booking() {
  const location = useLocation();
  const { selectedRooms, checkInDate, checkOutDate, totalPrice, priceAdjustments, allRoomIds } = location.state || {};
  const { userDao } = useContext(UserContext);
  const userId = userDao?.user?.userId; // Safely access userId
  const [error, setError] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(false); // Track overall booking status
  const navigate = useNavigate();

  const handleBookAllRooms = async () => {
    if (!userId) {
      setError('User ID is missing. Please log in again.');
      return;
    }

    // --- Check if 5 images uploaded before booking ---
    try {
      // Direct API call without API_BASE_URL
      const res = await fetch(`${API_BASE_URL2}/check_images/${userId}`);
      const data = await res.json();

      if (!data.uploaded) {
        // Redirect to upload-image page with a message
        navigate('/upload-image', {
          state: {
            message: "Please upload 5 images for verification before booking."
          }
        });
        return;
      }
    } catch (err) {
      console.error('Error verifying image upload:', err);
      setError('Could not verify uploaded images. Please try again.');
      return;
    }
    // --- End check ---

    try {
      // Collect all selected roomIds from cart/groups
      const roomIds = allRoomIds && allRoomIds.length > 0
        ? allRoomIds
        : selectedRooms.flatMap((room) => room.roomIds || []);

      if (!roomIds.length) {
        setError('No rooms selected for booking.');
        return;
      }

      // Calculate per-room price (with adjustment if needed)
      let roomIdToPrice = {};
      selectedRooms.forEach((group) => {
        (group.roomIds || []).forEach((id) => {
          let basePrice = group.pricePerNight;
          roomIdToPrice[id] = basePrice;
        });
      });

      // For each roomId, make a separate payment and booking API call
      for (const roomId of roomIds) {
        const payment = {
          paymentMethod: 'CREDIT_CARD',
          amount: roomIdToPrice[roomId] || 0,
          paymentDate: new Date().toISOString(),
          paymentStatus: 'SUCCESS',
        };

        await axios.post(`${API_BASE_URL}/booking`, payment, {
          params: {
            userId,
            roomIds: roomId, // Single roomId per request
            checkInDate,
            checkOutDate,
            discount: 0, // No per-room discount applied here
          },
        });
      }

      setBookingStatus(true);
      setError(null);
    } catch (err) {
      console.error('Failed to book rooms:', err);
      setError('Failed to book one or more rooms. Please try again.');
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-cyan-600 mb-4">Booking Summary</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedRooms.map((room) => (
            <div key={room.roomType} className="p-4 bg-gray-100 rounded-lg shadow-md dark:bg-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-300">{room.roomType}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Price Per Night:</strong> ${room.pricePerNight.toFixed(2)}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Quantity:</strong> {room.quantity}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Total Price:</strong> ${(room.pricePerNight * room.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
          </p>
          {priceAdjustments !== 0 && (
            <p className={`text-${priceAdjustments < 0 ? 'green' : 'red'}-500`}>
              <strong>{priceAdjustments < 0 ? 'Discount Applied:' : 'Price Increase:'}</strong> ${Math.abs(priceAdjustments).toFixed(2)}
            </p>
          )}
        </div>
        <button
          onClick={handleBookAllRooms}
          disabled={bookingStatus}
          className={`mt-4 w-full py-2 px-4 rounded-lg transition-all ${
            bookingStatus
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-cyan-600 text-white hover:bg-cyan-700'
          }`}
        >
          {bookingStatus ? 'All Rooms Booked' : 'Book All Rooms'}
        </button>
      </div>
    </div>
  );
}

export default Booking;


// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useContext } from 'react';
// import { UserContext } from '../../context/UserContext';
// import axios from 'axios';
// import { API_BASE_URL } from '../../api';

// function Booking() {
//   const location = useLocation();
//   const { selectedRooms, checkInDate, checkOutDate, totalPrice, priceAdjustments, allRoomIds } = location.state || {};
//   const { userDao } = useContext(UserContext);
//   const userId = userDao?.user?.userId; // Safely access userId
//   const [error, setError] = useState(null);
//   const [bookingStatus, setBookingStatus] = useState(false); // Track overall booking status
//   const navigate = useNavigate();

//   const handleBookAllRooms = async () => {
//     if (!userId) {
//       setError('User ID is missing. Please log in again.');
//       return;
//     }

//     // --- Check if 5 images uploaded before booking ---
//     try {
//       const res = await axios.get(`https://086dnm7r-5000.inc1.devtunnels.ms/check_images/${userId}`);
//       const data = await res.json();
//       if (!data.uploaded) {
//         // Redirect to upload-image page with a message
//         navigate('/upload-image', {
//           state: {
//             message: "Please upload 5 images for verification before booking."
//           }
//         });
//         return;
//       }
//     } catch (err) {
//       setError('Could not verify uploaded images. Please try again.');
//       return;
//     }
//     // --- End check ---

//     try {
//       // Collect all selected roomIds from cart/groups
//       const roomIds = allRoomIds && allRoomIds.length > 0
//         ? allRoomIds
//         : selectedRooms.flatMap((room) => room.roomIds || []);

//       if (!roomIds.length) {
//         setError('No rooms selected for booking.');
//         return;
//       }

//       // Calculate per-room price (with adjustment if needed)
//       let roomIdToPrice = {};
//       selectedRooms.forEach((group) => {
//         (group.roomIds || []).forEach((id, idx) => {
//           // If priceAdjustments applies, distribute proportionally
//           let basePrice = group.pricePerNight;
//           let adjustedPrice = basePrice;
//           // Optionally, you can distribute priceAdjustments across rooms
//           // For simplicity, apply adjustment only to total, not per-room
//           roomIdToPrice[id] = basePrice;
//         });
//       });

//       // For each roomId, make a separate payment and booking API call
//       for (const roomId of roomIds) {
//         const payment = {
//           paymentMethod: 'CREDIT_CARD',
//           amount: roomIdToPrice[roomId] || 0,
//           paymentDate: new Date().toISOString(),
//           paymentStatus: 'SUCCESS',
//         };

//         await axios.post(`${API_BASE_URL}/booking`, payment, {
//           params: {
//             userId,
//             roomIds: roomId, // Single roomId per request
//             checkInDate,
//             checkOutDate,
//             discount: 0, // No per-room discount applied here
//           },
//         });
//       }

//       setBookingStatus(true);
//       setError(null);
//     } catch (err) {
//       console.error('Failed to book rooms:', err);
//       setError('Failed to book one or more rooms. Please try again.');
//     }
//   };

//   return (
//     <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center">
//       <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full dark:bg-gray-800">
//         <h1 className="text-2xl font-bold text-cyan-600 mb-4">Booking Summary</h1>
//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {selectedRooms.map((room) => (
//             <div key={room.roomType} className="p-4 bg-gray-100 rounded-lg shadow-md dark:bg-gray-700">
//               <h3 className="text-lg font-bold text-gray-800 dark:text-gray-300">{room.roomType}</h3>
//               <p className="text-gray-600 dark:text-gray-400">
//                 <strong>Price Per Night:</strong> ${room.pricePerNight.toFixed(2)}
//               </p>
//               <p className="text-gray-600 dark:text-gray-400">
//                 <strong>Quantity:</strong> {room.quantity}
//               </p>
//               <p className="text-gray-600 dark:text-gray-400">
//                 <strong>Total Price:</strong> ${(room.pricePerNight * room.quantity).toFixed(2)}
//               </p>
//             </div>
//           ))}
//         </div>
//         <div className="mt-6">
//           <p className="text-gray-700 dark:text-gray-300">
//             <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
//           </p>
//           {priceAdjustments !== 0 && (
//             <p className={`text-${priceAdjustments < 0 ? 'green' : 'red'}-500`}>
//               <strong>{priceAdjustments < 0 ? 'Discount Applied:' : 'Price Increase:'}</strong> ${Math.abs(priceAdjustments).toFixed(2)}
//             </p>
//           )}
//         </div>
//         <button
//           onClick={handleBookAllRooms}
//           disabled={bookingStatus}
//           className={`mt-4 w-full py-2 px-4 rounded-lg transition-all ${
//             bookingStatus
//               ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
//               : 'bg-cyan-600 text-white hover:bg-cyan-700'
//           }`}
//         >
//           {bookingStatus ? 'All Rooms Booked' : 'Book All Rooms'}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Booking;
