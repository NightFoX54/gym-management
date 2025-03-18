import React, { useState, useEffect, useRef } from 'react';
import '../styles/AiAssistant.css';
import { motion, AnimatePresence } from 'framer-motion';
import frontBodyDiagramImage from '../assets/images/front-body-diagram.png';
import backBodyDiagramImage from '../assets/images/back-body-diagram.png';

// Simplified muscle groups with descriptions and services
const muscleGroups = {
  front: [
    {
      id: 'chest',
      name: 'Chest',
      description: 'The pectoralis major is a thick, fan-shaped muscle that makes up the bulk of the chest muscles.',
      services: [
        { name: "Personal Training", description: "Learn optimal chest exercises tailored to your body type and goals." },
        { name: "Strength Training", description: "Access to bench press stations, dumbbells, and cable fly machines." },
        { name: "Group Classes", description: "Join our chest and back focused classes for a comprehensive workout." }
      ]
    },
    {
      id: 'biceps',
      name: 'Biceps',
      description: 'The biceps brachii is a two-headed muscle that lies on the upper arm between the shoulder and the elbow.',
      services: [
        { name: "Personal Training", description: "One-on-one sessions with a trainer who will focus on specialized bicep exercises." },
        { name: "Strength Training", description: "Utilize our dedicated strength area with various weight options for bicep curls." },
        { name: "Group Classes", description: "Join our upper body classes that incorporate bicep exercises." }
      ]
    },
    {
      id: 'abs',
      name: 'Abs',
      description: 'The abdominal muscles include the rectus abdominis, obliques, and transverse abdominis.',
      services: [
        { name: "Personal Training", description: "Tailored core workouts to help you achieve visible abs." },
        { name: "Group Classes", description: "Core-focused classes that target all areas of your abs." },
        { name: "Nutrition Counseling", description: "Guidance on nutrition to help reveal abdominal definition." }
      ]
    },
    {
      id: 'shoulders',
      name: 'Shoulders',
      description: 'The deltoid muscles form the rounded contour of the shoulders and are essential for arm movement.',
      services: [
        { name: "Personal Training", description: "Learn techniques to safely build shoulder strength and avoid injury." },
        { name: "Strength Training", description: "Access to specialized shoulder equipment and free weights." },
        { name: "Group Classes", description: "Our upper body classes incorporate comprehensive shoulder exercises." }
      ]
    },
    {
      id: 'forearms',
      name: 'Forearms',
      description: 'The forearm muscles include the flexors and pronators, essential for wrist and finger movement.',
      services: [
        { name: "Personal Training", description: "Specific exercises to strengthen your grip and forearm muscles." },
        { name: "Strength Training", description: "Equipment like wrist rollers, hand grippers, and farmer's walk implements." },
        { name: "Recovery & Wellness", description: "Massage services to help with forearm tension and recovery." }
      ]
    },
    {
      id: 'quads',
      name: 'Quadriceps',
      description: 'The quadriceps femoris is a group of four muscles at the front of the thigh that straighten the knee.',
      services: [
        { name: "Personal Training", description: "Expert guidance on squats, lunges, and other quad-dominant exercises." },
        { name: "Strength Training", description: "Access to squat racks, leg press, and leg extension machines." },
        { name: "Group Classes", description: "Lower body focused classes to build strength and endurance." }
      ]
    },
    {
      id: 'calves',
      name: 'Calves',
      description: 'The gastrocnemius and soleus muscles make up the calf and help point the foot downward.',
      services: [
        { name: "Personal Training", description: "Targeted calf training to improve strength and aesthetics." },
        { name: "Strength Training", description: "Access to calf raise machines and platforms." },
        { name: "Recovery & Wellness", description: "Specialized massage for calf muscle recovery." }
      ]
    }
  ],
  back: [
    {
      id: 'back',
      name: 'Back',
      description: 'The back consists of several muscle groups including the latissimus dorsi, rhomboids, and trapezius.',
      services: [
        { name: "Personal Training", description: "Professional guidance on proper pulling movements to develop a strong back." },
        { name: "Strength Training", description: "Access to pull-up bars, lat pulldown machines, and rowing equipment." },
        { name: "Recovery & Wellness", description: "Massage services to help with back tension and recovery." }
      ]
    },
    {
      id: 'triceps',
      name: 'Triceps',
      description: 'The triceps brachii is a three-headed muscle located on the back of the upper arm.',
      services: [
        { name: "Personal Training", description: "Expert guidance on proper form for tricep dips, extensions, and pushdowns." },
        { name: "Strength Training", description: "Access to cable machines and free weights ideal for tricep isolation." },
        { name: "Group Classes", description: "Our arm-focused classes incorporate multiple tricep exercises." }
      ]
    },
    {
      id: 'trapezius',
      name: 'Trapezius',
      description: 'The trapezius is a large triangular muscle that extends from the neck to the middle of the back.',
      services: [
        { name: "Personal Training", description: "Proper techniques for shrugs and upper back exercises to target the traps." },
        { name: "Strength Training", description: "Access to specialized equipment for trap development." },
        { name: "Recovery & Wellness", description: "Massage therapy focused on releasing tension in the neck and upper back." }
      ]
    },
    {
      id: 'lower_back',
      name: 'Lower Back',
      description: 'The erector spinae are a group of muscles that run along the spine and help with back extension.',
      services: [
        { name: "Personal Training", description: "Safe lower back strengthening with deadlifts and extensions." },
        { name: "Recovery & Wellness", description: "Specialized lower back massage and flexibility sessions." },
        { name: "Group Classes", description: "Core stability classes focusing on maintaining a healthy spine." }
      ]
    },
    {
      id: 'glutes',
      name: 'Glutes',
      description: 'The gluteal muscles include the gluteus maximus, medius, and minimus, forming the buttocks.',
      services: [
        { name: "Personal Training", description: "Targeted exercises to strengthen and shape your glutes." },
        { name: "Strength Training", description: "Access to hip thrust equipment, squat racks, and cable machines." },
        { name: "Group Classes", description: "Dedicated glute-focused classes for all fitness levels." }
      ]
    },
    {
      id: 'hamstrings',
      name: 'Hamstrings',
      description: 'The hamstrings are three muscles at the back of the thigh that flex the knee and extend the hip.',
      services: [
        { name: "Personal Training", description: "Expert guidance on deadlifts, leg curls, and other hamstring exercises." },
        { name: "Strength Training", description: "Access to specialized hamstring equipment and barbells." },
        { name: "Recovery & Wellness", description: "Stretching sessions to improve hamstring flexibility and prevent injury." }
      ]
    },
    {
      id: 'calves',
      name: 'Calves',
      description: 'The gastrocnemius and soleus muscles make up the calf and help point the foot downward.',
      services: [
        { name: "Personal Training", description: "Targeted calf training to improve strength and aesthetics." },
        { name: "Strength Training", description: "Access to calf raise machines and platforms." },
        { name: "Recovery & Wellness", description: "Specialized massage for calf muscle recovery." }
      ]
    }
  ]
};

