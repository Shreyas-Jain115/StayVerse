import React, { useRef, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineCamera, AiOutlineStop, AiOutlineCheckCircle } from "react-icons/ai";
import { MdPhotoCamera } from "react-icons/md";
import { API_BASE_URL2 } from "../../api";
const VerifyFace = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { userDao, setVerified } = useContext(UserContext);
  const uniqueId = userDao.user.userId;

  // --- Start Camera Stream ---
  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        setStreaming(true);
      } catch (err) {
        setResult("Cannot access webcam.");
      }
    }
  };

  // --- Capture Photo ---
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      setImage(dataUrl);
    }
  };

  // --- Stop Camera ---
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreaming(false);
  };

  // --- Handle Submit for Verification ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL2}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, unique_id: uniqueId }),
      });

      const data = await res.json();
      setResult(data.identity_status);
      setLoading(false);

      if (data.identity_status === "Same Face") {
        setVerified(true);
        stopCamera();
        navigate("/customers");
      }
    } catch (err) {
      setResult("Error verifying face.");
      setLoading(false);
    }
  };

  // --- UI Render ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-cyan-600 to-blue-800 text-white">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center text-cyan-600 mb-4">
          Face Verification
        </h2>
        
        <div className="flex items-center justify-center gap-4 mb-4">
          {!streaming ? (
            <button
              onClick={startCamera}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <AiOutlineCamera size={20} />
              Start Webcam
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <AiOutlineStop size={20} />
              Stop Webcam
            </button>
          )}
        </div>

        <div className="relative mb-4">
          <video
            ref={videoRef}
            autoPlay
            className={`w-full rounded-md ${streaming ? "block" : "hidden"}`}
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {streaming && (
          <div className="flex justify-center mb-4">
            <button
              onClick={capturePhoto}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <MdPhotoCamera size={20} />
              Capture Photo
            </button>
          </div>
        )}

        {image && (
          <div className="flex justify-center mb-4">
            <img
              src={image}
              alt="Captured"
              className="rounded-md shadow-lg border border-cyan-500"
              style={{ width: "100%" }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={!image || loading}
          onClick={handleSubmit}
          className={`w-full py-2 px-4 rounded-md transition-all ${
            !image || loading
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-cyan-600 hover:bg-cyan-700 text-white"
          }`}
        >
          {loading ? "Verifying..." : "Verify Face"}
        </button>

        <div className="mt-4 text-center">
          {result && (
            <p
              className={`font-bold ${
                result === "Same Face"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {result}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyFace;
