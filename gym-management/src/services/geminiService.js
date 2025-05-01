import axios from 'axios';

// Maintain conversation history for contextual responses
let conversationHistory = [];

// Fallback responses when API is unavailable
const FALLBACK_RESPONSES = {
  chest: "To effectively train your chest, focus on compound movements like bench press (flat, incline, and decline), push-ups, and dips. Add isolation exercises such as dumbbell flyes and cable crossovers to target specific areas. For optimal growth, train chest 2-3 times per week with progressive overload - gradually increasing weight or reps. Always maintain proper form: keep shoulders back, engage your core, and avoid excessive arching. Balance your training with back exercises to prevent postural imbalances. Allow 48-72 hours recovery between chest workouts for muscle repair and growth.",
  biceps: "For biceps development, focus on exercises like barbell and dumbbell curls, hammer curls, and chin-ups. Vary your grip width and hand positions to target different parts of the biceps. Use controlled movements with full range of motion, avoiding momentum that recruits other muscles. For best results, train biceps 2-3 times weekly, either as part of an arm day or after back workouts. Remember that pulling exercises also work your biceps indirectly. Gradually increase weight or reps over time, and ensure adequate protein intake for muscle recovery and growth.",
  abs: "To train your abs effectively, incorporate a variety of exercises targeting all regions: crunches and sit-ups for upper abs, leg raises for lower abs, and Russian twists for obliques. Add planks and hollow holds for core stability. For best results, train abs 3-4 times weekly with progressive overload. Remember that visible abs require low body fat, so combine targeted training with proper nutrition and cardio. Focus on quality over quantity - slow, controlled movements with proper form create more tension than rushed repetitions. Finally, include rotational movements to develop functional core strength applicable to everyday activities and sports.",
  back: "To build a strong back, incorporate exercises that target all areas: pull-ups and lat pulldowns for width, rows for thickness, and deadlifts for overall back development. Focus on form by initiating movements with your back muscles rather than arms, keeping shoulders down and chest up. Train your back 2-3 times weekly, allowing adequate recovery. Use a variety of grips (wide, narrow, overhand, underhand) to target different muscles. Remember to include lower back exercises like hyperextensions for complete development. A strong back improves posture, reduces injury risk, and creates the coveted V-taper appearance.",
  shoulders: "For well-developed shoulders, focus on all three deltoid heads with exercises like overhead press (front), lateral raises (side), and reverse flyes (rear). Include rotator cuff exercises for joint health and stability. Train shoulders 2-3 times weekly, being mindful that they're also engaged during chest and back workouts. Use moderate weights with strict form to prevent injury in this vulnerable joint. Include both compound movements for overall mass and isolation exercises for specific development. For balanced development, emphasize rear delts which are often neglected but crucial for good posture and shoulder health.",
  legs: "For comprehensive leg development, focus on compound movements like squats, deadlifts, and lunges that target multiple muscle groups. Include isolation exercises such as leg extensions, hamstring curls, and calf raises for specific areas. Train legs 1-2 times weekly with sufficient intensity, allowing 48-72 hours recovery. Progress gradually with weight to avoid injury, always maintaining proper form - keep your knees aligned with toes and avoid excessive forward lean. Don't neglect any area; balanced development prevents injuries and imbalances. Finally, ensure adequate nutrition and protein intake to support recovery from these demanding workouts.",
  default: "To effectively train any muscle group, follow these key principles: 1) Progressive overload - gradually increase weight, reps or time under tension to continually challenge your muscles. 2) Proper form - focus on quality movement patterns rather than heavy weights with poor execution. 3) Consistency - regular training stimulus is essential for progress. 4) Recovery - allow 48-72 hours between training the same muscle group. 5) Nutrition - consume adequate protein (1.6-2.2g per kg of body weight) and overall calories to support your goals. Consider consulting with one of our personal trainers for a customized program tailored to your specific needs and body type."
};

/**
 * Reset the conversation history
 */
export const resetConversation = () => {
  conversationHistory = [];
  console.log('Conversation history reset');
};

/**
 * Get the Gemini API key from available sources
 */
const getApiKey = () => {
  return process.env.REACT_APP_GEMINI_API_KEY || 
         window.GEMINI_API_KEY || 
         localStorage.getItem('GEMINI_API_KEY') ||
         sessionStorage.getItem('GEMINI_API_KEY');
};

/**
 * Save API key to localStorage
 * @param {string} key - The API key to save
 */
export const saveApiKey = (key) => {
  if (key && key.trim()) {
    localStorage.setItem('GEMINI_API_KEY', key.trim());
    window.GEMINI_API_KEY = key.trim();
    return true;
  }
  return false;
};

/**
 * Clear the saved API key
 */
export const clearApiKey = () => {
  localStorage.removeItem('GEMINI_API_KEY');
  window.GEMINI_API_KEY = null;
  return true;
};

/**
 * Clean and format the AI response for better readability
 * @param {string} text - The raw text from the Gemini API
 * @returns {string} - The cleaned and formatted text
 */
const cleanResponse = (text) => {
  if (!text) return '';
  
  // Replace markdown bullet points with clean formatting
  let cleaned = text
    // Replace markdown bullet points with proper bullet points or nothing
    .replace(/\s*\*\s+/g, '\n• ')
    .replace(/\s*\-\s+/g, '\n• ')
    
    // Remove markdown formatting for bold and italic
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    
    // Remove excessive whitespace and line breaks
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  
  // Fix remaining bullet point issues  
  cleaned = cleaned
    // Remove first bullet if it starts with one (we already have proper spacing)
    .replace(/^• /, '')
    
    // Ensure proper spacing around bullet points
    .replace(/([.!?])\s*\n• /g, '$1\n\n• ');
  
  return cleaned;
};

