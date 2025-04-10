import React, { useState, useEffect } from 'react';
import { FaDumbbell, FaRunning, FaSwimmer, FaPrayingHands, FaArrowLeft, FaClock, FaUser, FaCalendarAlt, FaSun, FaMoon, FaTimes, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/TrainingPrograms.css';
import axios from 'axios';

const TrainingPrograms = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [enrolledSessions, setEnrolledSessions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequired, setPaymentRequired] = useState(false);
  const [classPrice, setClassPrice] = useState(0);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvc: ''
  });
  const [paymentErrors, setPaymentErrors] = useState({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    // Get logged in user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      // Check if payment is required for this user
      checkPaymentRequired(JSON.parse(userData).id);
    }

    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Fetch categories
    fetchCategories();
    
    // Fetch all programs initially
    fetchPrograms();
    
    // If user is logged in, fetch their enrollments
    if (userData) {
      const parsedUser = JSON.parse(userData);
      fetchUserEnrollments(parsedUser.id);
    }
  }, [setIsDarkMode]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/group-workouts/categories');
      const categoriesData = response.data;
      
      // Map categories with icons
      const categoriesWithIcons = [
        { id: 'all', name: 'All Programs', icon: <FaDumbbell /> },
        ...categoriesData.map(category => {
          let icon = <FaDumbbell />;
          
          // Map category names to icons (adjust as needed)
          if (category.categoryName.toLowerCase().includes('yoga')) {
            icon = <FaPrayingHands />;
          } else if (category.categoryName.toLowerCase().includes('cardio')) {
            icon = <FaRunning />;
          } else if (category.categoryName.toLowerCase().includes('swimming')) {
            icon = <FaSwimmer />;
          }
          
          return {
            id: category.id,
            name: category.categoryName,
            icon: icon
          };
        })
      ];
      
      setCategories(categoriesWithIcons);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    }
  };

  const fetchPrograms = async (categoryId = null) => {
    try {
      const url = categoryId && categoryId !== 'all' 
        ? `http://localhost:8080/api/group-workouts?categoryId=${categoryId}`
        : 'http://localhost:8080/api/group-workouts';
        
      const response = await axios.get(url);
      setPrograms(response.data);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setError('Failed to load workout programs');
    }
  };

  const fetchSessionsForProgram = async (programId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/group-workouts/${programId}/sessions`);
      setSessions(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError('Failed to load available sessions');
      return [];
    }
  };

  const fetchUserEnrollments = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/group-workouts/user/${userId}/enrollments`);
      setEnrolledSessions(response.data);
    } catch (error) {
      console.error('Error fetching user enrollments:', error);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchPrograms(categoryId);
  };

  const handleEnrollClick = async (program) => {
    if (!user) {
      // Redirect to login if not logged in
      navigate('/login');
      return;
    }
    
    setSelectedProgram(program);
    
    // Fetch available sessions for this program
    const programSessions = await fetchSessionsForProgram(program.id);
    
    if (programSessions.length > 0) {
      setShowEnrollModal(true);
    } else {
      setError('No available sessions for this program');
    }
  };

  const handleSessionSelect = (session) => {
    setSelectedSession(session);
  };

  const handleEnrollConfirm = async () => {
    if (!selectedSession) return;
    
    setIsLoading(true);
    
    try {
      if (paymentRequired) {
        // Show payment modal instead of completing enrollment
        setShowPaymentModal(true);
      } else {
        // Proceed with normal enrollment (free)
        const response = await axios.post('http://localhost:8080/api/group-workouts/enroll', {
          userId: user.id,
          sessionId: selectedSession.id
        });
        
        if (response.data.success) {
          // Add this session to enrolled sessions
          setEnrolledSessions([...enrolledSessions, selectedSession.id]);
          setShowEnrollModal(false);
          setSelectedProgram(null);
          setSelectedSession(null);
          alert(`Successfully enrolled in ${selectedProgram.title}!`);
        }
      }
    } catch (error) {
      console.error('Error enrolling in session:', error);
      setError(error.response?.data?.error || 'Failed to enroll in session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnrollCancel = () => {
    setShowEnrollModal(false);
    setSelectedProgram(null);
    setSelectedSession(null);
  };

  // Check if payment is required for the user
  const checkPaymentRequired = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/group-workouts/user/${userId}/check-payment-required`);
      const { paymentRequired, price } = response.data;
      
      setPaymentRequired(paymentRequired);
      if (paymentRequired && price) {
        setClassPrice(price);
      }
    } catch (error) {
      console.error('Error checking payment requirement:', error);
    }
  };

  // Handle payment info change
  const handlePaymentInfoChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      // Remove non-digits
      const digits = value.replace(/\D/g, '');
      // Add a space after every 4th digit
      formattedValue = digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
      // Limit to 19 characters (16 digits + 3 spaces)
      formattedValue = formattedValue.substring(0, 19);
    } 
    // Format expiry date as MM/YY
    else if (name === 'expiryDate') {
      // Remove non-digits
      const digits = value.replace(/\D/g, '');
      
      if (digits.length <= 2) {
        formattedValue = digits;
      } else {
        formattedValue = `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
      }
    }
    // Format CVC (3-4 digits only)
    else if (name === 'cvc') {
      // Remove non-digits and limit to 4 characters
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }
    
    setPaymentInfo({
      ...paymentInfo,
      [name]: formattedValue
    });
  };

  // Validate payment info
  const validatePaymentInfo = () => {
    const errors = {};
    
    if (!paymentInfo.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      errors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    
    if (!paymentInfo.cardHolderName.trim()) {
      errors.cardHolderName = 'Please enter the card holder name';
    }
    
    if (!paymentInfo.expiryDate.match(/^\d{2}\/\d{2}$/)) {
      errors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    } else {
      // Check if the expiry date is valid
      const [month, year] = paymentInfo.expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        errors.expiryDate = 'Invalid month';
      } else if (parseInt(year) < currentYear || 
                (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        errors.expiryDate = 'Card has expired';
      }
    }
    
    if (!paymentInfo.cvc.match(/^\d{3,4}$/)) {
      errors.cvc = 'Please enter a valid CVC (3-4 digits)';
    }
    
    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle payment submission
  const handlePaymentSubmit = async () => {
    // Validate payment info first
    if (!validatePaymentInfo()) {
      return;
    }
    
    setIsProcessingPayment(true);
    
    try {
      // Normally we would process payment with a payment processor here
      // For this demo, we'll just simulate a successful payment
      
      // Then proceed with enrollment with payment flag
      await axios.post('http://localhost:8080/api/group-workouts/enroll-with-payment', {
        userId: user.id,
        sessionId: selectedSession.id,
        isPaid: true,
        price: classPrice
      });
      
      // Add this session to enrolled sessions
      setEnrolledSessions([...enrolledSessions, selectedSession.id]);
      setShowPaymentModal(false);
      setShowEnrollModal(false);
      setSelectedProgram(null);
      setSelectedSession(null);
      alert(`Successfully enrolled in ${selectedProgram.title}!`);
    } catch (error) {
      console.error('Error processing payment:', error);
      setError(error.response?.data?.error || 'Failed to process payment');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Handle payment modal cancel
  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
    // Reset payment info
    setPaymentInfo({
      cardNumber: '',
      cardHolderName: '',
      expiryDate: '',
      cvc: ''
    });
    setPaymentErrors({});
  };

  const filteredPrograms = programs;

  return (
    <div className={`training-programs-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="header-container">
        <button className="back-button" onClick={() => navigate("/member")}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1 className="header-title">Group Classes</h1>
        <div className="header-right">
          <button
            className={`dark-mode-toggle ${isDarkMode ? "active" : ""}`}
            onClick={toggleDarkMode}
          >
            <FaSun className="toggle-icon sun" />
            <div className="toggle-circle"></div>
            <FaMoon className="toggle-icon moon" />
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category.id)}
          >
            {category.icon}
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      <div className="programs-grid">
        {filteredPrograms.map(program => (
          <div key={program.id} className="program-card">
            <div className="program-image">
              <img 
                src={program.image || '/images/group-workouts/default.jpg'} 
                alt={program.title} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/group-workouts/default.jpg';
                }}
              />
              <div className="program-level">{program.level}</div>
            </div>
            <div className="program-content">
              <h3>{program.title}</h3>
              <p>{program.description}</p>
              <div className="program-details">
                <div className="detail-item">
                  <FaClock />
                  <span>{program.duration}</span>
                </div>
                <div className="detail-item">
                  <FaUser />
                  <span>{program.trainer}</span>
                </div>
                <div className="detail-item">
                  <FaCalendarAlt />
                  <span>Multiple sessions available</span>
                </div>
              </div>
              <button 
                className="enroll-button"
                onClick={() => handleEnrollClick(program)}
              >
                View Sessions
              </button>
            </div>
          </div>
        ))}
      </div>

      {showEnrollModal && selectedProgram && (
        <div className="enroll-modal-overlay">
          <div className="enroll-modal">
            <button className="close-modal" onClick={handleEnrollCancel}>
              <FaTimes />
            </button>
            <h2>Select a Session</h2>
            <div className="modal-content">
              <h3>{selectedProgram.title}</h3>
              <div className="program-details">
                <p><strong>Duration:</strong> {selectedProgram.duration}</p>
                <p><strong>Trainer:</strong> {selectedProgram.trainer}</p>
                <p><strong>Level:</strong> {selectedProgram.level}</p>
              </div>
              
              <div className="sessions-list">
                <h4>Available Sessions:</h4>
                {sessions.length > 0 ? (
                  sessions.map(session => (
                    <div 
                      key={session.id} 
                      className={`session-item ${selectedSession?.id === session.id ? 'selected' : ''} ${enrolledSessions.includes(session.id) ? 'enrolled' : ''}`}
                      onClick={() => !enrolledSessions.includes(session.id) && handleSessionSelect(session)}
                    >
                      <span>{session.formattedDateTime}</span>
                      {enrolledSessions.includes(session.id) ? (
                        <span className="enrolled-badge">Already Enrolled</span>
                      ) : (
                        <span className="select-badge">
                          {selectedSession?.id === session.id ? 'Selected' : 'Select'}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No sessions available for this program.</p>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={handleEnrollCancel}>
                Cancel
              </button>
              <button 
                className="confirm-button" 
                onClick={handleEnrollConfirm}
                disabled={!selectedSession || enrolledSessions.includes(selectedSession.id) || isLoading}
              >
                <FaCheck /> {isLoading ? 'Enrolling...' : 'Confirm Enrollment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <button className="close-modal" onClick={handlePaymentCancel}>
              <FaTimes />
            </button>
            <h2>Payment Required</h2>
            <div className="modal-content">
              <p>This class requires payment of <strong>{classPrice} TL</strong>.</p>
              
              <div className="payment-form">
                <div className="form-group">
                  <label>Card Number</label>
                  <input 
                    type="text" 
                    name="cardNumber" 
                    value={paymentInfo.cardNumber}
                    onChange={handlePaymentInfoChange}
                    placeholder="1234 5678 9012 3456"
                    className={paymentErrors.cardNumber ? 'error' : ''}
                  />
                  {paymentErrors.cardNumber && (
                    <span className="error-message">{paymentErrors.cardNumber}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Card Holder Name</label>
                  <input 
                    type="text" 
                    name="cardHolderName" 
                    value={paymentInfo.cardHolderName}
                    onChange={handlePaymentInfoChange}
                    placeholder="John Doe"
                    className={paymentErrors.cardHolderName ? 'error' : ''}
                  />
                  {paymentErrors.cardHolderName && (
                    <span className="error-message">{paymentErrors.cardHolderName}</span>
                  )}
                </div>
                
                <div className="payment-row">
                  <div className="form-group small">
                    <label>Expiry Date</label>
                    <input 
                      type="text" 
                      name="expiryDate" 
                      value={paymentInfo.expiryDate}
                      onChange={handlePaymentInfoChange}
                      placeholder="MM/YY"
                      className={paymentErrors.expiryDate ? 'error' : ''}
                    />
                    {paymentErrors.expiryDate && (
                      <span className="error-message">{paymentErrors.expiryDate}</span>
                    )}
                  </div>
                  
                  <div className="form-group small">
                    <label>CVC</label>
                    <input 
                      type="text" 
                      name="cvc" 
                      value={paymentInfo.cvc}
                      onChange={handlePaymentInfoChange}
                      placeholder="123"
                      className={paymentErrors.cvc ? 'error' : ''}
                    />
                    {paymentErrors.cvc && (
                      <span className="error-message">{paymentErrors.cvc}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={handlePaymentCancel}>
                Cancel
              </button>
              <button 
                className="confirm-button" 
                onClick={handlePaymentSubmit}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? 'Processing...' : 'Pay & Enroll'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingPrograms; 