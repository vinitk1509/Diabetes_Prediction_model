// src/PredictionForm.js
import React, { useState } from "react";
import axios from "axios";

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    pregnancies: "",
    glucose: "",
    blood_pressure: "",
    skin_thickness: "",
    insulin: "",
    bmi: "",
    age: "",
    gender: "",
    pcos: "",
    exercise: "",
    ethnicity: "",
    diabetes_pedigree_function: "",
  });

  const [prediction, setPrediction] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData);
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Error fetching prediction:", error);
    }
  };

  return (
    <div>
      <h2>Diabetes Prediction</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Pregnancies:</label>
          <input
            type="number"
            name="pregnancies"
            value={formData.pregnancies}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Glucose:</label>
          <input
            type="number"
            name="glucose"
            value={formData.glucose}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Blood Pressure:</label>
          <input
            type="number"
            name="blood_pressure"
            value={formData.blood_pressure}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Skin Thickness:</label>
          <input
            type="number"
            name="skin_thickness"
            value={formData.skin_thickness}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Insulin:</label>
          <input
            type="number"
            name="insulin"
            value={formData.insulin}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>BMI:</label>
          <input
            type="number"
            name="bmi"
            value={formData.bmi}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label>PCOS:</label>
          <select
            name="pcos"
            value={formData.pcos}
            onChange={handleChange}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div>
          <label>Exercise:</label>
          <select
            name="exercise"
            value={formData.exercise}
            onChange={handleChange}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div>
          <label>Ethnicity:</label>
          <select
            name="ethnicity"
            value={formData.ethnicity}
            onChange={handleChange}
          >
            <option value="caucasian">Caucasian</option>
            <option value="american">American</option>
            <option value="asian">Asian</option>
            <option value="hispanic">Hispanic</option>
            <option value="british">British</option>
          </select>
        </div>
        <div>
          <label>Diabetes Pedigree Function:</label>
          <input
            type="number"
            name="diabetes_pedigree_function"
            value={formData.diabetes_pedigree_function}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Predict</button>
      </form>

      {prediction && <h3>{prediction}</h3>}
    </div>
  );
};

export default PredictionForm;