/**
 * Generate a response from the Gemini API
 * @param {string} prompt - The user's message
 * @param {Object} muscleGroup - Optional muscle group context
 * @param {Object} options - Additional configuration options
 * @returns {Promise<string>} - The cleaned AI response
 */
export const generateGeminiResponse = async (prompt, muscleGroup = null, options = {}) => {
  try {
    // Add user message to conversation history
    conversationHistory.push({ role: 'user', text: prompt });
    
    // Format the prompt with context
    const formattedPrompt = formatPromptWithContext(prompt, muscleGroup, conversationHistory);
    
    // Get API key from environment variables
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('API key not found. Please add REACT_APP_GEMINI_API_KEY to your .env file.');
    }
    
    console.log('Sending request to Gemini API...');
    
    // Make direct API call using the format specified in your curl example
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: formattedPrompt
          }]
        }],
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxTokens || 800,
          topK: options.topK || 40,
          topP: options.topP || 0.95,
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract text from response
    if (!data.candidates || 
        !data.candidates[0] || 
        !data.candidates[0].content || 
        !data.candidates[0].content.parts || 
        !data.candidates[0].content.parts[0]) {
      throw new Error('Invalid response structure from Gemini API');
    }
    
    const rawText = data.candidates[0].content.parts[0].text;
    
    // Clean and format the response
    const cleanedResponse = cleanResponse(rawText);
    
    // Add response to conversation history
    conversationHistory.push({ role: 'assistant', text: cleanedResponse });
    
    // Keep conversation history to a reasonable size
    if (conversationHistory.length > 8) {
      conversationHistory = conversationHistory.slice(-8);
    }
    
    return cleanedResponse;
  } catch (error) {
    console.error('Error with Gemini API:', error);
    throw new Error(error.message || 'Failed to get response from Gemini API. Please try again later.');
  }
};

/**
 * Handle fallback responses when API is unavailable
 * @param {string} prompt - The user's message
 * @param {Object} muscleGroup - The muscle group data
 * @returns {string} - A fallback response
 */
const handleFallbackResponse = (prompt, muscleGroup) => {
  let response;
  
  if (muscleGroup) {
    // Get response specific to muscle group
    response = FALLBACK_RESPONSES[muscleGroup.id.toLowerCase()] || FALLBACK_RESPONSES.default;
  } else {
    // Try to detect muscle group from text
    const promptLower = prompt.toLowerCase();
    if (promptLower.includes('chest') || promptLower.includes('pec')) {
      response = FALLBACK_RESPONSES.chest;
    } else if (promptLower.includes('bicep') || promptLower.includes('arm')) {
      response = FALLBACK_RESPONSES.biceps;
    } else if (promptLower.includes('ab') || promptLower.includes('core')) {
      response = FALLBACK_RESPONSES.abs;
    } else if (promptLower.includes('shoulder') || promptLower.includes('delt')) {
      response = FALLBACK_RESPONSES.shoulders;
    } else if (promptLower.includes('leg') || promptLower.includes('quad') || promptLower.includes('hamstring')) {
      response = FALLBACK_RESPONSES.legs;
    } else if (promptLower.includes('back') || promptLower.includes('lat')) {
      response = FALLBACK_RESPONSES.back;
    } else {
      response = FALLBACK_RESPONSES.default;
    }
  }
  
  // For follow-up questions, provide more varied responses
  if (conversationHistory.length > 1) {
    const lastAssistantResponse = conversationHistory.filter(msg => msg.role === 'assistant').pop();
    if (lastAssistantResponse) {
      // Avoid repeating exactly the same response
      if (prompt.toLowerCase().includes('why') || prompt.toLowerCase().includes('how')) {
        response = "That's a good question. " + response;
      } else if (prompt.toLowerCase().includes('thanks') || prompt.toLowerCase().includes('thank you')) {
        response = "You're welcome! Let me know if you have any other questions about your fitness journey.";
      } else if (prompt.toLowerCase().includes('more') || prompt.toLowerCase().includes('detail')) {
        response = "To elaborate further: " + response;
      }
    }
  }
  
  // Add to conversation history
  conversationHistory.push({ role: 'assistant', text: response });
  
  return response;
};

/**
 * Format the prompt to provide proper context to the AI
 * @param {string} prompt - The user's message
 * @param {Object} muscleGroup - The muscle group data
 * @param {Array} history - Conversation history
 * @returns {string} - The formatted prompt
 */
const formatPromptWithContext = (prompt, muscleGroup, history) => {
  // Base system prompt defining the AI's role and response style
  let formattedPrompt = `You are a fitness expert assistant for GymFlex, a premium gym and fitness center. 
Provide helpful, accurate, and motivating responses about fitness and exercise.
Use conversational, clear language without markdown formatting.
Avoid using bullet points with * or - symbols.
Format your response with clean paragraphs and natural transitions.
If you need to list items, use simple numbering or plain text formatting.
Keep your responses friendly but professional.
`;

  // Add muscle group context if available
  if (muscleGroup) {
    formattedPrompt += `\nThe user is asking about ${muscleGroup.name}.
Information about this muscle: ${muscleGroup.description}
`;
  }

  // Add conversation context if this isn't the first message
  if (history.length > 1) {
    formattedPrompt += "\nPrevious conversation:\n";
    
    // Add up to the last 5 messages for context
    const recentHistory = history.slice(-6, -1);
    for (const entry of recentHistory) {
      formattedPrompt += `${entry.role === 'user' ? 'User' : 'Assistant'}: ${entry.text}\n\n`;
    }
  }
  
  // Add the current prompt
  formattedPrompt += `\nUser: ${prompt}\n\nAssistant: `;
  
  return formattedPrompt;
};
