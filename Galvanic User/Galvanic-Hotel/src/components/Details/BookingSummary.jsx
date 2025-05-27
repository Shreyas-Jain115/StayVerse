import React from 'react';

function BookingSummary({ cart, totalPrice, priceAdjustments, handleConfirmBooking }) {
  return (
    <div className="mt-8 p-8 bg-gray-800 rounded-2xl shadow-2xl border-2 border-cyan-600 max-w-xl mx-auto">
      <h2 className="text-2xl font-extrabold text-cyan-400 mb-6">Booking Summary</h2>
      <ul className="mb-6">
        {cart.map((group, index) => (
          <li key={index} className="text-gray-200 flex justify-between items-center text-lg mb-2">
            <span>
              {group.roomType} - ${group.pricePerNight} x {group.quantity}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-gray-200 text-lg mb-2">
        <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
      </p>
      {priceAdjustments !== 0 && (
        <p className={`text-${priceAdjustments < 0 ? 'green' : 'red'}-400 text-lg mb-2`}>
          <strong>{priceAdjustments < 0 ? 'Discount Applied:' : 'Price Increase:'}</strong> ${Math.abs(priceAdjustments).toFixed(2)}
        </p>
      )}
      <button
        onClick={handleConfirmBooking}
        className="block mt-6 text-center text-white bg-cyan-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-cyan-700 transition-all duration-300 w-full shadow-lg"
      >
        Go to Booking
      </button>
    </div>
  );
}

export default BookingSummary;
