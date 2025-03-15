import React, { useState, useEffect, useRef } from 'react';
import '../styles/AiAssistant.css';
import { motion, AnimatePresence } from 'framer-motion';
import frontBodyDiagramImage from '../assets/images/front-body-diagram.png';
import backBodyDiagramImage from '../assets/images/back-body-diagram.png';

// Body parts data with descriptions and recommended services
const bodyPartsData = {
  // Front body parts
  chest: {
    side: "front",
    name: "Chest",
    description: "The pectoralis major is a thick, fan-shaped muscle that makes up the bulk of the chest muscles.",
    services: [
      { name: "Personal Training", description: "Learn optimal chest exercises tailored to your body type and goals." },
      { name: "Strength Training", description: "Access to bench press stations, dumbbells, and cable fly machines." },
      { name: "Group Classes", description: "Join our chest and back focused classes for a comprehensive workout." }
    ]
  },
  "biceps-left": {
    side: "front",
    name: "Left Bicep",
    description: "The biceps brachii is a two-headed muscle that lies on the upper arm between the shoulder and the elbow.",
    services: [
      { name: "Personal Training", description: "One-on-one sessions with a trainer who will focus on specialized bicep exercises." },
      { name: "Strength Training", description: "Utilize our dedicated strength area with various weight options for bicep curls." },
      { name: "Group Classes", description: "Join our upper body classes that incorporate bicep exercises." }
    ]
  },
  "biceps-right": {
    side: "front",
    name: "Right Bicep",
    description: "The biceps brachii is a two-headed muscle that lies on the upper arm between the shoulder and the elbow.",
    services: [
      { name: "Personal Training", description: "One-on-one sessions with a trainer who will focus on specialized bicep exercises." },
      { name: "Strength Training", description: "Utilize our dedicated strength area with various weight options for bicep curls." },
      { name: "Group Classes", description: "Join our upper body classes that incorporate bicep exercises." }
    ]
  },
  abs: {
    side: "front",
    name: "Abs",
    description: "The abdominal muscles include the rectus abdominis, obliques, and transverse abdominis.",
    services: [
      { name: "Personal Training", description: "Tailored core workouts to help you achieve visible abs." },
      { name: "Group Classes", description: "Core-focused classes that target all areas of your abs." },
      { name: "Nutrition Counseling", description: "Guidance on nutrition to help reveal abdominal definition." }
    ]
  },
  "shoulders-left": {
    side: "front",
    name: "Left Shoulder (Front)",
    description: "The anterior deltoid makes up the front portion of the shoulder, responsible for raising the arm forward.",
    services: [
      { name: "Personal Training", description: "Learn techniques to safely build shoulder strength and avoid injury." },
      { name: "Strength Training", description: "Access to specialized shoulder equipment and free weights." },
      { name: "Group Classes", description: "Our upper body classes incorporate comprehensive shoulder exercises." }
    ]
  },
  "shoulders-right": {
    side: "front",
    name: "Right Shoulder (Front)",
    description: "The anterior deltoid makes up the front portion of the shoulder, responsible for raising the arm forward.",
    services: [
      { name: "Personal Training", description: "Learn techniques to safely build shoulder strength and avoid injury." },
      { name: "Strength Training", description: "Access to specialized shoulder equipment and free weights." },
      { name: "Group Classes", description: "Our upper body classes incorporate comprehensive shoulder exercises." }
    ]
  },
  "forearms-left": {
    side: "front",
    name: "Left Forearm",
    description: "The forearm muscles include the flexors and pronators, essential for wrist and finger movement.",
    services: [
      { name: "Personal Training", description: "Specific exercises to strengthen your grip and forearm muscles." },
      { name: "Strength Training", description: "Equipment like wrist rollers, hand grippers, and farmer's walk implements." },
      { name: "Recovery & Wellness", description: "Massage services to help with forearm tension and recovery." }
    ]
  },
  "forearms-right": {
    side: "front",
    name: "Right Forearm",
    description: "The forearm muscles include the flexors and pronators, essential for wrist and finger movement.",
    services: [
      { name: "Personal Training", description: "Specific exercises to strengthen your grip and forearm muscles." },
      { name: "Strength Training", description: "Equipment like wrist rollers, hand grippers, and farmer's walk implements." },
      { name: "Recovery & Wellness", description: "Massage services to help with forearm tension and recovery." }
    ]
  },
  "quads-left": {
    side: "front",
    name: "Left Quadriceps",
    description: "The quadriceps femoris is a group of four muscles at the front of the thigh that straighten the knee.",
    services: [
      { name: "Personal Training", description: "Expert guidance on squats, lunges, and other quad-dominant exercises." },
      { name: "Strength Training", description: "Access to squat racks, leg press, and leg extension machines." },
      { name: "Group Classes", description: "Lower body focused classes to build strength and endurance." }
    ]
  },
  "quads-right": {
    side: "front",
    name: "Right Quadriceps",
    description: "The quadriceps femoris is a group of four muscles at the front of the thigh that straighten the knee.",
    services: [
      { name: "Personal Training", description: "Expert guidance on squats, lunges, and other quad-dominant exercises." },
      { name: "Strength Training", description: "Access to squat racks, leg press, and leg extension machines." },
      { name: "Group Classes", description: "Lower body focused classes to build strength and endurance." }
    ]
  },
  "calves-front-left": {
    side: "front",
    name: "Left Calf (Front)",
    description: "The tibialis anterior runs along the shin and helps flex the foot upward.",
    services: [
      { name: "Personal Training", description: "Balanced lower leg training to develop both the front and back of your calves." },
      { name: "Recovery & Wellness", description: "Specialized stretching sessions to prevent shin splints." },
      { name: "Group Classes", description: "Full-leg workout classes that address often-neglected muscles." }
    ]
  },
  "calves-front-right": {
    side: "front",
    name: "Right Calf (Front)",
    description: "The tibialis anterior runs along the shin and helps flex the foot upward.",
    services: [
      { name: "Personal Training", description: "Balanced lower leg training to develop both the front and back of your calves." },
      { name: "Recovery & Wellness", description: "Specialized stretching sessions to prevent shin splints." },
      { name: "Group Classes", description: "Full-leg workout classes that address often-neglected muscles." }
    ]
  },
  // Back body parts
  back: {
    side: "back",
    name: "Back",
    description: "The back consists of several muscle groups including the latissimus dorsi, rhomboids, and trapezius.",
    services: [
      { name: "Personal Training", description: "Professional guidance on proper pulling movements to develop a strong back." },
      { name: "Strength Training", description: "Access to pull-up bars, lat pulldown machines, and rowing equipment." },
      { name: "Recovery & Wellness", description: "Massage services to help with back tension and recovery." }
    ]
  },
  "triceps-left": {
    side: "back",
    name: "Left Triceps",
    description: "The triceps brachii is a three-headed muscle located on the back of the upper arm.",
    services: [
      { name: "Personal Training", description: "Expert guidance on proper form for tricep dips, extensions, and pushdowns." },
      { name: "Strength Training", description: "Access to cable machines and free weights ideal for tricep isolation." },
      { name: "Group Classes", description: "Our arm-focused classes incorporate multiple tricep exercises." }
    ]
  },
  "triceps-right": {
    side: "back",
    name: "Right Triceps",
    description: "The triceps brachii is a three-headed muscle located on the back of the upper arm.",
    services: [
      { name: "Personal Training", description: "Expert guidance on proper form for tricep dips, extensions, and pushdowns." },
      { name: "Strength Training", description: "Access to cable machines and free weights ideal for tricep isolation." },
      { name: "Group Classes", description: "Our arm-focused classes incorporate multiple tricep exercises." }
    ]
  },
  "shoulders-back-left": {
    side: "back",
    name: "Left Shoulder (Back)",
    description: "The posterior deltoid makes up the back portion of the shoulder, responsible for pulling the arm backward.",
    services: [
      { name: "Personal Training", description: "Targeted exercises for the rear delts to improve posture and shoulder balance." },
      { name: "Strength Training", description: "Access to specialized equipment for rear delt flies and rows." },
      { name: "Group Classes", description: "Upper body classes that ensure complete shoulder development." }
    ]
  },
  "shoulders-back-right": {
    side: "back",
    name: "Right Shoulder (Back)",
    description: "The posterior deltoid makes up the back portion of the shoulder, responsible for pulling the arm backward.",
    services: [
      { name: "Personal Training", description: "Targeted exercises for the rear delts to improve posture and shoulder balance." },
      { name: "Strength Training", description: "Access to specialized equipment for rear delt flies and rows." },
      { name: "Group Classes", description: "Upper body classes that ensure complete shoulder development." }
    ]
  },
  trapezius: {
    side: "back",
    name: "Trapezius",
    description: "The trapezius is a large triangular muscle that extends from the neck to the middle of the back.",
    services: [
      { name: "Personal Training", description: "Proper techniques for shrugs and upper back exercises to target the traps." },
      { name: "Strength Training", description: "Access to specialized equipment for trap development." },
      { name: "Recovery & Wellness", description: "Massage therapy focused on releasing tension in the neck and upper back." }
    ]
  },
  lower_back: {
    side: "back",
    name: "Lower Back",
    description: "The erector spinae are a group of muscles that run along the spine and help with back extension.",
    services: [
      { name: "Personal Training", description: "Safe lower back strengthening with deadlifts and extensions." },
      { name: "Recovery & Wellness", description: "Specialized lower back massage and flexibility sessions." },
      { name: "Group Classes", description: "Core stability classes focusing on maintaining a healthy spine." }
    ]
  },
  glutes: {
    side: "back",
    name: "Glutes",
    description: "The gluteal muscles include the gluteus maximus, medius, and minimus, forming the buttocks.",
    services: [
      { name: "Personal Training", description: "Targeted exercises to strengthen and shape your glutes." },
      { name: "Strength Training", description: "Access to hip thrust equipment, squat racks, and cable machines." },
      { name: "Group Classes", description: "Dedicated glute-focused classes for all fitness levels." }
    ]
  },
  "hamstrings-left": {
    side: "back",
    name: "Left Hamstrings",
    description: "The hamstrings are three muscles at the back of the thigh that flex the knee and extend the hip.",
    services: [
      { name: "Personal Training", description: "Expert guidance on deadlifts, leg curls, and other hamstring exercises." },
      { name: "Strength Training", description: "Access to specialized hamstring equipment and barbells." },
      { name: "Recovery & Wellness", description: "Stretching sessions to improve hamstring flexibility and prevent injury." }
    ]
  },
  "hamstrings-right": {
    side: "back",
    name: "Right Hamstrings",
    description: "The hamstrings are three muscles at the back of the thigh that flex the knee and extend the hip.",
    services: [
      { name: "Personal Training", description: "Expert guidance on deadlifts, leg curls, and other hamstring exercises." },
      { name: "Strength Training", description: "Access to specialized hamstring equipment and barbells." },
      { name: "Recovery & Wellness", description: "Stretching sessions to improve hamstring flexibility and prevent injury." }
    ]
  },
  "calves-left": {
    side: "back",
    name: "Left Calf (Back)",
    description: "The gastrocnemius and soleus muscles make up the back of the calf and help point the foot downward.",
    services: [
      { name: "Personal Training", description: "Targeted calf training to improve strength and aesthetics." },
      { name: "Strength Training", description: "Access to calf raise machines and platforms." },
      { name: "Recovery & Wellness", description: "Specialized massage for calf muscle recovery." }
    ]
  },
  "calves-right": {
    side: "back",
    name: "Right Calf (Back)",
    description: "The gastrocnemius and soleus muscles make up the back of the calf and help point the foot downward.",
    services: [
      { name: "Personal Training", description: "Targeted calf training to improve strength and aesthetics." },
      { name: "Strength Training", description: "Access to calf raise machines and platforms." },
      { name: "Recovery & Wellness", description: "Specialized massage for calf muscle recovery." }
    ]
  },
  cardio: {
    side: "both",
    name: "Cardiovascular System",
    description: "Not a muscle group, but essential for overall fitness, endurance, and heart health.",
    services: [
      { name: "Cardio Zone", description: "State-of-the-art treadmills, ellipticals, and cycling equipment." },
      { name: "Group Classes", description: "High-intensity interval training and cardio-focused classes." },
      { name: "Personal Training", description: "Custom cardio programs designed for your fitness level." }
    ]
  }
};

