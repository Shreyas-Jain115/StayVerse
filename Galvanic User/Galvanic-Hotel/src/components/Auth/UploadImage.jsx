import React, { useRef, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { API_BASE_URL2 } from "../../api";
const UploadImage = () => {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [streaming, setStreaming] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { userDao } = useContext(UserContext);
  const uniqueId = userDao.user.userId;
  console.log(uniqueId);

  const location = useLocation();

  // Show redirect message if present
  const redirectMsg = location.state?.message;

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        setStreaming(true);
      } catch (err) {
        setMessage("Cannot access webcam.");
      }
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      // Compress image: use JPEG and lower quality (0.5)
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
      setImage(dataUrl);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreaming(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Uploading...");
    try {
      const res = await fetch(`${API_BASE_URL2}/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, unique_id: uniqueId }),
      });
      const data = await res.json();
      setMessage(data.message || data.error);
    } catch (err) {
      setMessage("Error uploading image.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 400,
        margin: "40px auto",
        padding: 24,
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
      }}
    >
      <h2 style={{ marginBottom: 8, color: "#2d3748" }}>Upload Your Image</h2>
      {redirectMsg && (
        <div style={{
          color: "#e53e3e",
          background: "#fff5f5",
          border: "1px solid #feb2b2",
          borderRadius: 8,
          padding: "8px 12px",
          marginBottom: 10,
          fontWeight: 600,
          textAlign: "center"
        }}>
          {redirectMsg}
        </div>
      )}
      <div style={{ display: "flex", gap: 12 }}>
        {!streaming ? (
          <button
            type="button"
            onClick={startCamera}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: "none",
              background: "#3182ce",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            <span role="img" aria-label="camera">📷</span> Start Webcam
          </button>
        ) : (
          <button
            type="button"
            onClick={stopCamera}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: "none",
              background: "#e53e3e",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            <span role="img" aria-label="stop">🛑</span> Stop Webcam
          </button>
        )}
        {streaming && (
          <button
            type="button"
            onClick={capturePhoto}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: "none",
              background: "#38a169",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            <span role="img" aria-label="capture">📸</span> Capture Photo
          </button>
        )}
      </div>
      <div style={{ width: 320, height: 240, position: "relative", background: "#f7fafc", borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
        <video
          ref={videoRef}
          autoPlay
          style={{
            width: 320,
            height: 240,
            display: streaming ? "block" : "none",
            borderRadius: 8,
            objectFit: "cover",
          }}
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />
        {!streaming && !image && (
          <div style={{
            position: "absolute",
            top: 0, left: 0, width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#a0aec0", fontSize: 18,
          }}>
            Webcam preview
          </div>
        )}
        {image && (
          <img
            src={image}
            alt="Captured"
            style={{
              width: 160,
              marginTop: 10,
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff",
              padding: 4,
            }}
          />
        )}
      </div>

      <button
        type="submit"
        disabled={!image}
        style={{
          padding: "10px 28px",
          borderRadius: 8,
          border: "none",
          background: !image ? "#a0aec0" : "#805ad5",
          color: "#fff",
          fontWeight: 700,
          fontSize: 16,
          cursor: !image ? "not-allowed" : "pointer",
          marginTop: 8,
          transition: "background 0.2s",
        }}
      >
        Upload Image
      </button>
      <div style={{
        minHeight: 24,
        color: message?.toLowerCase().includes("error") ? "#e53e3e" : "#2b6cb0",
        fontWeight: 500,
        marginTop: 8,
        textAlign: "center",
      }}>
        {message}
      </div>
    </form>
  );
};

export default UploadImage;
