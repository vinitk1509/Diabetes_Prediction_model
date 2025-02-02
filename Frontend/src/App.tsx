import React, { useState, useEffect } from 'react';
import { Bot, Send, ArrowLeft, Moon, Sun } from 'lucide-react';
import axios from 'axios';

interface FormData {
  age: number;
  gender: string;
  pregnancies?: number;
  pcos?: boolean;
  glucose: number;
  bloodPressure: number;
  skinThickness: number;
  insulin: number;
  bmi: number;
  exercise: string;
  ethnicity: string;
  diabetesPedigree: number;
}

const initialFormData: FormData = {
  age: 0,
  gender: '',
  glucose: 0,
  bloodPressure: 0,
  skinThickness: 0,
  insulin: 0,
  bmi: 0,
  exercise: '',
  ethnicity: '',
  diabetesPedigree: 0,
  pregnancies: 0,
};

function App() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showIntroPage, setShowIntroPage] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // State for theme

  const questions = [
    { key: 'age', label: 'What is your age?', min: 1, max: 120 },
    { key: 'gender', label: 'What is your gender?', options: ['Male', 'Female'] },
    ...(formData.gender === 'Female'
      ? [
          { key: 'pregnancies', label: 'Number of pregnancies?', min: 0, max: 12 },
          { key: 'pcos', label: 'Do you have PCOS?', options: ['Yes', 'No'] },
        ]
      : []),
    { key: 'glucose', label: 'What is your glucose level? (mg/dL)', min: 0, max: 600, normalRange: '90-120' },
    { key: 'bloodPressure', label: 'What is your blood pressure? (mm Hg)', min: 20, max: 300, normalRange: '70-90' },
    { key: 'skinThickness', label: 'What is your skin thickness? (mm)', min: 0, max: 10, normalRange: '1-2' },
    { key: 'insulin', label: 'What is your insulin level? (mu U/ml)', min: 0, max: 600, normalRange: '15-35' },
    { key: 'bmi', label: 'What is your BMI?', min: 0, max: 50, normalRange: '20-25' },
    { key: 'exercise', label: 'Do you exercise?', options: ['Yes', 'No'] },
    { key: 'ethnicity', label: 'What is your ethnicity?', options: ['Asian', 'African', 'Caucasian', 'Hispanic', 'Other'] },
    { key: 'diabetesPedigree', label: 'What is your diabetes pedigree function?', min: 0.08, max: 100, normalRange: '0.08-1' },
  ];

  useEffect(() => {
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    // Save theme preference in localStorage
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme); // Set the theme on the root HTML element
  }, [theme]);

  const handleInputChange = (value: string | number | boolean) => {
    const currentQuestion = questions[step];
    setError(null);

    // For the options-based questions (like gender, pcos, etc.)
    setFormData((prev) => ({
      ...prev,
      [currentQuestion.key]: value, // update the formData with the selected value
    }));
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      submitData();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  const submitData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData);
      setResult(response.data.prediction);
    } catch (error) {
      console.error('Error submitting data:', error);
      setResult('Error occurred while predicting.');
    } finally {
      setIsLoading(false);
      setShowResult(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleStartAssessment = () => {
    setShowIntroPage(false);
  };

  const restartAssessment = () => {
    setShowResult(false);
    setFormData(initialFormData);
    setStep(0);
  };

  return (
    <div className={`min-h-screen p-4 md:p-6 bg-cover ${theme === 'dark' ? 'bg-gray-900' : 'bg-blue-50 text-gray-900'}`} style={{ backgroundImage: `url('https://images.app.goo.gl/LWRtTN8nEuM9WGp16')` }}>
      {/* Theme Toggle Button */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="absolute top-4 right-4 p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Intro Page */}
      {showIntroPage ? (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-indigo-600 p-4 flex items-center gap-2">
            <Bot className="text-white" size={24} />
            <h1 className="text-xl text-white font-semibold">Diabetes Risk Assessment Bot</h1>
          </div>

          <div className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Welcome to the Diabetes Risk Assessment</h2>
            <p className="text-gray-700 mb-6">
              This tool uses various health metrics to assess your risk of developing diabetes. It includes questions about your
              age, gender, glucose levels, blood pressure, and other key health factors.
            </p>
            <button
              onClick={handleStartAssessment}
              className="bg-indigo-600 text-white py-2 px-6 rounded-full hover:bg-indigo-700 transition-colors"
            >
              Start Assessment
            </button>
          </div>
        </div>
      ) : (
        // Assessment Page
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-indigo-600 p-4 flex items-center gap-2">
            <Bot className="text-white" size={24} />
            <h1 className="text-xl text-white font-semibold">Diabetes Risk Assessment Bot</h1>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {!showResult ? (
                <>
                  {isLoading ? (
                    <div className="text-center">
                      <p>Loading...</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div
                          className="h-1 bg-indigo-600 rounded-full"
                          style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                        />
                        <span>
                          Step {step + 1}/{questions.length}
                        </span>
                      </div>

                      <div className="chat-message flex items-start gap-4">
                        <div className="flex-shrink-0 bg-indigo-600 text-white p-2 rounded-full">
                          <Bot size={24} />
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                          <div className="font-semibold">{questions[step].label}</div>

                          {/* Input and Next Button in the same row */}
                          <div className="flex flex-col gap-2">
                            {questions[step].options ? (
                              <div className="flex flex-wrap gap-2">
                                {questions[step].options.map((option) => (
                                  <button
                                    key={option}
                                    onClick={() => handleInputChange(option)}
                                    className={`py-2 px-4 rounded-lg transition-colors ${
                                      formData[questions[step].key] === option
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-indigo-600 border border-indigo-600'
                                    } hover:bg-indigo-700 hover:text-white`}
                                  >
                                    {option}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <input
                                type="number"
                                step="0.01" // Allows entering decimal values
                                value={formData[questions[step].key] as number}
                                onChange={(e) => handleInputChange(parseFloat(e.target.value))}
                                min={questions[step].min}
                                max={questions[step].max}
                                placeholder={`Enter value (Range: ${questions[step].normalRange})`}
                                className="border p-2 rounded-md w-full"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={handleBack}
                      className="py-2 px-4 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                      disabled={step === 0}
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <button
                      onClick={handleNext}
                      className="py-2 px-6 rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      {step === questions.length - 1 ? 'Submit' : 'Next'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <h2 className="text-xl font-semibold">Assessment Complete!</h2>
                  <div className="mt-4">{result ? result : 'Error occurred while predicting.'}</div>
                  <div className="flex justify-center gap-4 mt-6">
                    <button
                      onClick={restartAssessment}
                      className="py-2 px-6 rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      Restart
                    </button>
                  </div>
                    <div className="mt-4">
                        <a
                          href="https://medlineplus.gov/diabeticdiet.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition-colors"
                        >
                          For detailed dietary guidelines on managing or preventing diabetes, visit here.
                        </a>
                      </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
