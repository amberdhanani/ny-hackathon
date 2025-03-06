# Chatter Check

### Built for the NY Ed Tech Hackathon

**Team Members:**  
🧑‍💻 **Amber Dhanani** – Code Ninja with AI Superpowers  
🎨 **Claudia Canales** – Visual Wizard  
🔬 **Rae McGee** – Researcher  
🖌 **Marcin Siekaniec** – UX Guy

## About the Project

Chatter Check is a React-based application designed to enhance conversations through AI-powered insights. Built during the **NY Ed Tech Hackathon**, it leverages Firebase Cloud Functions for backend processing and integrates OpenAI’s API to deliver smart, real-time feedback.

## Getting Started

### Frontend Setup

To start the frontend in development mode:

```sh
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

The app will automatically reload on edits, and lint errors will appear in the console.

### Cloud Functions

Chatter Check includes Firebase Cloud Functions that power AI-based features. To run them locally:

```sh
cd functions
npm run serve
```

### Environment Variables

To enable OpenAI integration, create a `.env` file inside `functions/src` with the following content:

```
OPENAI_API_KEY=your-api-key-here
```

Replace `your-api-key-here` with your actual OpenAI API key.

## Additional Notes

- Ensure you have the Firebase CLI installed and properly configured.
- If deploying cloud functions, follow Firebase deployment guidelines.
- Chatter Check was designed with a focus on user experience, AI-driven insights, and seamless interaction.
