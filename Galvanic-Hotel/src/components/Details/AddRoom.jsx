import React, { useState } from "react";
import { addRoom } from "../../services/api";
import { toast } from "react-toastify";

const AddRoom = ({ onAddRoom }) => {
  const [formData, setFormData] = useState({
    roomType: "",
    pricePerNight: "",
    capacity: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addRoom(formData);
      toast.success("Room added successfully!");
      const newRoom = { id: Date.now(), ...formData };
      onAddRoom(newRoom);
      setFormData({ roomType: "", pricePerNight: "", capacity: "" }); // Reset form
    } catch (error) {
      toast.error("Failed to add room!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Add Room
      </h2>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="roomType"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Room Type
          </label>
          <input
            type="text"
            name="roomType"
            id="roomType"
            placeholder="Enter room type"
            value={formData.roomType}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label
            htmlFor="pricePerNight"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Price Per Night
          </label>
          <input
            type="number"
            name="pricePerNight"
            id="pricePerNight"
            placeholder="Enter price per night"
            value={formData.pricePerNight}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label
            htmlFor="capacity"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Capacity
          </label>
          <input
            type="number"
            name="capacity"
            id="capacity"
            placeholder="Enter capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700"
        >
          Add Room
        </button>
      </div>
    </form>
  );
};

export default AddRoom;