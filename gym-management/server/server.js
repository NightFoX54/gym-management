require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Gemini API URL and API Key
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("⚠️ WARNING: GEMINI_API_KEY is not set in environment variables!");
} else {
  console.log("✅ Gemini API Key configured successfully");
}

/**
 * Makes a direct call to the Gemini API
 * @param {string} prompt - The prompt to send
 * @param {Object} options - Configuration options
 * @returns {Promise<string>} - The generated text
 */
async function callGeminiApi(prompt, options = {}) {
  console.log(`Processing Gemini request: "${prompt.substring(0, 50)}..."`);
  
  try {
    const payload = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxTokens || 800,
        topK: options.topK || 40,
        topP: options.topP || 0.95,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };
    
    console.log("Sending request to Gemini API...");
    const response = await axios.post(GEMINI_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
        'x-goog-api-key': API_KEY
      },
      timeout: 30000 // 30 seconds timeout
    });
    
    // Handle the response
    if (!response.data.candidates || response.data.candidates.length === 0) {
      throw new Error('No response generated');
    }
    
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    throw error;
  }
}

// Helper function to format prompt with muscle context
const formatPromptWithContext = (userPrompt, muscleGroup) => {
  if (!muscleGroup) return userPrompt;
  
  return `
As a fitness expert at GymFlex gym, provide advice about ${muscleGroup.name}:
${userPrompt}

Information about this muscle: ${muscleGroup.description}

Give a helpful, motivating, and accurate response about exercises, training tips, or general information related to ${muscleGroup.name}.
Focus on practical advice and limit your response to 3-4 paragraphs maximum.
`;
};

// Gemini API endpoint
app.post('/api/gemini', async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({
        error: 'Gemini API key not configured. Please check server configuration.'
      });
    }

    const { prompt, muscleGroup, options = {} } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    console.log(`Received prompt: "${prompt.substring(0, 50)}..."`);
    
    // Format prompt with context if muscle group is provided
    const formattedPrompt = muscleGroup 
      ? formatPromptWithContext(prompt, muscleGroup) 
      : prompt;
    
    // Call the Gemini API
    const responseText = await callGeminiApi(formattedPrompt, options);
    
    // Send back the response
    res.json({ response: responseText });
  } catch (error) {
    console.error('Error processing request:', error.message);
    
    res.status(500).json({ 
      error: error.message || 'Failed to generate response from AI'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API endpoint available at http://localhost:${PORT}/api/gemini`);
});
