import React, { useState, useEffect, useCallback } from 'react';
import '../styles/ImageCarousel.css';

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    '/1.jpg',
    '/2.jpg',
    '/3.jpg',
    '/4.jpg',
    '/5.jpg'
  ];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  useEffect(() => {
    // Clear any existing timer when currentIndex changes
    const timer = setInterval(nextSlide, 5000);
    
    // Cleanup function to clear the timer
    return () => clearInterval(timer);
  }, [currentIndex, nextSlide]); // Reset timer when currentIndex changes

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    // Timer will automatically reset due to the useEffect dependency on currentIndex
  };

  return (
    <div className="carousel-container">
      <div className="carousel-slides">
        {images.map((image, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>
      <div className="carousel-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
