// src/pages/Quiz.jsx
import React, { useState } from "react";
import axios from "axios";

const questions = [
  { key: "age", question: "What is your age?", type: "number" },
  {
    key: "bmi",
    question: "What is your BMI? (BMI = Weight in Kg/Height in m)",
    type: "number",
  },
  {
    key: "hypertension",
    question: "Do you have hypertension?",
    type: "boolean",
  },
  {
    key: "cholesterol",
    question: "Do you have high cholesterol?",
    type: "boolean",
  },
  { key: "exercise", question: "Do you exercise regularly?", type: "boolean" },
  {
    key: "sugar_intake",
    question: "What is your daily sugar intake?",
    options: ["Low", "Medium", "High"],
  },
  {
    key: "family_history",
    question: "Do you have a family history of diabetes?",
    type: "boolean",
  },
  {
    key: "symptoms",
    question: "Are you currently showing diabetic symptoms?",
    type: "boolean",
  },
  { key: "smoker", question: "Are you a smoker?", type: "boolean" },
];

export default function Quiz() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const formatted = {
        ...answers,
        hypertension: parseInt(answers.hypertension),
        cholesterol: parseInt(answers.cholesterol),
        exercise: parseInt(answers.exercise),
        sugar_intake: parseInt(answers.sugar_intake),
        family_history: parseInt(answers.family_history),
        symptoms: parseInt(answers.symptoms),
        smoker: parseInt(answers.smoker),
      };

      const res = await axios.post(
        "http://localhost:5000/predict-diabetes",
        formatted,
        {
          withCredentials: true,
        }
      );

      const report = res.data;
      setResult(
        `${report.recommendations.level} (Confidence: ${Math.round(
          report.probability * 100
        )}%)`
      );

      // Redirect to report page
      window.location.href = `/quiz-report/${report._id}`;
    } catch (err) {
      console.error(err);
      setResult("Error predicting risk");
    }
  };

  return (
    <div className="max-w-xl mx-4 md:mx-auto my-10 md:my-20 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-semibold mb-4">Diabetes Risk Quiz</h2>
      {questions.map((q) => (
        <div key={q.key} className="mb-4">
          <label className="block font-medium mb-1">{q.question}</label>
          {q.type === "number" ? (
            <input
              type="number"
              className="w-full border rounded p-2"
              onChange={(e) => handleChange(q.key, parseFloat(e.target.value))}
            />
          ) : q.options ? (
            <select
              className="w-full border rounded p-2"
              onChange={(e) => handleChange(q.key, e.target.selectedIndex)}
            >
              {q.options.map((opt, idx) => (
                <option key={idx} value={idx}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <select
              className="w-full border rounded p-2"
              onChange={(e) => handleChange(q.key, e.target.value)}
            >
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4 font-semibold"
      >
        Submit
      </button>

      {result && <p className="mt-4 text-xl font-semibold">{result}</p>}
    </div>
  );
}
