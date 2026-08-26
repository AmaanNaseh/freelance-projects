import React, { useState } from "react";
import { mlBackendAPI } from "../utils/backendAPI";

const Recommendations = ({ itemName }) => {
  const [dish, setDish] = useState(itemName);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleDishChange = (e) => {
    setDish(e.target.value);
  };

  const fetchRecommendations = async () => {
    if (!dish.trim()) {
      setError("Please enter a dish name.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${mlBackendAPI}/api/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dish }),
      });

      const data = await response.json();

      if (data.recommendations.length === 0) {
        setIsVisible(true);
      }

      if (response.ok) {
        setRecommendations(data.recommendations);
      } else {
        setError(data.error || "Failed to fetch recommendations");
      }
    } catch (err) {
      setError("An error occurred while fetching recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 my-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        AI-Recommended Dishes
      </h2>
      <div className="mb-4">
        <label
          htmlFor="dish"
          className="block text-sm font-medium text-gray-700"
        >
          Dish Name
        </label>
        <input
          id="dish"
          type="text"
          value={dish}
          onChange={handleDishChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g. Pizza"
        />
      </div>
      <button
        onClick={fetchRecommendations}
        className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:scale-105 transition-all duration-300 focus:outline-none"
        disabled={loading}
      >
        {loading ? "Loading..." : "Get Recommendations"}
      </button>

      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

      {recommendations.length == 0 && isVisible ? (
        <p className="text-center mt-4 text-md">Sorry, no related items.</p>
      ) : (
        ""
      )}

      {recommendations.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Recommended Dishes:</h3>
          <ul className="list-disc pl-5 mt-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="text-gray-700">
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
