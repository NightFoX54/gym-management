import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function Home({ isDarkMode, setIsDarkMode }) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <div className="hero-section">
        <ImageCarousel />
        <div className="hero-content">
          <h1>Welcome to GymFlex</h1>
          <p>Transform Your Life Through Fitness</p>
          <button className="cta-button" onClick={() => window.location.href='/signup'}>
            Join Now
          </button>
        </div>
      </div>

      <section id="about" className="about-section">
        <h2>Why Choose Us?</h2>
        <div className="features">
          <div className="feature">
            <i className="fas fa-dumbbell"></i>
            <h3>Cutting-Edge Equipment</h3>
            <p>Our gym features the latest fitness technology and premium equipment from top brands, regularly maintained for optimal performance and safety.</p>
          </div>
          <div className="feature">
            <i className="fas fa-user-friends"></i>
            <h3>Certified Expert Trainers</h3>
            <p>Our team of certified personal trainers create customized workout plans tailored to your unique fitness goals and provide ongoing motivation.</p>
          </div>
          <div className="feature">
            <i className="fas fa-clock"></i>
            <h3>Flexible Hours</h3>
            <p>Open 24/7 with secure access for members, allowing you to work out whenever it fits your schedule, even on holidays.</p>
          </div>
          <div className="feature">
            <i className="fas fa-heartbeat"></i>
            <h3>Diverse Workout Options</h3>
            <p>From strength training and HIIT to yoga and group classes, we offer a wide range of workout options to keep your fitness journey exciting and effective.</p>
          </div>
          <div className="feature">
            <i className="fas fa-shower"></i>
            <h3>Premium Facilities</h3>
            <p>Enjoy our spacious locker rooms, clean showers, sauna, and relaxation areas designed to enhance your overall gym experience.</p>
          </div>
          <div className="feature">
            <i className="fas fa-mobile-alt"></i>
            <h3>Advanced Fitness App</h3>
            <p>Track your progress, book classes, and connect with trainers through our intuitive fitness app, available for all members at no extra cost.</p>
          </div>
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
    </div>
  );
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', savedDarkMode);
    return savedDarkMode;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
    document.body.classList.toggle('dark-mode', isDarkMode);
    console.log('Dark mode state:', isDarkMode);
  }, [isDarkMode]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/admin/*" element={<AdminPanel isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/login" element={<Login isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/forgot-password" element={<ForgotPassword isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/signup" element={<Signup isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/contact" element={<Contact isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/services" element={<Services isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/market" element={<Market isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/services/personal-training" element={<PersonalTraining isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/services/group-classes" element={<GroupClasses isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/services/strength-training" element={<StrengthTraining isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/services/cardio-zone" element={<CardioZone isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/trainer" element={<TrainerPage isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/trainer/clients" element={<TrainerPage isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/trainer/schedule" element={<TrainerPage isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/trainer/workouts" element={<TrainerPage isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/trainer/reports" element={<TrainerPage isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/trainer/settings" element={<TrainerPage isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/member" element={<Member isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/member/profile" element={<MyProfile isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/member/schedule" element={<Member isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/member/membership" element={<MembershipStatus isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/member/training" element={<TrainingPlan isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/member/weekly-schedule" element={<WeeklySchedule isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/member/personal-statistics" element={<PersonalStatistics isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/member/training-programs" element={<TrainingPrograms isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/member/settings" element={<Settings isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/services/nutrition" element={<NutritionCounseling isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/services/recovery" element={<RecoveryWellness isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/services/market" element={<MarketService isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/member/personal-trainers" element={<PersonalTrainers isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/member/workout-programs" element={<WorkoutPrograms isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/terms-of-service" element={<TermsOfService isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
      </Routes>
    </Router>
  );
}

export default App;
