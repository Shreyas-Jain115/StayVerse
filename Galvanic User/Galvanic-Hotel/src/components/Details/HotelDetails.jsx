import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../api';
import HotelImageCarousel from './HotelImageCarousel';
import RoomGroupCard from './RoomGroupCard';
import BookingSummary from './BookingSummary';

function HotelDetails({ hotelDao }) {
  if (!hotelDao || !hotelDao.hotel) {
    return (
      <div className="bg-gray-900 p-8 rounded-3xl shadow-lg text-red-500">
        Invalid hotel data. Please go back and select a hotel.
      </div>
    );
  }
  const hotel = hotelDao.hotel;
  const validImages = (hotelDao.imageList || []).filter(imgObj => imgObj.img);

  const [rooms, setRooms] = useState([]);
  const [groupedRooms, setGroupedRooms] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('all');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [priceAdjustments, setPriceAdjustments] = useState(0);
  const [totalRooms, setTotalRooms] = useState(0);
  const [availableRooms, setAvailableRooms] = useState(0);
  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      const endpoint =
        viewMode === 'all'
          ? `${API_BASE_URL}/hotels/${hotel.hotelId}/rooms`
          : `${API_BASE_URL}/rooms/available?hotelId=${hotel.hotelId}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`;
      if (viewMode === 'available' && (!checkInDate || !checkOutDate)) {
        setError('Please select valid check-in and check-out dates.');
        return;
      }

      const response = await axios.get(endpoint, {
        method: 'GET',
        headers: {
          "ngrok-skip-browser-warning": "true"
        },
        credentials: 'include'
      });

      const availableRoomsData = response.data.filter(
        (roomDao) => roomDao.room.availabilityStatus === 'AVAILABLE'
      );

      if (viewMode === 'all') {
        setTotalRooms(availableRoomsData.length);
      } else {
        setAvailableRooms(availableRoomsData.length);
      }

      setRooms(availableRoomsData);
      groupRooms(availableRoomsData);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch rooms.');
    }
  };

  const groupRooms = (roomsData) => {
    const grouped = roomsData.reduce((acc, roomDao) => {
      const { room } = roomDao;
      const key = `${room.roomType}-${room.pricePerNight}-${room.capacity}`;
      if (!acc[key]) {
        acc[key] = {
          roomType: room.roomType,
          pricePerNight: room.pricePerNight,
          capacity: room.capacity,
          quantity: 0,
          image: roomDao.imageList?.[0]?.img || "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          roomIds: [],
        };
      }
      acc[key].quantity += 1;
      acc[key].roomIds.push(room.roomId);
      return acc;
    }, {});
    setGroupedRooms(Object.values(grouped));
  };

  useEffect(() => {
    fetchRooms();
  }, [viewMode, hotel.hotelId, checkInDate, checkOutDate]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleViewModeChange = (mode) => {
    setRooms([]);
    setGroupedRooms([]);
    setViewMode(mode);
    if (mode === 'all') {
      setCheckInDate('');
      setCheckOutDate('');
    }
  };

  const handleAddToCart = (group) => {
    const existingGroup = cart.find(
      (cartGroup) =>
        cartGroup.roomType === group.roomType &&
        cartGroup.pricePerNight === group.pricePerNight &&
        cartGroup.capacity === group.capacity
    );

    if (existingGroup) {
      const remainingRoomIds = group.roomIds.filter(
        (id) => !existingGroup.roomIds.includes(id)
      );
      if (remainingRoomIds.length > 0) {
        setCart(
          cart.map((cartGroup) =>
            cartGroup === existingGroup && cartGroup.quantity < group.quantity
              ? {
                  ...cartGroup,
                  quantity: cartGroup.quantity + 1,
                  roomIds: [...cartGroup.roomIds, remainingRoomIds[0]],
                }
              : cartGroup
          )
        );
      }
    } else {
      setCart([
        ...cart,
        { ...group, quantity: 1, roomIds: [group.roomIds[0]] },
      ]);
    }
  };

  const handleRemoveFromCart = (group) => {
    const existingGroup = cart.find(
      (cartGroup) =>
        cartGroup.roomType === group.roomType &&
        cartGroup.pricePerNight === group.pricePerNight &&
        cartGroup.capacity === group.capacity
    );

    if (existingGroup.quantity > 1) {
      setCart(
        cart.map((cartGroup) =>
          cartGroup === existingGroup
            ? {
                ...cartGroup,
                quantity: cartGroup.quantity - 1,
                roomIds: cartGroup.roomIds.slice(0, -1),
              }
            : cartGroup
        )
      );
    } else {
      setCart(
        cart.filter(
          (cartGroup) =>
            !(
              cartGroup.roomType === group.roomType &&
              cartGroup.pricePerNight === group.pricePerNight &&
              cartGroup.capacity === group.capacity
            )
        )
      );
    }
  };

  useEffect(() => {
    let total = 0;
    let adjustments = 0;
    cart.forEach((group) => {
      const basePrice = group.pricePerNight;
      const ratio = 1 - availableRooms / totalRooms;

      let adjustedPrice = basePrice;
      if (ratio < 0.25) {
        adjustments -= 0.3 * basePrice * group.quantity;
        adjustedPrice *= 0.7;
      } else if (ratio > 0.5) {
        adjustments += 0.2 * basePrice * group.quantity;
        adjustedPrice *= 1.2;
      }
      total += adjustedPrice * group.quantity;
    });
    setTotalPrice(total);
    setPriceAdjustments(adjustments);
  }, [cart, rooms.length]);

  const handleConfirmBooking = () => {
    if (!checkInDate || !checkOutDate) {
      setError('Please select valid check-in and check-out dates.');
      return;
    }

    navigate('/booking', {
      state: {
        selectedRooms: cart,
        checkInDate,
        checkOutDate,
        totalPrice,
        priceAdjustments,
        allRoomIds: cart.flatMap((g) => g.roomIds),
      },
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-2xl transform transition-transform hover:scale-[1.01] max-w-5xl mx-auto">
      <h1 className="text-3xl font-extrabold text-cyan-700 dark:text-cyan-400 mb-8">Hotel Details</h1>
      <HotelImageCarousel images={validImages} hotelName={hotel.name} />
      <div className="flex flex-wrap gap-6 mb-8">
        <button
          onClick={() => handleViewModeChange('all')}
          className={`px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 shadow-md ${
            viewMode === 'all'
              ? 'bg-cyan-700 text-white scale-105'
              : 'bg-gray-200 dark:bg-gray-700 text-cyan-700 dark:text-cyan-200 hover:bg-cyan-100 dark:hover:bg-gray-600'
          }`}
        >
          View All Rooms
        </button>
        <button
          onClick={() => handleViewModeChange('available')}
          className={`px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 shadow-md ${
            viewMode === 'available'
              ? 'bg-cyan-700 text-white scale-105'
              : 'bg-gray-200 dark:bg-gray-700 text-cyan-700 dark:text-cyan-200 hover:bg-cyan-100 dark:hover:bg-gray-600'
          }`}
        >
          View Available Rooms
        </button>
      </div>
      {viewMode === 'available' && (
        <div className="mb-8 flex flex-col md:flex-row gap-6">
          <label className="block text-gray-700 dark:text-gray-300 text-lg">
            Check-In Date:
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
            />
          </label>
          <label className="block text-gray-700 dark:text-gray-300 text-lg">
            Check-Out Date:
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
            />
          </label>
        </div>
      )}
      {error ? (
        <p className="text-red-500 text-lg">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {groupedRooms.map((group, index) => (
            <RoomGroupCard
              key={index}
              group={group}
              cart={cart}
              handleAddToCart={handleAddToCart}
              handleRemoveFromCart={handleRemoveFromCart}
            />
          ))}
        </div>
      )}
      {cart.length > 0 && (
        <div className="mt-10">
          <BookingSummary
            cart={cart}
            totalPrice={totalPrice}
            priceAdjustments={priceAdjustments}
            handleConfirmBooking={handleConfirmBooking}
          />
        </div>
      )}
    </div>
  );
}

export default HotelDetails;