// src/App.js
import React from 'react';
import PredictionForm from './PredictionForm';  // Import the PredictionForm component

function App() {
  return (
    <div className="App">
      <h1>Welcome to Diabetes Prediction App</h1>
      <PredictionForm />  {/* Use the PredictionForm component */}
    </div>
  );
}

export default App;
