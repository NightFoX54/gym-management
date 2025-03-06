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
            <h3>Modern Equipment</h3>
            <p>State-of-the-art facilities with the latest fitness equipment</p>
          </div>
          <div className="feature">
            <h3>Expert Trainers</h3>
            <p>Professional trainers to guide you through your fitness journey</p>
          </div>
          <div className="feature">
            <h3>Flexible Hours</h3>
            <p>Open 24/7 to fit your busy schedule</p>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="social-icons">
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <i className="fab fa-youtube"></i>
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <i className="fab fa-facebook"></i>
          </a>
        </div>
        <div className="contact-info">
          <p className="phone-number">
            <i className="fas fa-phone phone-icon"></i>
            +90 (0212) 527 00 27
          </p>
          <p className="address">
            <i className="fas fa-map-marker-alt location-icon"></i>
            Barbaros Mahallesi, Begonya Sokak No:15, Ataşehir, İstanbul, Türkiye
          </p>
        </div>
      </section>
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
        
      </Routes>
    </Router>
  );
}

export default App;
