const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to generate a context-aware prompt based on the muscle group
const getEnhancedPrompt = (userPrompt, muscleGroup) => {
  if (!muscleGroup) return userPrompt;
  
  const contextPrompt = `
You are a fitness expert assistant for GymFlex, a premium gym and fitness center. 
The user is asking about ${muscleGroup.name}. Here's some information about this muscle:
${muscleGroup.description}

GymFlex offers these services related to ${muscleGroup.name}:
${muscleGroup.services.map(s => `- ${s.name}: ${s.description}`).join('\n')}

Based on this context, please provide a helpful, accurate and motivating response to the following question.
User question: ${userPrompt}
`;
  
  return contextPrompt;
};

router.post('/', async (req, res) => {
  try {
    const { prompt, muscleGroup } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    // Generate enhanced prompt with muscle group context if available
    const enhancedPrompt = muscleGroup ? getEnhancedPrompt(prompt, muscleGroup) : prompt;
    
    // Configure the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Generate content
    const result = await model.generateContent(enhancedPrompt);
    const response = result.response.text();
    
    res.json({ response });
  } catch (error) {
    console.error('Error with Gemini API:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      details: error.message
    });
  }
});

module.exports = router;
