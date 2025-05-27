import React, { useState, useEffect } from "react";
import AddRoom from "./AddRoom.jsx";
import EditRoom from "./EditRoom";
import { ManagerContext } from "../../context/ManagerContext.jsx";
import { useContext } from "react";
import axios from "axios";
import { addImageHotel,removeImage,getImageHotel } from "../../services/api.js";


const ManageEntriesSection = () => {
  const { managerDao } = useContext(ManagerContext);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showEditRoom, setShowEditRoom] = useState(false);
  const [showAddImage, setShowAddImage] = useState(false);
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState(""); // Add state for image URL
  const hotelId = managerDao?.hotelDao?.hotel.hotelId; // Adjust according to your data structure
  console.log("hotelId", hotelId);
  // Fetch images on mount or when hotelId changes
  useEffect(() => {
    if (hotelId) {
      getImageHotel(hotelId)
        .then((res) => setImages(res.data.filter((obj)=>obj.img!=null) || []))
        .catch(() => setImages([]));

    }
    
    console.log("images", images);
  }, [hotelId, showAddImage]);

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!imageUrl) return;
    const data = { img: imageUrl }; // send as 'img'
    try {
      await addImageHotel(hotelId, data);
      setShowAddImage(false);
      setImageUrl("");
      // Refresh images
      const res = await getImageHotel(hotelId);
      setImages(res.data?.images || []);
    } catch (err) {
      // Handle error
    }
  };

  const handleRemoveImage = async (imgId) => {
    try {
      await removeImage(imgId); // use imgId
      setImages((prev) => prev.filter((img) => img.imgId !== imgId));
    } catch (err) {
      // Handle error
    }
  };

  return (
    <div className="bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-6 mt-6">
      <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        Manage Entries
      </h2>
      <div className="flex space-x-4 mt-4">
        {/* Add Room Button */}
        <button
          type="button"
          className="flex-1 text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-800 shadow-md"
          onClick={() => {
            setShowAddRoom(!showAddRoom);
            setShowEditRoom(false);
            setShowAddImage(false);
          }}
        >
          Add Room
        </button>

        {/* Edit Room Button */}
        <button
          type="button"
          className="flex-1 text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:focus:ring-yellow-800 shadow-md"
          onClick={() => {
            setShowEditRoom(!showEditRoom);
            setShowAddRoom(false);
            setShowAddImage(false);
          }}
        >
          Edit Room
        </button>

        {/* Add Image Button */}
        <button
          type="button"
          className="flex-1 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 shadow-md"
          onClick={() => {
            setShowAddImage(!showAddImage);
            setShowAddRoom(false);
            setShowEditRoom(false);
          }}
        >
          Add Image
        </button>
      </div>

      {/* Conditional Rendering for Add Room */}
      {showAddRoom && (
        <div className="mt-6">
          <AddRoom />
        </div>
      )}

      {/* Conditional Rendering for Edit Room */}
      {showEditRoom && (
        <div className="mt-6">
          <EditRoom rooms={managerDao.roomDaoList} />
        </div>
      )}

      {/* Conditional Rendering for Add Image */}
      {showAddImage && (
        <div className="mt-6">
          <form onSubmit={handleImageUpload} className="flex flex-col space-y-4">
            <input
              type="url"
              placeholder="Enter image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            />
            <button
              type="submit"
              className="self-start text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 shadow-md"
            >
              Upload Image
            </button>
          </form>
        </div>
      )}
      {console.log("images", images)}
      {/* Display Images */}
      {images.length > 0 && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.imgId} className="relative group">
              <img
                src={img.img}
                alt="Hotel"
                className="w-full h-32 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(img.imgId)} // use img.imgId
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition-opacity"
                title="Delete image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageEntriesSection;