import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import ImageCarousel from './components/ImageCarousel';
import AdminPanel from './components/AdminPanel';
import { useState, useEffect } from 'react';
import Contact from './components/Contact';
import Services from './components/Services';
import PersonalTraining from './components/services/PersonalTraining';
import GroupClasses from './components/services/GroupClasses';
import StrengthTraining from './components/services/StrengthTraining';
import CardioZone from './components/services/CardioZone';
import Navbar from './components/Navbar';
import TrainerPage from './components/trainer/TrainerPage';
import Member from './components/member/Member';
import MyProfile from './components/member/MyProfile';
import MembershipStatus from './components/member/MembershipStatus'
import TrainingPlan from './components/member/TrainingPlan';
import WeeklySchedule from './components/member/WeeklySchedule';
import PersonalStatistics from './components/member/PersonalStatistics';
import ForgotPassword from './components/ForgotPassword';
import Market from './components/Market';
import NutritionCounseling from './components/services/NutritionCounseling';
import RecoveryWellness from './components/services/RecoveryWellness';
import Settings from './components/member/Settings';
import TrainingPrograms from './components/member/TrainingPrograms';
import MarketService from './components/services/MarketService';
import PersonalTrainers from './components/member/PersonalTrainers';
import WorkoutPrograms from "./components/member/WorkoutPrograms";
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import AiAssistantButton from './components/AiAssistantButton';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated, getUserRole } from './utils/auth';
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResetPassword from './components/ResetPassword';
import ProgressTracking from './components/member/ProgressTracking';
import Forum from './components/member/Forum';
import ForumThread from './components/member/ForumThread';
import Friends from './components/member/Friends';
import { motion } from 'framer-motion';

const Root = ({ isDarkMode, setIsDarkMode }) => {
  if (!isAuthenticated()) {
    return <Home isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />;
  }
  
  const role = getUserRole();
  
  switch (role) {
    case 'ADMIN':
      return <Navigate to="/admin" replace />;
    case 'MEMBER':
      return <Navigate to="/member" replace />;
    case 'TRAINER':
      return <Navigate to="/trainer" replace />;
    default:
      return <Home isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />;
  }
};

