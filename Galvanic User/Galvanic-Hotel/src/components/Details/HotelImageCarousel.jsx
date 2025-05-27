import React, { useState } from 'react';

function HotelImageCarousel({ images, hotelName }) {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full max-w-xl h-72 flex items-center justify-center bg-gray-700 rounded-xl text-gray-300 mb-8">
        No images available.
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIdx((prev) =>
      images.length ? (prev + 1) % images.length : 0
    );
  };
  const prevImage = () => {
    setCurrentImageIdx((prev) =>
      images.length ? (prev - 1 + images.length) % images.length : 0
    );
  };

  return (
    <div className="mb-8 flex flex-col items-center">
      <div className="relative w-full max-w-xl">
        <img
          src={images[currentImageIdx].img}
          alt={`Hotel ${hotelName} view`}
          className="w-full h-72 object-cover rounded-xl shadow-lg"
        />
        <button
          onClick={prevImage}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-700 bg-opacity-60 text-white rounded-full p-2 hover:bg-cyan-600 transition-all"
          aria-label="Previous image"
          style={{ zIndex: 2 }}
        >
          &#8592;
        </button>
        <button
          onClick={nextImage}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-700 bg-opacity-60 text-white rounded-full p-2 hover:bg-cyan-600 transition-all"
          aria-label="Next image"
          style={{ zIndex: 2 }}
        >
          &#8594;
        </button>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full ${idx === currentImageIdx ? 'bg-cyan-500' : 'bg-gray-400'}`}
              onClick={() => setCurrentImageIdx(idx)}
              aria-label={`Go to image ${idx + 1}`}
              style={{ outline: 'none', border: 'none' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HotelImageCarousel;
