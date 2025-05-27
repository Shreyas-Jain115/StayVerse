import React from 'react';

function RoomGroupCard({ group, cart, handleAddToCart, handleRemoveFromCart }) {
  return (
    <div className="p-8 my-4 bg-gray-800 rounded-2xl shadow-2xl hover:scale-105 hover:shadow-cyan-200 transition-all duration-300 min-h-[420px] flex flex-col items-center">
      <h3 className="text-2xl font-bold text-gray-100 mb-4">{group.roomType || 'N/A'}</h3>
      {group.image && (
        <img
          src={group.image}
          alt={group.roomType}
          className="w-full h-48 object-cover rounded-xl mb-6 shadow-lg"
        />
      )}
      <div className="w-full flex flex-col gap-2 mb-4">
        <p className="text-gray-300 text-lg">
          <strong>Type:</strong> {group.roomType || 'N/A'}
        </p>
        <p className="text-gray-300 text-lg">
          <strong>Price:</strong> ${group.pricePerNight || 'N/A'}
        </p>
        <p className="text-gray-300 text-lg">
          <strong>Capacity:</strong> {group.capacity || 'N/A'} persons
        </p>
        <p className="text-gray-300 text-lg">
          <strong>Available:</strong> {group.quantity} rooms
        </p>
      </div>
      <div className="flex items-center space-x-6 mt-auto">
        <button
          onClick={() => handleRemoveFromCart(group)}
          disabled={!cart.some(
            (cartGroup) =>
              cartGroup.roomType === group.roomType &&
              cartGroup.pricePerNight === group.pricePerNight &&
              cartGroup.capacity === group.capacity
          )}
          className={`px-6 py-2 rounded-full font-bold text-lg transition-all ${
            cart.some(
              (cartGroup) =>
                cartGroup.roomType === group.roomType &&
                cartGroup.pricePerNight === group.pricePerNight &&
                cartGroup.capacity === group.capacity
            )
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-400 text-gray-700 cursor-not-allowed'
          }`}
        >
          -
        </button>
        <button
          onClick={() => handleAddToCart(group)}
          className="px-6 py-2 bg-cyan-600 text-white rounded-full font-bold text-lg hover:bg-cyan-700 transition-all"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default RoomGroupCard;
