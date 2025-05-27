import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { editRoom, addImage, removeImage } from "../../services/api";
import { toast } from "react-toastify";

const EditRoomDetails = ({ rooms }) => {
  const { roomId } = useParams(); // Get roomId from URL params
  const room = rooms.find(({ room }) => room.roomId === parseInt(roomId));
  const [formData, setFormData] = useState({ ...room.room });
  const [image, setImage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Construct the Room object
      const roomData = {
        roomId: parseInt(roomId),
        roomType: formData.roomType,
        pricePerNight: formData.pricePerNight,
        availabilityStatus: formData.availabilityStatus,
        capacity: formData.capacity,
      };

      // Call the editRoom API
      await editRoom(roomData);
      toast.success("Room details updated successfully!");
    } catch (error) {
      toast.error("Failed to update room details!");
    }
  };

  const handleAddImage = async () => {
    try {
      await addImage(roomId, { img: image }); // Pass roomId as a parameter to the API
      toast.success("Image added successfully!");
    } catch (error) {
      toast.error("Failed to add image!");
    }
  };

  const handleRemoveImage = async (imgId) => {
    try {
      await removeImage(roomId, imgId); // Pass roomId and imgId as parameters to the API
      toast.success("Image removed successfully!");
    } catch (error) {
      toast.error("Failed to remove image!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
        Edit Room Details
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Room Type:
          </label>
          <input
            type="text"
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Price Per Night:
          </label>
          <input
            type="number"
            name="pricePerNight"
            value={formData.pricePerNight}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Capacity:
          </label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Availability:
          </label>
          <select
            name="availabilityStatus"
            value={formData.availabilityStatus}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="AVAILABLE">Available</option>
            <option value="BOOKED">Booked</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="NONAVAILABLE">Non-Available</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Save Changes
        </button>
      </form>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Manage Images</h2>
        <div className="flex items-center space-x-4 mb-6">
          <input
            type="text"
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={handleAddImage}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
          >
            Add Image
          </button>
        </div>
        <ul className="grid grid-cols-2 gap-4">
          {room.imageList.map((img) => (
            <li
              key={img.imgId}
              className="relative bg-gray-100 border border-gray-300 rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={img.img}
                alt="Room"
                className="w-full h-32 object-cover"
              />
              <button
                onClick={() => handleRemoveImage(img.imgId)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EditRoomDetails;