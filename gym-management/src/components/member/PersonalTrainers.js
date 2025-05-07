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
  FaUserFriends,
  FaInfoCircle,
  FaShoppingCart,
  FaCreditCard,
  FaExclamationTriangle
} from 'react-icons/fa';
import '../../styles/PersonalTrainers.css';
import axios from 'axios';
import withChatAndNotifications from './withChatAndNotifications';
import { motion } from 'framer-motion';

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
  const [rescheduleConfirmationMessage, setRescheduleConfirmationMessage] = useState('');
  const [showRescheduleConfirmationModal, setShowRescheduleConfirmationModal] = useState(false);

  // In the existing code, let's add a state for the Book More Sessions modal
  const [showBookMoreModal, setShowBookMoreModal] = useState(false);
  const [selectedMyTrainer, setSelectedMyTrainer] = useState(null);
  const [bookMoreDate, setBookMoreDate] = useState('');
  const [bookMoreTime, setBookMoreTime] = useState('');
  const [bookMoreMessage, setBookMoreMessage] = useState('');
  const [bookingMoreStatus, setBookingMoreStatus] = useState(null);

  // Add a new state for the already-client notification
  const [showAlreadyClientModal, setShowAlreadyClientModal] = useState(false);
  const [alreadyClientTrainer, setAlreadyClientTrainer] = useState(null);

  // Add these state variables to your existing state declarations
  const [freeSessionsInfo, setFreeSessionsInfo] = useState(null);
  const [showBuyMoreSessionsModal, setShowBuyMoreSessionsModal] = useState(false);
  const [selectedTrainerToBuy, setSelectedTrainerToBuy] = useState(null);
  const [selectedSessionPackage, setSelectedSessionPackage] = useState(1);
  const [buyMoreStatus, setBuyMoreStatus] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [cardName, setCardName] = useState('');
  const [paymentError, setPaymentError] = useState('');

  const [trainerRatings, setTrainerRatings] = useState({});

  // Add state for personal training price
  const [personalTrainingPrice, setPersonalTrainingPrice] = useState(200); // Default fallback value

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
  
  // Update the useEffect to fetch myTrainers for both tabs
  useEffect(() => {
    if (userId) {
      fetchMyTrainers();
    }
  }, [userId]);
  
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

  // Add this useEffect to fetch trainer ratings
  useEffect(() => {
    const fetchTrainerRatings = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/trainer/ratings');
        setTrainerRatings(response.data);
      } catch (error) {
        console.error("Error fetching trainer ratings:", error);
      }
    };

    fetchTrainerRatings();
  }, []);

  // Add new useEffect to fetch personal training price
  useEffect(() => {
    const fetchPersonalTrainingPrice = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/general-prices/1');
        if (response.data && response.data.price) {
          setPersonalTrainingPrice(response.data.price);
        }
      } catch (error) {
        console.error('Error fetching personal training price:', error);
        // Keep using default price if fetch fails
      }
    };
    
    fetchPersonalTrainingPrice();
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    console.log("Dark mode toggled to:", newDarkMode);
  };

  // Add this useEffect near your other useEffect hooks
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [setIsDarkMode]);

  const handleBookSession = (trainer) => {
    console.log("Selected trainer:", trainer);
    console.log("My trainers:", myTrainers);
    
    // First, make sure myTrainers is loaded
    if (!myTrainers || myTrainers.length === 0) {
      // If myTrainers isn't loaded yet, proceed with booking
      setSelectedTrainer(trainer);
      setBookingDate('');
      setBookingTime('');
      setBookingMessage('');
      setShowBookingModal(true);
      return;
    }
    
    // Check if this trainer is already in myTrainers
    // Add more flexible comparison to handle potential data structure differences
    const isAlreadyMyTrainer = myTrainers.some(myTrainer => {
      console.log(`Comparing: myTrainer.trainerId=${myTrainer.trainerId} with trainer.id=${trainer.id}`);
      return myTrainer.trainerId === trainer.id;
    });
    
    console.log("Is already my trainer:", isAlreadyMyTrainer);
    
    if (isAlreadyMyTrainer) {
      // Set the trainer and show the notification
      setAlreadyClientTrainer(trainer);
      setShowAlreadyClientModal(true);
    } else {
      // Original booking flow
      setSelectedTrainer(trainer);
      setBookingDate('');
      setBookingTime('');
      setBookingMessage('');
      setShowBookingModal(true);
    }
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
      // Use the new endpoint for reschedule requests
      const response = await fetch(`http://localhost:8080/api/member-trainers/reschedule-request/${sessionToReschedule.id}`, {
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
        throw new Error('Failed to submit reschedule request');
      }
      
      const result = await response.json();
      
      // Close the reschedule modal
      setShowRescheduleModal(false);
      
      // Show confirmation modal
      setRescheduleConfirmationMessage(
        `Your reschedule request has been submitted and is waiting for trainer approval. 
        You will be notified when the trainer responds to your request.`
      );
      setShowRescheduleConfirmationModal(true);
      
      // Reset form
      setSessionToReschedule(null);
    } catch (err) {
      console.error('Error submitting reschedule request:', err);
      setRescheduleMessage('Failed to submit reschedule request. Please try again.');
    }
  };

  // Add this function to handle opening the Book More Sessions modal
  const handleOpenBookMoreModal = (trainer) => {
    setSelectedMyTrainer(trainer);
    setBookMoreDate('');
    setBookMoreTime('');
    setBookMoreMessage('');
    setBookingMoreStatus(null);
    setShowBookMoreModal(true);
  };

  // Add this function to submit the booking request
  const handleBookMoreSubmit = async () => {
    if (!selectedMyTrainer || !bookMoreDate || !bookMoreTime) {
      return;
    }
    
    // Check if user has either free PT sessions or paid sessions available
    if (freeSessionsInfo && freeSessionsInfo.remaining === 0 && selectedMyTrainer.remainingSessions === 0) {
      setBookMoreMessage("You don't have any free PT sessions or paid sessions remaining. Please purchase more sessions first.");
      return;
    }
    
    try {
      const requestData = {
        trainerId: selectedMyTrainer.trainerId,
        clientId: userId,
        requestMessage: bookMoreMessage,
        requestedMeetingDate: bookMoreDate,
        requestedMeetingTime: bookMoreTime
      };
      
      const response = await fetch('http://localhost:8080/api/trainer-session-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to book more sessions');
      }
      
      setBookingMoreStatus('success');
      
      // Close modal after 2 seconds on success
      setTimeout(() => {
        setShowBookMoreModal(false);
        setBookingMoreStatus(null);
      }, 2000);
      
    } catch (error) {
      console.error('Error booking more sessions:', error);
      setBookingMoreStatus('error');
    }
  };

  // Function to handle redirecting to My Trainers tab
  const handleRedirectToMyTrainers = () => {
    setActiveTab('myTrainers');
    setShowAlreadyClientModal(false);
  };

  // Add this useEffect to fetch free PT session info
  useEffect(() => {
    const fetchFreePtInfo = async () => {
      if (!userId) return;
      
      try {
        const response = await fetch(`http://localhost:8080/api/free-pt/remaining/${userId}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch free PT sessions info');
        }
        
        const data = await response.json();
        setFreeSessionsInfo(data);
      } catch (err) {
        console.error('Error fetching free PT sessions info:', err);
      }
    };
    
    fetchFreePtInfo();
  }, [userId, user.token]);

  // Update the formatter functions to ensure only numbers are accepted
  const formatCardNumber = (value) => {
    // Remove any non-numeric characters
    const v = value.replace(/[^0-9]/g, '');
    
    // Split into groups of 4 digits
    const parts = [];
    for (let i = 0; i < v.length && i < 16; i += 4) {
      parts.push(v.substring(i, Math.min(i + 4, v.length)));
    }
    
    // Join with spaces
    return parts.join(' ');
  };

  const formatExpiry = (value) => {
    // Remove any non-numeric characters
    const v = value.replace(/[^0-9]/g, '');
    
    // Format as MM/YY
    if (v.length > 0) {
      // Ensure month is between 01-12
      let month = v.substring(0, Math.min(2, v.length));
      if (month.length === 2 && parseInt(month) > 12) {
        month = '12';
      }
      
      if (v.length > 2) {
        return `${month}/${v.substring(2, 4)}`;
      } else {
        return month;
      }
    }
    
    return '';
  };

  // Add these handler functions
  const handleOpenBuyMoreSessionsModal = (trainer) => {
    setSelectedTrainerToBuy(trainer);
    setSelectedSessionPackage(1);
    setCardNumber('');
    setCardExpiry('');
    setCardCVC('');
    setCardName('');
    setPaymentError('');
    setBuyMoreStatus(null);
    setShowBuyMoreSessionsModal(true);
  };

  const handleCloseBuyMoreSessionsModal = () => {
    setShowBuyMoreSessionsModal(false);
    setSelectedTrainerToBuy(null);
  };

  const handleBuyMoreSessions = async () => {
    // Validate form
    if (!cardName.trim()) {
      setPaymentError('Please enter the cardholder name');
      return;
    }
    
    if (cardNumber.replace(/\s/g, '').length < 16) {
      setPaymentError('Please enter a valid card number');
      return;
    }
    
    if (!cardExpiry.includes('/') || cardExpiry.length !== 5) {
      setPaymentError('Please enter a valid expiry date (MM/YY)');
      return;
    }
    
    if (cardCVC.length < 3) {
      setPaymentError('Please enter a valid CVC');
      return;
    }
    
    setBuyMoreStatus('processing');
    
    // Calculate price with discount using fetched price
    let unitPrice = personalTrainingPrice; // Use fetched price instead of hardcoded value
    let discount = 0;
    
    if (selectedSessionPackage === 5) {
      discount = 0.1; // 10% discount
    } else if (selectedSessionPackage === 10) {
      discount = 0.15; // 15% discount
    } else if (selectedSessionPackage === 20) {
      discount = 0.2; // 20% discount
    }
    
    const totalPrice = unitPrice * selectedSessionPackage;
    const finalPrice = totalPrice * (1 - discount);
    
    try {
      // First, find or create the trainer-client relationship
      const trainerClientResponse = await fetch(`http://localhost:8080/api/trainer-client/find`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          trainerId: selectedTrainerToBuy.trainerId,
          clientId: userId
        })
      });
      
      if (!trainerClientResponse.ok) {
        throw new Error('Failed to find trainer-client relationship');
      }
      
      const trainerClientData = await trainerClientResponse.json();
      
      // Now use the trainerClientId for the purchase
      const response = await fetch('http://localhost:8080/api/pt-sessions/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          trainerClientId: trainerClientData.id,
          sessionAmount: selectedSessionPackage,
          totalPrice: finalPrice.toFixed(2)
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to process payment');
      }
      
      const data = await response.json();
      setBuyMoreStatus('success');
      
      // Update the trainer's remaining sessions in the local state
      setMyTrainers(myTrainers.map(trainer => {
        if (trainer.trainerId === selectedTrainerToBuy.trainerId) {
          return {...trainer, remainingSessions: data.remainingSessions};
        }
        return trainer;
      }));
      
      // Refresh my trainers list after 2 seconds
      setTimeout(() => {
        fetchMyTrainers();
        handleCloseBuyMoreSessionsModal();
      }, 2000);
      
    } catch (err) {
      console.error('Error buying more sessions:', err);
      setPaymentError('Payment failed. Please try again.');
      setBuyMoreStatus(null);
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
          className={`dark-mode-toggle-forum ${isDarkMode ? "active" : ""}`}
          onClick={toggleDarkMode}
        >
          <FaSun className="toggle-icon-forum sun-forum" />
          <div className="toggle-circle-forum"></div>
          <FaMoon className="toggle-icon-forum moon-forum" />
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

      {/* Free PT info display on My Trainers tab */}
      {activeTab === 'myTrainers' && freeSessionsInfo && (
        <div className="free-pt-info">
          <div className="free-pt-card">
            <h3><FaDumbbell /> Monthly Free PT Sessions</h3>
            <div className="free-pt-details">
              <p>Your membership includes {freeSessionsInfo.total} free personal training sessions each month.</p>
              <p className="free-pt-remaining">
                <strong>Remaining this month: {freeSessionsInfo.remaining}</strong> (Used: {freeSessionsInfo.used})
              </p>
              <p className="free-pt-note">
                These sessions can be used for initial consultations with trainers to help find the best match for your fitness goals.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Free consultation info on All Trainers tab */}
      {activeTab === 'allTrainers' && (
        <div className="free-consultation-info">
          <div className="info-message">
            <FaInfoCircle className="info-icon" />
            <p>
              <strong>Free Initial Consultations:</strong> Your membership includes complimentary personal training consultations to help you find the perfect trainer for your fitness journey. Schedule a session to discuss your goals, assess your needs, and determine if the trainer is right for you.
            </p>
          </div>
        </div>
      )}

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
                <div className="trainer-card-pt" key={trainer.id}>
                  <div className="trainer-avatar-container-pt">
                    <img
                      src={trainer.profilePhoto || "https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"}
                      alt={`${trainer.firstName} ${trainer.lastName}`}
                      className="trainer-avatar-pt"
                    />
                  </div>
                  
                  <div className="trainer-info-pt">
                    <h3>{trainer.firstName} {trainer.lastName}</h3>
                    
                    <div className="trainer-rating-box-pt">
                      <div className="star-rating-pt">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span 
                            key={star} 
                            className={`star-pt ${star <= Math.round(trainerRatings[trainer.id] || 0) ? 'filled-star-pt' : ''}`}
                          >
                            <FaStar />
                          </span>
                        ))}
                      </div>
                      <div className="rating-text-pt">
                        {(trainerRatings[trainer.id] || 0).toFixed(1)} 
                        {trainerRatings[trainer.id] ? '' : ' (No reviews yet)'}
                      </div>
                    </div>
                    
                    <div className="trainer-detail-pt">
                      <FaDumbbell className="detail-icon-pt" />
                      <span>{trainer.specialization || "General fitness"}</span>
                    </div>
                    
                    {trainer.bio && (
                      <div className="trainer-bio-pt">
                        <span className="bio-label-pt">Bio:</span>
                        <p>{trainer.bio}</p>
                      </div>
                    )}
                    
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
                      onClick={() => handleOpenBookMoreModal(trainer)}
                    >
                      <FaCalendarCheck /> Book More Sessions
                    </button>
                    <button 
                      className="buy-sessions-button-pt"
                      onClick={() => handleOpenBuyMoreSessionsModal(trainer)}
                    >
                      <FaShoppingCart /> Buy Sessions
                    </button>
                  </div>
                  
                  {/* Upcoming Sessions */}
                  <div className="sessions-section-member-mypt">
                    <h4><FaCalendarDay /> Upcoming Sessions</h4>
                    {trainer.upcomingSessions && trainer.upcomingSessions.length > 0 ? (
                      <div className="sessions-list-member-mypt">
                        {trainer.upcomingSessions.map(session => (
                          <div className="session-card-member-mypt" key={session.id || `session-${session.date}-${session.time}`}>
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
                          <div className="session-card-member-mypt past" key={session.id || `past-session-${session.date}-${session.time}`}>
                            <div className="session-header-member-mypt">
                              <span className="session-date-member-mypt">
                                <FaCalendarDay /> {session.date}
                              </span>
                              <span className="session-time-member-mypt">
                                <FaClock /> {session.time}
                              </span>
                            </div>
                            <div className="session-details-member-mypt">
                              <p className="session-type-member-mypt">
                                <FaDumbbell /> {session.type || "Training Session"}
                              </p>
                              {session.notes && (
                                <p className="session-notes-member-mypt">
                                  <FaComments /> {session.notes}
                                </p>
                              )}
                              
                              {session.hasRating ? (
                                <div className="session-rating-member-mypt">
                                  <p>Your Rating:</p>
                                  <div className="stars-display-member-mypt">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <FaStar
                                        key={star}
                                        className={`star-display-member-mypt ${star <= session.rating ? "active" : ""}`}
                                      />
                                    ))}
                                  </div>
                                  {session.comment && (
                                    <p className="rating-comment-display-member-mypt">"{session.comment}"</p>
                                  )}
                                </div>
                              ) : (
                                <button 
                                  className="rate-session-button-member-mypt"
                                  onClick={() => handleOpenRatingModal(session)}
                                >
                                  <FaStar /> Rate This Session
                                </button>
                              )}
                            </div>
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

      {/* Book More Sessions Modal */}
      {showBookMoreModal && selectedMyTrainer && (
        <div className="modal-overlay-pt">
          <div className="modal-pt">
            <div className="modal-header-pt">
              <h3>Book More Sessions</h3>
              <button className="close-modal-pt" onClick={() => setShowBookMoreModal(false)}>
                <FaTimes />
              </button>
            </div>
            
            {bookingMoreStatus === 'success' ? (
              <div className="success-message-pt">
                <FaCheckCircle className="success-icon-pt" /> 
                <p>Session request sent successfully!</p>
              </div>
            ) : (
              <>
                <div className="trainer-name-modal-pt">
                  <h4>{selectedMyTrainer.trainerName}</h4>
                </div>
                
                {/* Add free PT session warning message */}
                {freeSessionsInfo && freeSessionsInfo.remaining > 0 && (
                  <div className="free-session-info alert alert-info">
                    <FaInfoCircle className="mr-2" />
                    <span>You have {freeSessionsInfo.remaining} free PT session(s) remaining. This booking will use one free session.</span>
                  </div>
                )}
                
                {/* Add warning if no free sessions and no paid sessions remain */}
                {freeSessionsInfo && freeSessionsInfo.remaining === 0 && selectedMyTrainer.remainingSessions === 0 && (
                  <div className="no-sessions-warning alert alert-warning">
                    <FaExclamationTriangle className="mr-2" />
                    <span>You have no free PT sessions or paid sessions remaining with this trainer. Please purchase more sessions before booking.</span>
                  </div>
                )}
                
                {/* Add info if using paid sessions */}
                {freeSessionsInfo && freeSessionsInfo.remaining === 0 && selectedMyTrainer.remainingSessions > 0 && (
                  <div className="paid-session-info alert alert-info">
                    <FaInfoCircle className="mr-2" />
                    <span>This booking will use one of your {selectedMyTrainer.remainingSessions} remaining paid session(s) with this trainer.</span>
                  </div>
                )}
                
                <div className="booking-form-pt">
                  <div className="form-group-pt">
                    <label htmlFor="book-more-date">Select Date:</label>
                    <input 
                      type="date" 
                      id="book-more-date" 
                      className="date-input-pt"
                      value={bookMoreDate}
                      onChange={(e) => setBookMoreDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="form-group-pt">
                    <label htmlFor="book-more-time">Select Time:</label>
                    <input 
                      type="time" 
                      id="book-more-time" 
                      className="time-input-pt"
                      value={bookMoreTime}
                      onChange={(e) => setBookMoreTime(e.target.value)}
                    />
                  </div>
                  
                  {bookingMoreStatus === 'error' && (
                    <p className="booking-error-message">Failed to send request. Please try again.</p>
                  )}
                </div>
                
                <div className="modal-actions-pt">
                  <button 
                    className="cancel-button-pt"
                    onClick={() => setShowBookMoreModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="confirm-button-pt"
                    onClick={handleBookMoreSubmit}
                    disabled={!bookMoreDate || !bookMoreTime}
                  >
                    <FaCalendarCheck /> Request Session
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Already Client Modal */}
      {showAlreadyClientModal && alreadyClientTrainer && (
        <div className="modal-overlay-pt">
          <div className="modal-pt already-client-modal">
            <button 
              className="close-modal-pt"
              onClick={() => setShowAlreadyClientModal(false)}
            >
              <FaTimes />
            </button>
            
            <div className="already-client-content">
              <FaInfoCircle className="info-icon" />
              <h3>Already Your Trainer</h3>
              <p>
                You are already a client of <strong>{alreadyClientTrainer.firstName} {alreadyClientTrainer.lastName}</strong>. 
                Please book additional sessions from the "My Trainers" tab.
              </p>
              
              <div className="modal-actions-pt">
                <button 
                  className="cancel-button-pt"
                  onClick={() => setShowAlreadyClientModal(false)}
                >
                  Close
                </button>
                <button 
                  className="confirm-button-pt"
                  onClick={handleRedirectToMyTrainers}
                >
                  Go to My Trainers
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buy More Sessions Modal */}
      {showBuyMoreSessionsModal && selectedTrainerToBuy && (
        <div className="modal-overlay-pt">
          <div className="modal-pt buy-sessions-modal-pt">
            <div className="modal-header-pt">
              <h3>Buy Training Sessions</h3>
              <button className="close-button-pt" onClick={handleCloseBuyMoreSessionsModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content-pt">
              {buyMoreStatus === 'success' ? (
                <div className="success-message-pt">
                  <FaCheckCircle />
                  <h4>Payment Successful!</h4>
                  <p>You've purchased {selectedSessionPackage} sessions with {selectedTrainerToBuy.firstName} {selectedTrainerToBuy.lastName}.</p>
                </div>
              ) : buyMoreStatus === 'processing' ? (
                <div className="loading-message-pt">
                  <FaSpinner className="spinner-pt" />
                  <p>Processing payment...</p>
                </div>
              ) : (
                <>
                  <div className="trainer-info-pt">
                    <h4>Trainer: {selectedTrainerToBuy.firstName} {selectedTrainerToBuy.lastName}</h4>
                    
                    <div className="session-packages-pt">
                      <h4>Select Package:</h4>
                      <div className="package-buttons-pt">
                        <button 
                          className={`package-button-pt ${selectedSessionPackage === 1 ? 'selected-package-pt' : ''}`}
                          onClick={() => setSelectedSessionPackage(1)}
                        >
                          1 Session
                          <span className="package-price-pt">{personalTrainingPrice} TL</span>
                        </button>
                        <button 
                          className={`package-button-pt ${selectedSessionPackage === 5 ? 'selected-package-pt' : ''}`}
                          onClick={() => setSelectedSessionPackage(5)}
                        >
                          5 Sessions
                          <span className="package-price-pt">{(personalTrainingPrice * 5 * 0.9).toFixed(0)} TL</span>
                          <span className="discount-badge-pt">10% off</span>
                        </button>
                        <button 
                          className={`package-button-pt ${selectedSessionPackage === 10 ? 'selected-package-pt' : ''}`}
                          onClick={() => setSelectedSessionPackage(10)}
                        >
                          10 Sessions
                          <span className="package-price-pt">{(personalTrainingPrice * 10 * 0.85).toFixed(0)} TL</span>
                          <span className="discount-badge-pt">15% off</span>
                        </button>
                        <button 
                          className={`package-button-pt ${selectedSessionPackage === 20 ? 'selected-package-pt' : ''}`}
                          onClick={() => setSelectedSessionPackage(20)}
                        >
                          20 Sessions
                          <span className="package-price-pt">{(personalTrainingPrice * 20 * 0.8).toFixed(0)} TL</span>
                          <span className="discount-badge-pt">20% off</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="payment-section-pt">
                      <h4>Payment Details:</h4>
                      {paymentError && (
                        <div className="payment-error-pt">
                          <FaExclamationTriangle />
                          <span>{paymentError}</span>
                        </div>
                      )}
                      
                      <div className="form-group-pt">
                        <label htmlFor="card-name">Cardholder Name</label>
                        <input 
                          type="text" 
                          id="card-name" 
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div className="form-group-pt">
                        <label htmlFor="card-number">Card Number</label>
                        <input 
                          type="text" 
                          id="card-number" 
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </div>
                      
                      <div className="card-details-row-pt">
                        <div className="form-group-pt expiry-group">
                          <label htmlFor="card-expiry">Expiry Date</label>
                          <input 
                            type="text" 
                            id="card-expiry" 
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                        </div>
                        
                        <div className="form-group-pt cvc-group">
                          <label htmlFor="card-cvc">CVC</label>
                          <input 
                            type="text" 
                            id="card-cvc" 
                            value={cardCVC}
                            onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, '').substring(0, 4))}
                            maxLength={4}
                            placeholder="123"
                          />
                        </div>
                      </div>
                      
                      <button 
                        className="purchase-button-pt"
                        onClick={handleBuyMoreSessions}
                      >
                        Purchase {selectedSessionPackage} Session{selectedSessionPackage > 1 ? 's' : ''}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Confirmation Modal */}
      {showRescheduleConfirmationModal && (
        <div className="modal-overlay-pt">
          <div className="modal-pt">
            <div className="modal-header-pt">
              <h3>Reschedule Request Submitted</h3>
              <button className="close-button-pt" onClick={() => setShowRescheduleConfirmationModal(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content-pt">
              <div className="success-message-pt">
                <FaCheckCircle className="success-icon-pt" />
                <p>{rescheduleConfirmationMessage}</p>
              </div>
              
              <div className="modal-buttons-pt">
                <button 
                  className="primary-button-pt" 
                  onClick={() => setShowRescheduleConfirmationModal(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withChatAndNotifications(PersonalTrainers); 