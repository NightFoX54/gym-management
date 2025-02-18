import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import ImageCarousel from './components/ImageCarousel';

function Home() {
  return (
    <div className="App">
      <nav className="navbar">
        <div className="logo">GymFlex</div>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
          <button className="login-btn" onClick={() => window.location.href='/login'}>Login</button>
        </div>
      </nav>

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
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
