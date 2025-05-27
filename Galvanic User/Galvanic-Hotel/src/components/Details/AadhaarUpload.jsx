import React, { useState, useContext } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression"; // Import the library
import { UserContext } from "../../context/UserContext";
import { API_BASE_URL } from "../../api";

const AadhaarUpload = () => {
  const { userDao } = useContext(UserContext);
  const userId = userDao.user.userId;
  const [file, setFile] = useState(null);
  const [uploadedImg, setUploadedImg] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "image/jpeg") {
      setFile(selectedFile);
    } else {
      setError("Please upload a valid .jpg file.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("No file selected. Please upload a .jpg file.");
      return;
    }

    try {
      // Compress the image
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.5, // Set maximum size to 0.5 MB
        maxWidthOrHeight: 1024, // Set maximum width or height
        useWebWorker: true,
      });

      // Prepare form data
      const formData = new FormData();      formData.append("userId", userDao.user.userId); // Add userId as a form field
      formData.append("file", compressedFile); // Add the compressed file

      // Send the file to the backend
      await axios.post(`${API_BASE_URL}/addOrUpdate`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Aadhaar uploaded successfully!");
      setError(null);
    } catch (err) {
      setError("Failed to upload Aadhaar. Please try again.");
    }
  };

  const fetchAadhaar = async () => {
    try {
      console.log(API_BASE_URL+"/getDocument");
      const response = await axios.get(`${API_BASE_URL}/getDocument`, {
            params: { userId: userDao.user.userId },
            responseType: "blob", // Expect a Blob response (for PDFs, images, etc.)
            headers: {
                "ngrok-skip-browser-warning": "true"
            },
            withCredentials: true // This handles `credentials: 'include'`
      });

      // Create an object URL for the Blob
      const objectUrl = URL.createObjectURL(response.data);
      setUploadedImg(objectUrl);
      setError(null);
    } catch (err) {
      setError("Failed to fetch Aadhaar. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-cyan-600 mb-4">Aadhaar Upload</h2>
      <input
        type="file"
        accept=".jpg,.jpeg" // Allow both .jpg and .jpeg files
        onChange={handleFileChange}
        className="w-full px-4 py-2 mb-4 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg"
      />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
      >
        Upload Aadhaar
      </button>
      <button
        onClick={fetchAadhaar}
        className="ml-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
      >
        View Aadhaar
      </button>
      {uploadedImg && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-300">Uploaded Aadhaar:</h3>
          <img src={uploadedImg} alt="Aadhaar" className="mt-2 rounded-lg" />
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default AadhaarUpload;
