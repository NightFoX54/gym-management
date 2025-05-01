import React, { useState, useEffect, useRef } from 'react';
import '../styles/AiAssistant.css';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import frontBodyDiagramImage from '../assets/images/front-body-diagram.png';
import backBodyDiagramImage from '../assets/images/back-body-diagram.png';
import { generateGeminiResponse, resetConversation } from '../services/geminiService';

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

// Small change to default messages to explain API key setup
const defaultMessages = [
  {
    sender: 'ai',
    text: "Hello! I'm your GymFlex AI Assistant powered by Google Gemini. I can help you find the perfect services for your fitness goals. Toggle between front and back body views, click on a muscle group, or ask me any fitness-related questions!"
  }
];

// Update ServiceCard component to use the new theme color
const ServiceCard = ({ service }) => (
  <motion.div 
    className="service-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={{ 
      scale: 1.03, 
      boxShadow: "0 10px 20px rgba(255, 71, 87, 0.15)" 
    }}
  >
    <h4>{service.name}</h4>
    <p>{service.description}</p>
    <motion.a 
      href={`/services/${service.name.toLowerCase().replace(/\s+/g, '-')}`} 
      className="service-link"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Learn More
    </motion.a>
  </motion.div>
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
  const [selectedButtons, setSelectedButtons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const chatControls = useAnimation();
  
  // Reset conversation and API error when component is opened
  useEffect(() => {
    if (isOpen) {
      resetConversation();
      setApiError(null);
      chatControls.start("visible");
    }
  }, [isOpen, chatControls]);

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

  // Message animation variants
  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
  };
  
  // Thinking animation variants for the loading dots
  const thinkingVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const toggleBodyView = () => {
    setShowBackView(!showBackView);
    setSelectedMuscle(null);
    setSelectedButtons([]);
  };

  const handleMuscleClick = async (muscleId, buttonId = null) => {
    setSelectedMuscle(muscleId);
    
    // If clicked from legend, select both sides
    if (!buttonId) {
      const sides = ['left', 'right', 'front-left', 'front-right'];
      const selectedIds = sides.map(side => `${muscleId}-${side}`).filter(id => 
        document.querySelector(`.body-part-button.${id}`)
      );
      // If no sided buttons found, just use the muscleId (for single buttons like 'chest', 'back', etc.)
      setSelectedButtons(selectedIds.length > 0 ? selectedIds : [muscleId]);
    } else {
      // If clicked from body diagram, select only that button
      setSelectedButtons([buttonId]);
    }
    
    const currentView = showBackView ? muscleGroups.back : muscleGroups.front;
    const muscleData = currentView.find(muscle => muscle.id === muscleId);
    
    if (muscleData) {
      const userMessage = {
        sender: 'user',
        text: `I want to work on my ${muscleData.name}.`
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      setIsLoading(true);
      setApiError(null);
      
      // First show thinking indicator
      const thinkingMessage = {
        sender: 'ai',
        text: `Analyzing the best training strategies for ${muscleData.name}...`,
        isThinking: true
      };
      
      setMessages(prev => [...prev, thinkingMessage]);
      
      try {
        const prompt = `I want to work on my ${muscleData.name}. Can you tell me about some effective exercises and give me some training tips?`;
        
        console.log('Generating response for muscle:', muscleData.name);
        
        // Make the API call without retries to avoid duplicate entries in conversation history
        const aiResponseText = await generateGeminiResponse(prompt, muscleData, {
          temperature: 0.7,
          maxTokens: 600,
          topP: 0.92
        });
        
        // Remove thinking message
        setMessages(prev => prev.filter(msg => !msg.isThinking));
        
        const aiResponse = {
          sender: 'ai',
          text: aiResponseText
        };
        
        setMessages(prev => [...prev, aiResponse]);
        
        // Add service cards after AI response
        const serviceCardsMessage = {
          sender: 'ai',
          isServiceCards: true,
          services: muscleData.services
        };
        
        setMessages(prev => [...prev, serviceCardsMessage]);
      } catch (error) {
        console.error("Error getting AI response:", error);
        setApiError(error.message);
        
        // Remove thinking message
        setMessages(prev => prev.filter(msg => !msg.isThinking));
        
        // Use a fallback response when API fails
        const errorMessage = {
          sender: 'ai',
          text: `I couldn't get specific information about ${muscleData.name} training at the moment. ${error.message}`
        };
        
        setMessages(prev => [...prev, errorMessage]);
        
        // Still show service cards even if AI fails
        const serviceCardsMessage = {
          sender: 'ai',
          isServiceCards: true,
          services: muscleData.services
        };
        
        setMessages(prev => [...prev, serviceCardsMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    
    const userMessage = {
      sender: 'user',
      text: inputText
    };
    
    // Store user input before clearing
    const userInput = inputText;
    setInputText(''); // Clear input immediately for better UX
    
    setMessages(prev => [...prev, userMessage]);
    
    setIsLoading(true);
    setApiError(null);
    
    const currentView = showBackView ? muscleGroups.back : muscleGroups.front;
    const matchedMuscle = findMuscleFromText(userInput, currentView);
    
    // Add thinking message with custom text based on query type
    let thinkingText = 'Thinking...';
    if (matchedMuscle) {
      thinkingText = `Analyzing information about ${matchedMuscle.name}...`;
    } else if (userInput.toLowerCase().includes('exercise') || userInput.toLowerCase().includes('workout')) {
      thinkingText = 'Finding the best exercises for you...';
    } else if (userInput.toLowerCase().includes('diet') || userInput.toLowerCase().includes('nutrition')) {
      thinkingText = 'Researching nutrition information...';
    }
    
    const thinkingMessage = {
      sender: 'ai',
      text: thinkingText,
      isThinking: true
    };
    
    setMessages(prev => [...prev, thinkingMessage]);
    
    try {
      // Make a single API call to avoid duplicate entries in conversation history
      const aiResponseText = await generateGeminiResponse(userInput, matchedMuscle, {
        temperature: matchedMuscle ? 0.7 : 0.8,
        maxTokens: 800
      });
      
      // Remove thinking message
      setMessages(prev => prev.filter(msg => !msg.isThinking));
      
      const aiResponse = {
        sender: 'ai',
        text: aiResponseText
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      // If a muscle was matched, also show relevant services
      if (matchedMuscle) {
        const serviceCardsMessage = {
          sender: 'ai',
          isServiceCards: true,
          services: matchedMuscle.services
        };
        
        setMessages(prev => [...prev, serviceCardsMessage]);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      setApiError(error.message);
      
      // Remove thinking message
      setMessages(prev => prev.filter(msg => !msg.isThinking));
      
      const errorMessage = {
        sender: 'ai',
        text: error.message || "I'm sorry, I couldn't process your request. Please try again later."
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Still show services if we matched a muscle
      if (matchedMuscle) {
        const serviceCardsMessage = {
          sender: 'ai',
          isServiceCards: true,
          services: matchedMuscle.services
        };
        
        setMessages(prev => [...prev, serviceCardsMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderBodyPartButtons = () => {
    const currentView = showBackView ? muscleGroups.back : muscleGroups.front;
    const buttonClasses = (muscleId, buttonId) => 
      `body-part-button ${buttonId} ${selectedButtons.includes(buttonId) ? 'selected' : ''}`;

    if (showBackView) {
      return (
        <>
          <button 
            className={buttonClasses('back', 'back')}
            onClick={() => handleMuscleClick('back', 'back')}
            aria-label="Back muscles"
          />
          <button 
            className={buttonClasses('triceps', 'triceps-left')}
            onClick={() => handleMuscleClick('triceps', 'triceps-left')}
            aria-label="Left triceps"
          />
          <button 
            className={buttonClasses('triceps', 'triceps-right')}
            onClick={() => handleMuscleClick('triceps', 'triceps-right')}
            aria-label="Right triceps"
          />
          <button 
            className={buttonClasses('trapezius', 'trapezius')}
            onClick={() => handleMuscleClick('trapezius', 'trapezius')}
            aria-label="Trapezius"
          />
          <button 
            className={buttonClasses('lower_back', 'lower-back')}
            onClick={() => handleMuscleClick('lower_back', 'lower-back')}
            aria-label="Lower back"
          />
          <button 
            className={buttonClasses('glutes', 'glutes')}
            onClick={() => handleMuscleClick('glutes', 'glutes')}
            aria-label="Glutes"
          />
          <button 
            className={buttonClasses('hamstrings', 'hamstrings-left')}
            onClick={() => handleMuscleClick('hamstrings', 'hamstrings-left')}
            aria-label="Left hamstrings"
          />
          <button 
            className={buttonClasses('hamstrings', 'hamstrings-right')}
            onClick={() => handleMuscleClick('hamstrings', 'hamstrings-right')}
            aria-label="Right hamstrings"
          />
          <button 
            className={buttonClasses('calves', 'calves-left')}
            onClick={() => handleMuscleClick('calves', 'calves-left')}
            aria-label="Left calf"
          />
          <button 
            className={buttonClasses('calves', 'calves-right')}
            onClick={() => handleMuscleClick('calves', 'calves-right')}
            aria-label="Right calf"
          />
        </>
      );
    } else {
      return (
        <>
          <button 
            className={buttonClasses('chest', 'chest')}
            onClick={() => handleMuscleClick('chest', 'chest')}
            aria-label="Chest"
          />
          <button 
            className={buttonClasses('biceps', 'biceps-left')}
            onClick={() => handleMuscleClick('biceps', 'biceps-left')}
            aria-label="Left biceps"
          />
          <button 
            className={buttonClasses('biceps', 'biceps-right')}
            onClick={() => handleMuscleClick('biceps', 'biceps-right')}
            aria-label="Right biceps"
          />
          <button 
            className={buttonClasses('abs', 'abs')}
            onClick={() => handleMuscleClick('abs', 'abs')}
            aria-label="Abdominals"
          />
          <button 
            className={buttonClasses('shoulders', 'shoulders-left')}
            onClick={() => handleMuscleClick('shoulders', 'shoulders-left')}
            aria-label="Left shoulder"
          />
          <button 
            className={buttonClasses('shoulders', 'shoulders-right')}
            onClick={() => handleMuscleClick('shoulders', 'shoulders-right')}
            aria-label="Right shoulder"
          />
          <button 
            className={buttonClasses('forearms', 'forearms-left')}
            onClick={() => handleMuscleClick('forearms', 'forearms-left')}
            aria-label="Left forearm"
          />
          <button 
            className={buttonClasses('forearms', 'forearms-right')}
            onClick={() => handleMuscleClick('forearms', 'forearms-right')}
            aria-label="Right forearm"
          />
          <button 
            className={buttonClasses('quads', 'quads-left')}
            onClick={() => handleMuscleClick('quads', 'quads-left')}
            aria-label="Left quadriceps"
          />
          <button 
            className={buttonClasses('quads', 'quads-right')}
            onClick={() => handleMuscleClick('quads', 'quads-right')}
            aria-label="Right quadriceps"
          />
          <button 
            className={buttonClasses('calves', 'calves-front-left')}
            onClick={() => handleMuscleClick('calves', 'calves-front-left')}
            aria-label="Left calf"
          />
          <button 
            className={buttonClasses('calves', 'calves-front-right')}
            onClick={() => handleMuscleClick('calves', 'calves-front-right')}
            aria-label="Right calf"
          />
        </>
      );
    }
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
          <motion.div 
            className="ai-assistant-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              background: `linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)`
            }}
          >
            <h2>GymFlex AI Assistant</h2>
            <div className="header-controls">
              {apiError && (
                <motion.span 
                  className="api-error-indicator" 
                  title={apiError}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                >
                  ⚠️ API Error
                </motion.span>
              )}
              <motion.button 
                className="close-button" 
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </motion.button>
            </div>
          </motion.div>
          
          {/* Show API error message if there is one */}
          <AnimatePresence>
            {apiError && (
              <motion.div 
                className="api-error-message"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p>
                  <strong>API Error:</strong> {apiError}
                </p>
                <p className="api-error-help">
                  Make sure you have set the REACT_APP_GEMINI_API_KEY in your .env file and restart the application.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="ai-assistant-content">
            <motion.div 
              className="chat-section"
              initial="hidden"
              animate={chatControls}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
            >
              <motion.div 
                className="chat-messages" 
                ref={chatContainerRef}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 }
                }}
              >
                <AnimatePresence initial={false}>
                  {messages.map((msg, index) => (
                    <motion.div 
                      key={index} 
                      className={`message ${msg.sender}`}
                      layout
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={messageVariants}
                      transition={{ 
                        type: 'spring', 
                        stiffness: 500, 
                        damping: 30, 
                        delay: msg.isServiceCards ? 0.2 : 0 
                      }}
                    >
                      {msg.isServiceCards ? (
                        <motion.div 
                          className="service-cards-container"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
                        >
                          {msg.services.map((service, serviceIndex) => (
                            <ServiceCard key={serviceIndex} service={service} />
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div 
                          className="message-bubble"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {msg.text}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                <AnimatePresence>
                  {isLoading && (
                    <motion.div 
                      className="message ai"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={thinkingVariants}
                    >
                      <motion.div className="message-bubble loading">
                        <motion.span 
                          animate={{ scale: [1, 1.5, 1] }} 
                          transition={{ repeat: Infinity, duration: 1 }}
                        >.</motion.span>
                        <motion.span 
                          animate={{ scale: [1, 1.5, 1] }} 
                          transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                        >.</motion.span>
                        <motion.span 
                          animate={{ scale: [1, 1.5, 1] }} 
                          transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                        >.</motion.span>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div ref={messagesEndRef} />
              </motion.div>
              
              <motion.form 
                className="chat-input" 
                onSubmit={handleSendMessage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask about specific muscle groups..."
                  disabled={isLoading}
                  whileFocus={{ boxShadow: "0 0 0 2px rgba(80, 80, 230, 0.4)" }}
                />
                <motion.button 
                  type="submit" 
                  disabled={isLoading || !inputText.trim()}
                  whileHover={{ scale: 1.05, backgroundColor: "#4a4aff" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {isLoading ? (
                    <motion.i 
                      className="fas fa-spinner fa-spin"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                  ) : (
                    'Send'
                  )}
                </motion.button>
              </motion.form>
            </motion.div>
            
            <motion.div 
              className="body-selector-section"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="body-view-toggle">
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {showBackView ? "Back View" : "Front View"}
                </motion.h3>
                <motion.button 
                  className="toggle-view-button" 
                  onClick={toggleBodyView}
                  aria-label={showBackView ? "Switch to front view" : "Switch to back view"}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showBackView ? "View Front Body" : "View Back Body"}
                  <motion.i 
                    className={`fas fa-sync-alt ${showBackView ? "rotate-left" : "rotate-right"}`}
                    animate={{ rotate: showBackView ? 0 : 360 }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.button>
              </div>
              
              <div className="body-parts-container">
                <motion.div 
                  className="body-parts-legend"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, staggerChildren: 0.05, delayChildren: 0.7 }}
                >
                  {(showBackView ? muscleGroups.back : muscleGroups.front).map((muscle) => (
                    <motion.div 
                      key={muscle.id}
                      className={`legend-item ${selectedMuscle === muscle.id ? 'selected' : ''}`}
                      onClick={() => handleMuscleClick(muscle.id)}
                      whileHover={{ scale: 1.05, backgroundColor: isDarkMode ? "#3a3a3a" : "#f0f0f0" }}
                      whileTap={{ scale: 0.95 }}
                      animate={{ 
                        backgroundColor: selectedMuscle === muscle.id 
                          ? (isDarkMode ? "#4a4a4a" : "#e0e0e0") 
                          : "transparent"
                      }}
                    >
                      {muscle.name}
                    </motion.div>
                  ))}
                </motion.div>

                <div className="body-diagram-container">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={showBackView ? "back" : "front"}
                      className="diagram-wrapper"
                      initial={{ opacity: 0, rotateY: showBackView ? -90 : 90 }}
                      animate={{ opacity: 1, rotateY: 0 }}
                      exit={{ opacity: 0, rotateY: showBackView ? 90 : -90 }}
                      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                    >
                      <motion.img 
                        src={showBackView ? backBodyDiagramImage : frontBodyDiagramImage} 
                        alt={showBackView ? "Back body diagram" : "Front body diagram"} 
                        className="body-diagram-image"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                      />
                      {renderBodyPartButtons()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AiAssistant;