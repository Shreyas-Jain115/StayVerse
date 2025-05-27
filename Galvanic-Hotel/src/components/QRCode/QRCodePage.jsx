import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";

const QRCodePage = () => {
  const [qrData, setQrData] = useState("");

  const generateQrData = () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const uniqueKey = (timestamp % 10000).toString(16);
    const data = JSON.stringify({ timestamp, uniqueKey });
    setQrData(data);
  };

  useEffect(() => {
    generateQrData();
    const interval = setInterval(generateQrData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Hotel Galvanic
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Scan the QR code below for dynamic information.
        </p>
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg inline-block shadow-md">
          <QRCode value={qrData} size={200} />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          QR Data: {qrData}
        </p>
      </div>
    </div>
  );
};

export default QRCodePage;