const defaultMessages = [
  {
    sender: 'ai',
    text: 'Hello! I\'m your GymFlex AI Assistant. I can help you find the perfect services for your fitness goals. Toggle between front and back body views, then click on a body part or tell me what you\'d like to work on!'
  }
];

const AiAssistant = ({ isOpen, onClose, isDarkMode }) => {
  const [messages, setMessages] = useState(defaultMessages);
  const [inputText, setInputText] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [showBackView, setShowBackView] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleBodyView = () => {
    setShowBackView(!showBackView);
    // Reset selected body part when toggling view
    setSelectedBodyPart(null);
  };

  const filteredBodyParts = Object.keys(bodyPartsData).filter(part => {
    return bodyPartsData[part].side === (showBackView ? "back" : "front") || bodyPartsData[part].side === "both";
  });

  const handleBodyPartClick = (bodyPart) => {
    setSelectedBodyPart(bodyPart);
    
    // Add a user message
    const userMessage = {
      sender: 'user',
      text: `I want to work on my ${bodyPartsData[bodyPart].name}.`
    };
    
    // Add an AI response with the body part information
    const aiResponse = {
      sender: 'ai',
      text: `Great choice! ${bodyPartsData[bodyPart].description} Here are the services we recommend for ${bodyPartsData[bodyPart].name} development:`
    };
    
    setMessages([...messages, userMessage, aiResponse]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    // Add user message
    const userMessage = {
      sender: 'user',
      text: inputText
    };
    setMessages([...messages, userMessage]);
    
    // Process the input to find matching body parts
    const input = inputText.toLowerCase();
    
    // Daha gelişmiş eşleşme mantığı
    const matchedBodyPart = Object.keys(bodyPartsData).find(part => {
      const partName = bodyPartsData[part].name.toLowerCase();
      const simplifiedPart = part.replace(/-left|-right/g, '').toLowerCase();
      
      // İsimden, anahtar kelimeden veya basit hale getirilmiş kas grubundan eşleşme ara
      return input.includes(partName) || 
             input.includes(simplifiedPart) ||
             input.includes(part.toLowerCase());
    });
    
    let aiResponse;
    if (matchedBodyPart) {
      // If the matched body part is from the other view, switch views
      if (bodyPartsData[matchedBodyPart].side === "back" && !showBackView) {
        setShowBackView(true);
      } else if (bodyPartsData[matchedBodyPart].side === "front" && showBackView) {
        setShowBackView(false);
      }
      
      setSelectedBodyPart(matchedBodyPart);
      aiResponse = {
        sender: 'ai',
        text: `I see you're interested in ${bodyPartsData[matchedBodyPart].name}! ${bodyPartsData[matchedBodyPart].description} Here are the services we recommend:`
      };
    } else {
      aiResponse = {
        sender: 'ai',
        text: "I'm not sure which muscle group you're referring to. Please click on one of the body parts on the diagram, toggle between front/back views, or try mentioning a specific muscle group."
      };
    }
    
    // Add AI response after a short delay to simulate thinking
    setTimeout(() => {
      setMessages(prev => [...prev, aiResponse]);
    }, 500);
    
    setInputText('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={`ai-assistant-container ${isDarkMode ? 'dark-mode' : ''}`}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="ai-assistant-header">
            <h2>GymFlex AI Assistant</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          
          <div className="ai-assistant-content">
            <div className="chat-section">
              <div className="chat-messages">
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.sender}`}>
                    <div className="message-bubble">
                      {msg.text}
                    </div>
                  </div>
                ))}
                {selectedBodyPart && (
                  <div className="service-recommendations">
                    {bodyPartsData[selectedBodyPart].services.map((service, index) => (
                      <div key={index} className="service-card">
                        <h4>{service.name}</h4>
                        <p>{service.description}</p>
                        <a href={`/services/${service.name.toLowerCase().replace(/\s+/g, '-')}`} className="service-link">
                          Learn More
                        </a>
                      </div>
                    ))}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <form className="chat-input" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask about specific muscle groups..."
                />
                <button type="submit">Send</button>
              </form>
            </div>
            
            <div className="body-selector-section">
              <div className="body-view-toggle">
                <h3>{showBackView ? "Back View" : "Front View"}</h3>
                <button 
                  className="toggle-view-button" 
                  onClick={toggleBodyView}
                  aria-label={showBackView ? "Switch to front view" : "Switch to back view"}
                >
                  {showBackView ? "View Front Body" : "View Back Body"}
                  <i className={`fas fa-sync-alt ${showBackView ? "rotate-left" : "rotate-right"}`}></i>
                </button>
              </div>
              
              <div className="body-parts-container">
                <div className="body-parts-legend">
                  {filteredBodyParts.map(part => (
                    <div 
                      key={part} 
                      className={`legend-item ${selectedBodyPart === part ? 'selected' : ''}`}
                      onClick={() => handleBodyPartClick(part)}
                    >
                      {bodyPartsData[part].name}
                    </div>
                  ))}
                </div>

                <div className="body-diagram-container">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={showBackView ? "back" : "front"}
                      className="diagram-wrapper"
                      initial={{ opacity: 0, rotateY: showBackView ? -90 : 90 }}
                      animate={{ opacity: 1, rotateY: 0 }}
                      exit={{ opacity: 0, rotateY: showBackView ? 90 : -90 }}
                      transition={{ duration: 0.5 }}
                    >
                      <img 
                        src={showBackView ? backBodyDiagramImage : frontBodyDiagramImage} 
                        alt={showBackView ? "Back body diagram" : "Front body diagram"} 
                        className="body-diagram-image" 
                      />
                      
                      <div className="diagram-instruction">
                        {selectedBodyPart 
                          ? `${bodyPartsData[selectedBodyPart].name} selected` 
                          : 'Click on a muscle group'}
                      </div>
                      
                      {/* Display buttons for the current view */}
                      {filteredBodyParts.map(part => {
                        const buttonClasses = `body-part-button ${part} ${selectedBodyPart === part ? 'selected' : ''}`;
                        return (
                          <button 
                            key={part}
                            className={buttonClasses} 
                            onClick={() => handleBodyPartClick(part)}
                            aria-label={bodyPartsData[part].name}
                          ></button>
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AiAssistant; 