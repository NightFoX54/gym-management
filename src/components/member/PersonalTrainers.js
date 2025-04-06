import React, { useState, useEffect } from 'react';
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
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New state for booking form
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  // Fetch trainers from the backend
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/users/role/TRAINER');
        
        if (!response.ok) {
          throw new Error('Failed to fetch trainers');
        }
        
        const data = await response.json();
        setTrainers(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching trainers:', err);
        setError('Failed to load trainers. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchTrainers();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    console.log("Dark mode toggled to:", !isDarkMode);
  };

  const handleBookSession = (trainer) => {
    setSelectedTrainer(trainer);
    setBookingDate('');
    setBookingTime('');
    setBookingMessage('');
    setShowBookingModal(true);
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setSelectedTrainer(null);
  };

  const handleConfirmBooking = async () => {
    // Validate inputs
    if (!bookingDate || !bookingTime) {
      setBookingMessage('Please select both date and time for your session');
      return;
    }

    try {
      // Get the logged in user data from localStorage
      const userString = localStorage.getItem('user');
      
      if (!userString) {
        setBookingMessage('You must be logged in to book a session');
        return;
      }
      
      // Parse the user object from the JSON string
      const user = JSON.parse(userString);
      const userId = user.id;
      
      if (!userId) {
        setBookingMessage('User ID not found. Please try logging in again.');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/trainer/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` // Include auth token for protected endpoints
        },
        body: JSON.stringify({
          trainerId: selectedTrainer.id,
          clientId: userId,
          requestMessage: "I'd like to book a training session",
          requestedMeetingDate: bookingDate,
          requestedMeetingTime: bookingTime
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to book session');
      }

      setShowBookingModal(false);
      setBookingMessage(`Session request sent to ${selectedTrainer.firstName} ${selectedTrainer.lastName}!`);
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Error booking session:', err);
      setBookingMessage('Failed to book session. Please try again.');
    }
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

      {loading ? (
        <div className="loading-container">
          <p>Loading trainers...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
        </div>
      ) : (
        <div className="trainers-grid-pt">
          {trainers.map((trainer) => (
            <div key={trainer.id} className="trainer-card-pt">
              <div className="trainer-image-pt">
                <img src={trainer.profilePhoto || "https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"} alt={trainer.firstName} />
              </div>
              <div className="trainer-content-pt">
                <h3>{trainer.firstName} {trainer.lastName}</h3>
                <p className="specialization-pt">{trainer.specialization || "Personal Trainer"}</p>
                
                <div className="trainer-details-pt">
                  <div className="detail-item-pt">
                    <FaUserGraduate />
                    <span>{trainer.experience || "Experienced"} trainer</span>
                  </div>
                  <div className="detail-item-pt">
                    <FaStar />
                    <span>{trainer.rating || "4.5"} rating</span>
                  </div>
                  <div className="detail-item-pt">
                    <FaCalendarAlt />
                    <span>{trainer.availability || "Weekdays"}</span>
                  </div>
                </div>

                <div className="certifications-pt">
                  <h4>Bio:</h4>
                  <p className="trainer-description-pt">{trainer.bio || "Professional personal trainer ready to help you achieve your fitness goals."}</p>
                </div>

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
      )}

      {showBookingModal && selectedTrainer && (
        <div className="booking-modal-overlay-pt">
          <div className="booking-modal-pt">
            <button className="close-modal-pt" onClick={handleCloseModal}>
              <FaTimes />
            </button>
            <h2>Book a Session</h2>
            <div className="modal-content-pt">
              <h3>Selected Trainer: {selectedTrainer.firstName} {selectedTrainer.lastName}</h3>
              <p><strong>Specialization:</strong> {selectedTrainer.specialization || "Personal Training"}</p>
              
              {/* Date and time selector */}
              <div className="booking-form-pt">
                <div className="form-group-pt">
                  <label htmlFor="booking-date">Select Date:</label>
                  <input 
                    type="date" 
                    id="booking-date" 
                    className="date-input-pt"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="form-group-pt">
                  <label htmlFor="booking-time">Select Time:</label>
                  <input 
                    type="time" 
                    id="booking-time" 
                    className="time-input-pt"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                  />
                </div>
                
                {bookingMessage && (
                  <p className="booking-error-message">{bookingMessage}</p>
                )}
              </div>
              
              <p className="modal-note-pt">
                The trainer will review your request and contact you to confirm the session.
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