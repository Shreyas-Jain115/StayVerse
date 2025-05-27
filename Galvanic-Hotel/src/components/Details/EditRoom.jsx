import React from "react";
import { useNavigate } from "react-router-dom";

const EditRoom = ({ rooms }) => {
  const navigate = useNavigate();

  const handleRoomClick = (roomId) => {
    navigate(`/edit-room/${roomId}`);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Edit Room</h2>
      <ul className="space-y-4">
        {rooms && rooms.length > 0 ? (
          rooms.map(({ room }) => (
            <li
              key={room.roomId}
              onClick={() => handleRoomClick(room.roomId)}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-shadow"
            >
              <p className="text-lg font-semibold text-gray-800">Room Type: {room.roomType}</p>
              <p className="text-gray-600">Price: ${room.pricePerNight}</p>
              <p className="text-gray-600">Capacity: {room.capacity}</p>
              <p className="text-gray-600">
                Availability:{" "}
                <span
                  className={`font-medium ${
                    room.availabilityStatus === "AVAILABLE"
                      ? "text-green-600"
                      : room.availabilityStatus === "BOOKED"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {room.availabilityStatus}
                </span>
              </p>
            </li>
          ))
        ) : (
          <li className="text-center text-gray-500">No rooms available</li>
        )}
      </ul>
    </div>
  );
};

export default EditRoom;