function Home({ isDarkMode, setIsDarkMode = () => {} }) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const testimonials = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Member since 2021",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      quote: "GymFlex completely transformed my fitness journey. The trainers are exceptional, and the 24/7 access fits perfectly with my busy schedule.",
      rating: 5
    },
    {
      id: 2,
      name: "Sophia Williams",
      role: "Fitness Enthusiast",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      quote: "I've been to many gyms before, but none compare to the community and equipment quality at GymFlex. It's become my second home.",
      rating: 5
    },
    {
      id: 3,
      name: "Marcus Chen",
      role: "Professional Athlete",
      image: "https://randomuser.me/api/portraits/men/51.jpg",
      quote: "The personal trainers here know exactly how to push you to your limits while keeping workouts enjoyable. Incredible transformation in just 3 months!",
      rating: 5
    },
    {
      id: 4,
      name: "Olivia Garcia",
      role: "Yoga Practitioner",
      image: "https://randomuser.me/api/portraits/women/29.jpg",
      quote: "The variety of classes and the flexibility of the schedules make GymFlex stand out. I've improved both my physical and mental wellbeing.",
      rating: 5
    }
  ];

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="hero-wrapper">
        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

        <div className="hero-section">
          <ImageCarousel />
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-text-container">
              <h5 className="hero-subtitle">SHAPE IT UP!</h5>
              <h1 className="hero-title">GET FIT DON'T QUIT</h1>
              <p className="hero-description">
                Today I will do what others won't, so tomorrow I can accomplish what others can't. We are what we repeatedly do. Excellence then is not an act but a habit.
              </p>
              <button 
                className="join-btn"
                onClick={() => window.location.href='/signup'}
              >
                JOIN US NOW
              </button>
            </div>
          </div>
        </div>
      </div>

      <section id="about" className="about-section">
        <motion.div 
          className="about-header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Why <span className="highlight-text">Choose Us?</span></h2>
          <p className="about-subtitle">Discover the GymFlex Difference</p>
        </motion.div>
        
        <motion.div 
          className="features-container"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="features">
            <motion.div 
              className="feature"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.3 }
              }}
            >
              <div className="feature-icon-wrapper">
                <i className="fas fa-dumbbell"></i>
              </div>
              <h3>Cutting-Edge Equipment</h3>
              <p>Our gym features the latest fitness technology and premium equipment from top brands, regularly maintained for optimal performance and safety.</p>
              <div className="feature-hover-effect"></div>
            </motion.div>
        
            <motion.div 
              className="feature"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.3 }
              }}
            >
              <div className="feature-icon-wrapper">
                <i className="fas fa-user-friends"></i>
              </div>
              <h3>Certified Expert Trainers</h3>
              <p>Our team of certified personal trainers create customized workout plans tailored to your unique fitness goals and provide ongoing motivation.</p>
              <div className="feature-hover-effect"></div>
            </motion.div>
        
            <motion.div 
              className="feature"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.3 }
              }}
            >
              <div className="feature-icon-wrapper">
                <i className="fas fa-clock"></i>
              </div>
              <h3>24/7 Access</h3>
              <p>Open all day, every day with secure access for members, allowing you to work out whenever it fits your schedule, even on holidays and weekends.</p>
              <div className="feature-hover-effect"></div>
            </motion.div>
        
            <motion.div 
              className="feature"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.3 }
              }}
            >
              <div className="feature-icon-wrapper">
                <i className="fas fa-heartbeat"></i>
              </div>
              <h3>Diverse Classes</h3>
              <p>From strength training and HIIT to yoga and group classes, we offer over 100 weekly classes to keep your fitness journey exciting and effective.</p>
              <div className="feature-hover-effect"></div>
            </motion.div>
        
            <motion.div 
              className="feature"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.3 }
              }}
            >
              <div className="feature-icon-wrapper">
                <i className="fas fa-shower"></i>
              </div>
              <h3>Premium Facilities</h3>
              <p>Enjoy our spacious locker rooms, clean showers, sauna, and relaxation areas designed to enhance your overall gym experience.</p>
              <div className="feature-hover-effect"></div>
            </motion.div>
        
            <motion.div 
              className="feature"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.3 }
              }}
            >
              <div className="feature-icon-wrapper">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>Fitness App & Community</h3>
              <p>Track your progress, book classes, and connect with trainers through our intuitive fitness app, and join our community of 5000+ active members.</p>
              <div className="feature-hover-effect"></div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="testimonials-section">
        <div className="testimonials-header">
          <h2>What Our <span className="highlight-text">Members Say</span></h2>
          <p className="testimonials-subtitle">Hear from the people who've experienced the GymFlex difference</p>
        </div>

        <div className="testimonials-container">
          {testimonials.map(testimonial => (
            <motion.div 
              key={testimonial.id} 
              className="testimonial-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: testimonial.id * 0.1 }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
                transition: { duration: 0.3 }
              }}
            >
              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
              </div>
              <p className="testimonial-quote">{testimonial.quote}</p>
              <div className="testimonial-author">
                <img src={testimonial.image} alt={testimonial.name} className="testimonial-image" />
                <div>
                  <h4 className="testimonial-name">{testimonial.name}</h4>
                  <p className="testimonial-role">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="testimonial-cta">
          <p>Ready to start your fitness journey with us?</p>
          <button 
            className="join-now-btn"
            onClick={() => window.location.href='/signup'}
          >
            Join Now
          </button>
        </div>
      </section>

      <footer className="footer-section">
        <div className="footer-content">
          <div className="footer-column">
            <h3>GymFlex</h3>
            <p>Transform your life through fitness with our state-of-the-art facilities and expert trainers.</p>
          </div>
          
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><a href="/services">Services</a></li>
              <li><a href="/login">Shop</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/signup">Join Now</a></li>
              <li><a href="/login">Member Login</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Our Services</h3>
            <ul className="footer-links">
              <li><a href="/services/personal-training">Personal Training</a></li>
              <li><a href="/services/group-classes">Group Classes</a></li>
              <li><a href="/services/strength-training">Strength Training</a></li>
              <li><a href="/services/cardio-zone">Cardio Zone</a></li>
              <li><a href="/services/nutrition">Nutrition Counseling</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Contact Info</h3>
            <ul className="contact-list">
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <span>Barbaros Mahallesi, Begonya Sokak No:15, Ataşehir, İstanbul, Türkiye</span>
              </li>
              <li>
                <i className="fas fa-phone"></i>
                <span>+90 (0212) 527 00 27</span>
              </li>
              <li>
                <i className="fas fa-envelope"></i>
                <span>info@gymflex.com</span>
              </li>
              <li>
                <i className="fas fa-clock"></i>
                <span>Open 24/7</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-social-icons">
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon">
            <i className="fab fa-youtube"></i>
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon">
            <i className="fab fa-twitter"></i>
          </a>
        </div>
        
        <div className="footer-bottom">
          <div className="newsletter">
            <h4>Subscribe to Our Newsletter</h4>
            <div className="newsletter-form">
              <input type="email" placeholder="Your Email Address" />
              <button type="submit">Subscribe</button>
            </div>
          </div>
          
          <div className="copyright">
            <p>&copy; {new Date().getFullYear()} GymFlex. All Rights Reserved.</p>
            <div className="footer-bottom-links">
              <a href="/privacy-policy">Privacy Policy</a>
              <a href="/terms-of-service">Terms of Service</a>
            </div>
          </div>
        </div>
        
        <button className="scroll-to-top" onClick={scrollToTop}>
          <i className="fas fa-arrow-up"></i>
        </button>
      </footer>
      
      <AiAssistantButton isDarkMode={isDarkMode} />
    </div>
  );
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || false
  );
  
  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  // Check authentication when the app loads
  useEffect(() => {
    const user = checkAuth();
    
    // Optional: You can also recheck periodically
    const intervalId = setInterval(() => {
      const currentUser = checkAuth();
    }, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, []);

  const checkAuth = () => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      return null;
    }

    const user = JSON.parse(userData);
    // If rememberMe is false, check if session is still valid (e.g., 24 hours)
    if (!user.rememberMe) {
      const sessionTimeout = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
      const currentTime = new Date().getTime();
      
      if (currentTime - user.loginTime > sessionTimeout) {
        console.log("deneme");
        localStorage.removeItem('user');
        return null;
      }
    }
    
    return user;
  };

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Root isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
          <Route path="/login" element={<Login isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
          <Route path="/forgot-password" element={<ForgotPassword isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
          <Route path="/signup" element={<Signup isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
          <Route path="/contact" element={<Contact isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
          <Route path="/services" element={<Services isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
          <Route path="/market" element={
            <ProtectedRoute requiredRole="MEMBER">
              <Market isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </ProtectedRoute>
          } />
          <Route path="/services/personal-training" element={<PersonalTraining isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
          <Route path="/services/group-classes" element={<GroupClasses isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
          <Route path="/services/strength-training" element={<StrengthTraining isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
          <Route path="/services/cardio-zone" element={<CardioZone isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
          <Route path="/services/nutrition" element={<NutritionCounseling isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
          <Route path="/services/recovery" element={<RecoveryWellness isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
          <Route path="/services/market" element={<MarketService isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
          <Route path="/terms-of-service" element={<TermsOfService isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
          
          <Route path="/admin/*" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminPanel isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </ProtectedRoute>
          } />
          
          <Route path="/trainer" element={
            <ProtectedRoute requiredRole="TRAINER">
              <TrainerPage isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </ProtectedRoute>
          } />
          <Route path="/trainer/clients" element={
            <ProtectedRoute requiredRole="TRAINER">
              <TrainerPage isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </ProtectedRoute>
          } />
          <Route path="/trainer/schedule" element={
            <ProtectedRoute requiredRole="TRAINER">
              <TrainerPage isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </ProtectedRoute>
          } />
          <Route path="/trainer/workouts" element={
            <ProtectedRoute requiredRole="TRAINER">
              <TrainerPage isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </ProtectedRoute>
          } />
          <Route path="/trainer/reports" element={
            <ProtectedRoute requiredRole="TRAINER">
              <TrainerPage isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </ProtectedRoute>
          } />
          <Route path="/trainer/settings" element={
            <ProtectedRoute requiredRole="TRAINER">
              <TrainerPage isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </ProtectedRoute>
          } />
          
          <Route path="/member" element={
            <ProtectedRoute requiredRole="MEMBER">
              <Member isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </ProtectedRoute>
          } />
          <Route path="/member/profile" element={
            <ProtectedRoute requiredRole="MEMBER">
              <MyProfile isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </ProtectedRoute>
          } />
          <Route path="/member/schedule" element={
            <ProtectedRoute requiredRole="MEMBER">
              <Member isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </ProtectedRoute>
          } />
          <Route path="/member/membership" element={
            <ProtectedRoute requiredRole="MEMBER">
              <MembershipStatus isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </ProtectedRoute>
          } />
          <Route path="/member/training" element={
            <ProtectedRoute requiredRole="MEMBER">
              <TrainingPlan isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </ProtectedRoute>
          } />
          <Route path="/member/weekly-schedule" element={
            <ProtectedRoute requiredRole="MEMBER">
              <WeeklySchedule isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </ProtectedRoute>
          } />
          <Route path="/member/personal-statistics" element={
            <ProtectedRoute requiredRole="MEMBER">
              <PersonalStatistics isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </ProtectedRoute>
          } />
          <Route path="/member/training-programs" element={
            <ProtectedRoute requiredRole="MEMBER">
              <TrainingPrograms isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </ProtectedRoute>
          } />
          <Route path="/member/settings" element={
            <ProtectedRoute requiredRole="MEMBER">
              <Settings isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </ProtectedRoute>
          } />
          <Route path="/member/personal-trainers" element={
            <ProtectedRoute requiredRole="MEMBER">
              <PersonalTrainers isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </ProtectedRoute>
          } />
          <Route path="/member/workout-programs" element={
            <ProtectedRoute requiredRole="MEMBER">
              <WorkoutPrograms isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </ProtectedRoute>
          } />
          <Route path="/member/progress-tracking" element={
            <ProtectedRoute requiredRole="MEMBER">
              <ProgressTracking isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </ProtectedRoute>
          } />
          <Route path="/member/forum" element={
            <ProtectedRoute requiredRole="MEMBER">
              <Forum isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </ProtectedRoute>
          } />
          <Route path="/member/forum/thread/:threadId" element={
            <ProtectedRoute requiredRole="MEMBER">
              <ForumThread isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </ProtectedRoute>
          } />
          <Route path="/member/friends" element={
            <ProtectedRoute requiredRole="MEMBER">
              <Friends isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </ProtectedRoute>
          } />
          <Route path="/reset-password" element={<ResetPassword isDarkMode={isDarkMode} />} />
        </Routes>
      </Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#4CAF50',
            },
          },
          error: {
            style: {
              background: '#F44336',
            },
          },
        }}
      />
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