const defaultMessages = [
  {
    sender: 'ai',
    text: "Hello! I'm your GymFlex AI Assistant. I can help you find the perfect services for your fitness goals. Toggle between front and back body views, then click on a muscle group or tell me what you'd like to work on!"
  }
];

const ServiceCard = ({ service }) => (
  <div className="service-card">
    <h4>{service.name}</h4>
    <p>{service.description}</p>
    <a 
      href={`/services/${service.name.toLowerCase().replace(/\s+/g, '-')}`} 
      className="service-link"
    >
      Learn More
    </a>
  </div>
);

const findMuscleFromText = (text, currentView) => {
  const input = text.toLowerCase();
  const keywords = {
    chest: ['chest', 'pec', 'pectoral', 'upper body', 'push'],
    biceps: ['bicep', 'biceps', 'arm', 'guns', 'upper arm'],
    abs: ['abs', 'abdomen', 'abdominal', 'core', 'six pack', 'stomach'],
    shoulders: ['shoulder', 'delt', 'deltoid'],
    forearms: ['forearm', 'wrist', 'grip', 'lower arm'],
    quads: ['quad', 'quadricep', 'thigh', 'front leg', 'leg'],
    calves: ['calf', 'calves', 'lower leg'],
    back: ['back', 'lat', 'lats', 'latissimus'],
    triceps: ['tricep', 'triceps', 'back arm'],
    trapezius: ['trap', 'traps', 'trapezius', 'upper back', 'neck'],
    lower_back: ['lower back', 'lumbar', 'spine'],
    glutes: ['glute', 'glutes', 'buttocks', 'butt', 'hip'],
    hamstrings: ['hamstring', 'ham', 'back thigh', 'back leg']
  };

  // First try to find exact muscle name match
  const exactMatch = currentView.find(muscle => 
    input.includes(muscle.name.toLowerCase()) || 
    input.includes(muscle.id.toLowerCase())
  );
  if (exactMatch) return exactMatch;

  // Then try to match keywords
  for (const muscle of currentView) {
    if (keywords[muscle.id]?.some(keyword => input.includes(keyword))) {
      return muscle;
    }
  }

  // Try to understand training intentions
  const trainingKeywords = {
    chest: ['push up', 'bench press', 'push-up', 'pushup', 'chest press'],
    biceps: ['curl', 'chin up', 'chin-up', 'pulling'],
    abs: ['crunch', 'sit up', 'plank', 'core exercise'],
    shoulders: ['press', 'overhead', 'military press', 'lateral raise'],
    back: ['pull up', 'row', 'pulling', 'deadlift'],
    triceps: ['extension', 'pushdown', 'dip'],
    legs: ['squat', 'lunge', 'leg press', 'leg day'],
  };

  for (const [muscleGroup, exercises] of Object.entries(trainingKeywords)) {
    if (exercises.some(exercise => input.includes(exercise))) {
      return currentView.find(muscle => muscle.id === muscleGroup);
    }
  }

  return null;
};

