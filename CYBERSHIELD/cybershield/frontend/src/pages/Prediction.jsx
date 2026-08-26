import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate
import ThreatScanner from "../components/ThreatScanner";
import { backendAPI } from "../utils/backendAPI";

const Prediction = () => {
  const [threatLevel, setThreatLevel] = useState("");
  const [vulnerabilityScore, setVulnerabilityScore] = useState("");
  const [impactFactor, setImpactFactor] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const navigate = useNavigate(); // Initialize useNavigate

  const handlePredict = async () => {
    if (
      threatLevel < 0 ||
      threatLevel > 5 ||
      vulnerabilityScore < 0 ||
      vulnerabilityScore > 10 ||
      impactFactor < 0 ||
      impactFactor > 10
    ) {
      alert(
        "Please enter valid values:\nThreat Level (0-5)\nVulnerability Score (0-10)\nImpact Factor (0-10)"
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Send prediction request
      const res = await axios.post(
        `${backendAPI}/predict`,
        {
          threat_level: threatLevel,
          vulnerability_score: vulnerabilityScore,
          impact_factor: impactFactor,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult(`Risk Category: ${res.data.risk_category}`);
      alert("Report Saved Successfully.");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert("Unauthorized! Please log in.");
        navigate("/login"); // Redirect to login page
      } else {
        alert(
          "An error occurred. Please try again by logging in after sometime."
        );
      }
    }
  };

  return (
    <>
      <div className="bg-white p-8 rounded-lg shadow-md w-80 md:w-96 mx-auto">
        <h2 className="text-xl font-bold mb-4">Cyber Risk Prediction</h2>
        <input
          type="number"
          placeholder="Threat Level (0-5)"
          className="input-field"
          value={threatLevel}
          onChange={(e) => setThreatLevel(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Vulnerability Score (0-10)"
          className="input-field"
          value={vulnerabilityScore}
          onChange={(e) => setVulnerabilityScore(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Impact Factor (0-10)"
          className="input-field"
          value={impactFactor}
          onChange={(e) => setImpactFactor(e.target.value)}
          required
        />
        <button
          onClick={handlePredict}
          className="p-2 rounded-[7px] mx-auto w-full text-center hover:scale-105 bg-blue-700 hover:bg-blue-600 text-white font-bold text-md"
          disabled={isLoading}
        >
          {isLoading ? "Predicting..." : "Predict"}
        </button>
        {result && <p className="mt-4 font-semibold text-center">{result}</p>}
        <Link to={"/reports"}>
          <p className="my-2 mt-8 text-center w-fit mx-auto font-bold bg-[#4CAF50] text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform duration-300">
            View Reports
          </p>
        </Link>
      </div>
      <div>
        <p className="text-center bg-black/50 w-fit px-4 py-2 my-4 mx-auto text-white text-lg">
          Don't know these values? Use{" "}
          <Link
            to={"/threat-scanner"}
            className="text-blue-400 underline hover:text-blue-300"
          >
            Threat Scanner
          </Link>
        </p>
      </div>
    </>
  );
};

export default Prediction;
