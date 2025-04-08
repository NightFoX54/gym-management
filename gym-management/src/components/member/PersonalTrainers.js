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
  FaCheckCircle,
  FaCalendarCheck,
  FaCalendarDay,
  FaHistory,
  FaClock,
  FaExchangeAlt,
  FaComments,
  FaSpinner,
  FaUsers,
  FaUserFriends
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
  
  // Tab system and my trainers state
  const [activeTab, setActiveTab] = useState('allTrainers');
  const [myTrainers, setMyTrainers] = useState([]);
  const [loadingMyTrainers, setLoadingMyTrainers] = useState(false);
  
  // Rating modal state
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [sessionToRate, setSessionToRate] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  
  // Reschedule modal state
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [sessionToReschedule, setSessionToReschedule] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleMessage, setRescheduleMessage] = useState('');

  // Get the logged in user data from localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : {};
  const userId = user.id;

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
  
  // Fetch my trainers when "My Trainers" tab is active
  useEffect(() => {
    if (activeTab === 'myTrainers' && userId) {
      fetchMyTrainers();
    }
  }, [activeTab, userId]);
  
  const fetchMyTrainers = async () => {
    if (!userId) return;
    
    try {
      setLoadingMyTrainers(true);
      const response = await fetch(`http://localhost:8080/api/member-trainers/${userId}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch your trainers');
      }
      
      const data = await response.json();
      setMyTrainers(data);
      setLoadingMyTrainers(false);
    } catch (err) {
      console.error('Error fetching your trainers:', err);
      setLoadingMyTrainers(false);
    }
  };

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
      if (!userString) {
        setBookingMessage('You must be logged in to book a session');
        return;
      }
      
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
  
  // Handle rating a session
  const handleOpenRatingModal = (session) => {
    setSessionToRate(session);
    setRatingValue(session.rating || 0);
    setRatingComment(session.comment || '');
    setShowRatingModal(true);
  };
  
  // Handle submitting a rating
  const handleRatingSubmit = async () => {
    if (!sessionToRate || !userId) return;
    
    try {
      const response = await fetch('http://localhost:8080/api/training-ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          memberId: userId,
          sessionId: sessionToRate.id,
          rating: ratingValue,
          comment: ratingComment
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }
      
      // Update local state to reflect the new rating
      const updatedMyTrainers = myTrainers.map(trainer => {
        const updatedPastSessions = trainer.pastSessions.map(session => {
          if (session.id === sessionToRate.id) {
            return { 
              ...session, 
              hasRating: true,
              rating: ratingValue,
              comment: ratingComment
            };
          }
          return session;
        });
        
        return {
          ...trainer,
          pastSessions: updatedPastSessions
        };
      });
      
      setMyTrainers(updatedMyTrainers);
      setShowRatingModal(false);
      setSessionToRate(null);
    } catch (err) {
      console.error('Error submitting rating:', err);
    }
  };
  
  // Handle opening the reschedule modal
  const handleOpenRescheduleModal = (session) => {
    setSessionToReschedule(session);
    // Initialize with current values
    setRescheduleDate(session.date);
    setRescheduleTime(session.time);
    setRescheduleMessage('');
    setShowRescheduleModal(true);
  };
  
  // Handle reschedule submission
  const handleRescheduleSubmit = async () => {
    if (!sessionToReschedule || !rescheduleDate || !rescheduleTime) {
      setRescheduleMessage('Please select both date and time');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8080/api/member-trainers/reschedule/${sessionToReschedule.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          date: rescheduleDate,
          time: rescheduleTime
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to reschedule session');
      }
      
      const result = await response.json();
      
      // Update the local state to reflect the change
      const updatedMyTrainers = myTrainers.map(trainer => {
        const updatedUpcomingSessions = trainer.upcomingSessions.map(session => {
          if (session.id === sessionToReschedule.id) {
            return { 
              ...session, 
              date: rescheduleDate,
              time: rescheduleTime
            };
          }
          return session;
        });
        
        return {
          ...trainer,
          upcomingSessions: updatedUpcomingSessions
        };
      });
      
      setMyTrainers(updatedMyTrainers);
      setShowRescheduleModal(false);
      setSessionToReschedule(null);
    } catch (err) {
      console.error('Error rescheduling session:', err);
      setRescheduleMessage('Failed to reschedule session. Please try again.');
    }
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
      
      {/* Tab Navigation */}
      <div className="tabs-container-member-mypt">
        <button 
          className={`tab-button-member-mypt ${activeTab === 'allTrainers' ? 'active' : ''}`} 
          onClick={() => setActiveTab('allTrainers')}
        >
          <FaUsers /> All Trainers
        </button>
        <button 
          className={`tab-button-member-mypt ${activeTab === 'myTrainers' ? 'active' : ''}`} 
          onClick={() => setActiveTab('myTrainers')}
        >
          <FaUserFriends /> My Trainers
        </button>
      </div>

      {/* All Trainers Tab Content */}
      {activeTab === 'allTrainers' && (
        <>
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
        </>
      )}
      
      {/* My Trainers Tab Content */}
      {activeTab === 'myTrainers' && (
        <div className="my-trainers-container-member-mypt">
          {loadingMyTrainers ? (
            <div className="loading-container-member-mypt">
              <FaSpinner className="spinner-member-mypt" />
              <p>Loading your trainers...</p>
            </div>
          ) : myTrainers.length === 0 ? (
            <div className="no-trainers-message-member-mypt">
              <h3>You don't have any trainers yet</h3>
              <p>Book a session with one of our qualified trainers to get started!</p>
              <button 
                className="view-trainers-button-member-mypt"
                onClick={() => setActiveTab('allTrainers')}
              >
                View Available Trainers
              </button>
            </div>
          ) : (
            <div className="trainers-list-member-mypt">
              {myTrainers.map((trainer) => (
                <div className="trainer-card-member-mypt" key={trainer.id}>
                  <div className="trainer-header-member-mypt">
                    <div className="trainer-profile-member-mypt">
                      <img 
                        src={trainer.profilePhoto || "https://via.placeholder.com/150"}
                        alt={`${trainer.firstName} ${trainer.lastName}`}
                        className="trainer-photo-member-mypt"
                      />
                      <div className="trainer-info-member-mypt">
                        <h3>{trainer.firstName} {trainer.lastName}</h3>
                        <p><FaCalendarCheck /> <strong>Remaining Sessions:</strong> {trainer.remainingSessions}</p>
                        <p><FaUserGraduate /> <strong>Specialization:</strong> {trainer.specialization || "General Fitness"}</p>
                      </div>
                    </div>
                    <button 
                      className="book-more-button-member-mypt"
                      onClick={() => handleBookSession({
                        id: trainer.id,
                        firstName: trainer.firstName,
                        lastName: trainer.lastName
                      })}
                    >
                      <FaCalendarAlt /> Book More Sessions
                    </button>
                  </div>
                  
                  {/* Upcoming Sessions */}
                  <div className="sessions-section-member-mypt">
                    <h4><FaCalendarDay /> Upcoming Sessions</h4>
                    {trainer.upcomingSessions && trainer.upcomingSessions.length > 0 ? (
                      <div className="sessions-list-member-mypt">
                        {trainer.upcomingSessions.map(session => (
                          <div className="session-card-member-mypt" key={session.id}>
                            <div className="session-info-member-mypt">
                              <p><FaCalendarAlt /> <strong>Date:</strong> {session.date}</p>
                              <p><FaClock /> <strong>Time:</strong> {session.time}</p>
                              <p><FaDumbbell /> <strong>Type:</strong> {session.type || "Training Session"}</p>
                            </div>
                            <button 
                              className="reschedule-button-member-mypt"
                              onClick={() => handleOpenRescheduleModal(session)}
                            >
                              <FaExchangeAlt /> Reschedule
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-sessions-message-member-mypt">No upcoming sessions scheduled</p>
                    )}
                  </div>
                  
                  {/* Past Sessions */}
                  <div className="sessions-section-member-mypt">
                    <h4><FaHistory /> Past Sessions</h4>
                    {trainer.pastSessions && trainer.pastSessions.length > 0 ? (
                      <div className="sessions-list-member-mypt">
                        {trainer.pastSessions.map(session => (
                          <div className="session-card-member-mypt" key={session.id}>
                            <div className="session-info-member-mypt">
                              <p><FaCalendarAlt /> <strong>Date:</strong> {session.date}</p>
                              <p><FaClock /> <strong>Time:</strong> {session.time}</p>
                              <p><FaDumbbell /> <strong>Type:</strong> {session.type || "Training Session"}</p>
                              
                              {session.hasRating && (
                                <div className="session-rating-member-mypt">
                                  <p>
                                    <strong>Your Rating:</strong> {' '}
                                    {[...Array(5)].map((_, i) => (
                                      <FaStar 
                                        key={i} 
                                        className={i < session.rating ? "star-active-member-mypt" : "star-inactive-member-mypt"} 
                                      />
                                    ))}
                                  </p>
                                </div>
                              )}
                            </div>
                            
                            {!session.hasRating && (
                              <button 
                                className="rate-button-member-mypt"
                                onClick={() => handleOpenRatingModal(session)}
                              >
                                <FaStar /> Rate Session
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-sessions-message-member-mypt">No past sessions</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Booking Modal */}
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

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="success-modal-overlay-pt">
          <div className="success-modal-pt">
            <FaCheckCircle className="success-icon-pt" />
            <h2>Success!</h2>
            <p>{bookingMessage}</p>
            <button onClick={handleCloseSuccessModal}>
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* Rating Modal */}
      {showRatingModal && sessionToRate && (
        <div className="modal-overlay-member-mypt">
          <div className="rating-modal-member-mypt">
            <button 
              className="close-modal-member-mypt"
              onClick={() => setShowRatingModal(false)}
            >
              <FaTimes />
            </button>
            
            <h3>Rate Your Session</h3>
            <div className="session-details-member-mypt">
              <p><strong>Date:</strong> {sessionToRate.date}</p>
              <p><strong>Time:</strong> {sessionToRate.time}</p>
              <p><strong>Type:</strong> {sessionToRate.type || "Training Session"}</p>
            </div>
            
            <div className="rating-stars-member-mypt">
              <p><strong>Your Rating:</strong></p>
              <div className="stars-container-member-mypt">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`star-member-mypt ${star <= ratingValue ? "active" : ""}`}
                    onClick={() => setRatingValue(star)}
                  />
                ))}
              </div>
            </div>
            
            <div className="rating-comment-container-member-mypt">
              <p><strong>Your Comments:</strong></p>
              <textarea
                className="rating-comment-member-mypt"
                placeholder="Share your experience..."
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="modal-buttons-member-mypt">
              <button 
                className="cancel-button-member-mypt"
                onClick={() => setShowRatingModal(false)}
              >
                Cancel
              </button>
              <button 
                className="submit-button-member-mypt"
                onClick={handleRatingSubmit}
                disabled={ratingValue === 0}
              >
                <FaCheck /> Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Reschedule Modal */}
      {showRescheduleModal && sessionToReschedule && (
        <div className="modal-overlay-member-mypt">
          <div className="reschedule-modal-member-mypt">
            <button 
              className="close-modal-member-mypt"
              onClick={() => setShowRescheduleModal(false)}
            >
              <FaTimes />
            </button>
            
            <h3>Reschedule Your Session</h3>
            <div className="session-details-member-mypt">
              <p><strong>Current Date:</strong> {sessionToReschedule.date}</p>
              <p><strong>Current Time:</strong> {sessionToReschedule.time}</p>
              <p><strong>Type:</strong> {sessionToReschedule.type || "Training Session"}</p>
            </div>
            
            <div className="booking-form-member-mypt">
              <div className="form-group-member-mypt">
                <label htmlFor="reschedule-date">New Date:</label>
                <input 
                  type="date" 
                  id="reschedule-date" 
                  className="date-input-member-mypt"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="form-group-member-mypt">
                <label htmlFor="reschedule-time">New Time:</label>
                <input 
                  type="time" 
                  id="reschedule-time" 
                  className="time-input-member-mypt"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                />
              </div>
              
              {rescheduleMessage && (
                <p className="reschedule-error-message-member-mypt">{rescheduleMessage}</p>
              )}
            </div>
            
            <div className="modal-buttons-member-mypt">
              <button 
                className="cancel-button-member-mypt"
                onClick={() => setShowRescheduleModal(false)}
              >
                Cancel
              </button>
              <button 
                className="submit-button-member-mypt"
                onClick={handleRescheduleSubmit}
                disabled={!rescheduleDate || !rescheduleTime}
              >
                <FaCheck /> Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalTrainers; 