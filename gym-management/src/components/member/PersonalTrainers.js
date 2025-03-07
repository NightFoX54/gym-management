import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaSun, 
  FaMoon, 
  FaStar, 
  FaCalendarAlt, 
  FaDumbbell, 
  FaUserGraduate,
  FaTimes,
  FaCheck,
  FaCheckCircle
} from 'react-icons/fa';
import '../../styles/PersonalTrainers.css';

const PersonalTrainers = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');

  const trainers = [
    {
      id: 1,
      name: "John Smith",
      specialization: "Strength & Conditioning",
      experience: "8 years",
      rating: 4.9,
      availability: "Mon-Fri, 8AM-6PM",
      certifications: ["NASM CPT", "CrossFit L2", "Sports Nutrition"],
      image: "https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      description: "Specializing in strength training and athletic performance enhancement."
    },
    {
      id: 2,
      name: "Sarah Johnson",
      specialization: "Weight Loss & HIIT",
      experience: "6 years",
      rating: 4.8,
      availability: "Tue-Sat, 7AM-5PM",
      certifications: ["ACE CPT", "TRX Certified", "Nutrition Coach"],
      image: "https://images.unsplash.com/photo-1609899537878-39d4a5c94e58?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      description: "Expert in high-intensity training and sustainable weight loss programs."
    },
    {
        id: 3,
        name: "Michael Brown",
        specialization: "Strength & Conditioning",
        experience: "10 years",
        rating: 4.9,
        availability: "Mon-Fri, 8AM-6PM",
        certifications: ["NASM CPT", "CrossFit L2", "Sports Nutrition"],
        image: "https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        description: "Specializing in strength training and athletic performance enhancement."
    }
    
    // Add more trainers as needed
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleBookSession = (trainer) => {
    setSelectedTrainer(trainer);
    setShowBookingModal(true);
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setSelectedTrainer(null);
  };

  const handleConfirmBooking = () => {
    setShowBookingModal(false);
    setBookingMessage(`Session request sent to ${selectedTrainer.name}!`);
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSelectedTrainer(null);
    setBookingMessage('');
  };

  return (
    <div className={`trainers-container-pt ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="header-container-pt">
        <div className="header-left">
          <button className="back-button-pt" onClick={() => navigate("/member")}>
            <FaArrowLeft /> Back to Dashboard
          </button>
        </div>
        <h1 className="header-title-pt">Personal Trainers</h1>
        <button
          className={`dark-mode-toggle-trainingplan ${isDarkMode ? "active" : ""}`}
          onClick={toggleDarkMode}
        >
          <FaSun className="toggle-icon-trainingplan sun-trainingplan" />
          <div className="toggle-circle-trainingplan"></div>
          <FaMoon className="toggle-icon-trainingplan moon-trainingplan" />
        </button>
      </div>

      <div className="trainers-grid-pt">
        {trainers.map((trainer) => (
          <div key={trainer.id} className="trainer-card-pt">
            <div className="trainer-image-pt">
              <img src={trainer.image} alt={trainer.name} />
            </div>
            <div className="trainer-content-pt">
              <h3>{trainer.name}</h3>
              <p className="specialization-pt">{trainer.specialization}</p>
              
              <div className="trainer-details-pt">
                <div className="detail-item-pt">
                  <FaUserGraduate />
                  <span>{trainer.experience} experience</span>
                </div>
                <div className="detail-item-pt">
                  <FaStar />
                  <span>{trainer.rating} rating</span>
                </div>
                <div className="detail-item-pt">
                  <FaCalendarAlt />
                  <span>{trainer.availability}</span>
                </div>
              </div>

              <div className="certifications-pt">
                <h4>Certifications:</h4>
                <div className="certification-tags-pt">
                  {trainer.certifications.map((cert, index) => (
                    <span key={index} className="certification-tag-pt">
                      <FaDumbbell /> {cert}
                    </span>
                  ))}
                </div>
              </div>

              <p className="trainer-description-pt">{trainer.description}</p>

              <button 
                className="book-session-button-pt"
                onClick={() => handleBookSession(trainer)}
              >
                Book a Session
              </button>
            </div>
          </div>
        ))}
      </div>

      {showBookingModal && selectedTrainer && (
        <div className="booking-modal-overlay-pt">
          <div className="booking-modal-pt">
            <button className="close-modal-pt" onClick={handleCloseModal}>
              <FaTimes />
            </button>
            <h2>Book a Session</h2>
            <div className="modal-content-pt">
              <h3>Selected Trainer: {selectedTrainer.name}</h3>
              <p><strong>Specialization:</strong> {selectedTrainer.specialization}</p>
              <p><strong>Availability:</strong> {selectedTrainer.availability}</p>
              <p className="modal-note-pt">
                The trainer will contact you to confirm the session details and schedule.
              </p>
            </div>
            <div className="modal-actions-pt">
              <button className="cancel-button-pt" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="confirm-button-pt" onClick={handleConfirmBooking}>
                <FaCheck /> Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="success-modal-overlay-pt">
          <div className="success-modal-pt">
            <FaCheckCircle className="success-icon-pt" />
            <h2>Booking Successful!</h2>
            <p>{bookingMessage}</p>
            <button onClick={handleCloseSuccessModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalTrainers; 