const generateAIResponse = (userInput, matchedMuscle) => {
  const input = userInput.toLowerCase();
  
  // Check if user is asking about training or information
  const isAskingAboutTraining = input.includes('train') || 
    input.includes('exercise') || 
    input.includes('workout') ||
    input.includes('build') ||
    input.includes('strengthen');

  const isAskingAboutServices = input.includes('service') || 
    input.includes('class') || 
    input.includes('trainer') ||
    input.includes('program') ||
    input.includes('help');

  if (isAskingAboutTraining) {
    return `I see you're interested in training your ${matchedMuscle.name}. ${matchedMuscle.description} Here are our recommended services to help you achieve your training goals:`;
  } else if (isAskingAboutServices) {
    return `For your ${matchedMuscle.name} development, we offer several specialized services. ${matchedMuscle.description} Here are the services I recommend:`;
  } else {
    return `Great choice focusing on your ${matchedMuscle.name}! ${matchedMuscle.description} Here are some recommended services for ${matchedMuscle.name.toLowerCase()} development:`;
  }
};

const AiAssistant = ({ isOpen, onClose, isDarkMode }) => {
  const [messages, setMessages] = useState(defaultMessages);
  const [inputText, setInputText] = useState('');
  const [showBackView, setShowBackView] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  
  useEffect(() => {
    if (messagesEndRef.current && chatContainerRef.current) {
      const userMessages = messages.filter(msg => msg.sender === 'user');
      if (userMessages.length > 0) {
        const lastUserMessageIndex = messages.findIndex(
          msg => msg === userMessages[userMessages.length - 1]
        );
        
        if (lastUserMessageIndex !== -1) {
          const messageElements = chatContainerRef.current.getElementsByClassName('message');
          if (messageElements[lastUserMessageIndex]) {
            messageElements[lastUserMessageIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    }
  }, [messages]);

  const toggleBodyView = () => {
    setShowBackView(!showBackView);
    setSelectedMuscle(null);
  };

  const handleMuscleClick = (muscleId) => {
    setSelectedMuscle(muscleId);
    
    const currentView = showBackView ? muscleGroups.back : muscleGroups.front;
    const muscleData = currentView.find(muscle => muscle.id === muscleId);
    
    if (muscleData) {
      const userMessage = {
        sender: 'user',
        text: `I want to work on my ${muscleData.name}.`
      };
      
      const aiResponse = {
        sender: 'ai',
        text: `Great choice! ${muscleData.description} Here are some recommended services for ${muscleData.name.toLowerCase()} development:`
      };

      const serviceCardsMessage = {
        sender: 'ai',
        isServiceCards: true,
        services: muscleData.services
      };
      
      setMessages([...messages, userMessage, aiResponse, serviceCardsMessage]);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const userMessage = {
      sender: 'user',
      text: inputText
    };
    setMessages([...messages, userMessage]);
    
    const currentView = showBackView ? muscleGroups.back : muscleGroups.front;
    const matchedMuscle = findMuscleFromText(inputText, currentView);
    
    setTimeout(() => {
      if (matchedMuscle) {
        const aiResponse = {
          sender: 'ai',
          text: generateAIResponse(inputText, matchedMuscle)
        };

        const serviceCardsMessage = {
          sender: 'ai',
          isServiceCards: true,
          services: matchedMuscle.services
        };
        
        setMessages(prev => [...prev, aiResponse, serviceCardsMessage]);
      } else {
        const aiResponse = {
          sender: 'ai',
          text: "I understand you're interested in working out. Could you please specify which muscle group you'd like to focus on? You can either tell me the muscle name or click on the body diagram."
        };
        setMessages(prev => [...prev, aiResponse]);
      }
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
              <div className="chat-messages" ref={chatContainerRef}>
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.sender}`}>
                    {msg.isServiceCards ? (
                      <div className="service-cards-container">
                        {msg.services.map((service, serviceIndex) => (
                          <ServiceCard key={serviceIndex} service={service} />
                        ))}
                      </div>
                    ) : (
                      <div className="message-bubble">
                        {msg.text}
                      </div>
                    )}
                  </div>
                ))}
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
                  {(showBackView ? muscleGroups.back : muscleGroups.front).map((muscle) => (
                    <div 
                      key={muscle.id}
                      className={`legend-item ${selectedMuscle === muscle.id ? 'selected' : ''}`}
                      onClick={() => handleMuscleClick(muscle.id)}
                    >
                      {muscle.name}
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