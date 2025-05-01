# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# GymFlex Management System

## AI Assistant Setup

The AI Assistant feature uses Google's Gemini API. There are several ways to set up your API key:

### Option 1: Environment Variable (recommended for development)
1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a `.env` file in the root directory
3. Add your API key: `REACT_APP_GEMINI_API_KEY=your_key_here`
4. Restart the application

### Option 2: Browser Console (quick testing)
If you want to test without restarting:
1. Open your browser's Developer Tools (F12)
2. In the console, enter: `setGeminiApiKey('your-key-here')`
3. Refresh the page

### Option 3: Edit HTML (permanent setup)
1. Open `public/index.html` 
2. Find the script section with `window.GEMINI_API_KEY`
3. Uncomment and add your key
4. Rebuild the application

## Fallback Mode

If no API key is found or the API is unavailable, the system will use pre-defined responses for basic functionality.

## Troubleshooting AI Assistant

If you see "Failed to get response from Gemini API" messages:
- Check that your API key is correct and has proper permissions
- Ensure you have internet connectivity
- Verify API usage limits haven't been exceeded
- Try the fallback mode by deliberately not setting an API key

## Using the AI Assistant

1. Click on the AI Assistant button in the lower right corner
2. Use the body diagram to select a muscle group, or type a question
3. The AI will provide exercise recommendations and training tips
4. Relevant gym services will be displayed as cards after the AI response

## Development

- To run the app: `npm start`
- To build for production: `npm run build`
