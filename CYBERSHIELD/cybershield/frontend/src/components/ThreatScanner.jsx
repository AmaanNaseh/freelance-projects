// frontend: Example component
import { useState } from "react";
import axios from "axios";
import { backendAPI } from "../utils/backendAPI";

export default function ThreatScanner() {
  const [url, setUrl] = useState("");
  const [threatData, setThreatData] = useState(null);

  const handleScan = async () => {
    try {
      const response = await axios.post(`${backendAPI}/api/check-threat`, {
        url,
      });
      setThreatData(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to scan URL");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center justify-center w-fit mx-auto my-10 min-w-[300px] md:min-w-[400px]">
      <h2 className="text-xl font-bold mb-4">Scan Website for Threats</h2>
      <input
        type="text"
        className="border p-2 w-[200px] mb-4"
        placeholder="Enter website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        className="rounded-[7px] mx-auto w-fit text-center hover:scale-105 bg-blue-700 hover:bg-blue-600 text-white font-bold text-md px-4 py-2"
        onClick={handleScan}
      >
        Scan
      </button>

      {threatData && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Scan Result:</h3>
          <p>Threat Level: {threatData.threatLevel}</p>
          <p>Vulnerability Score: {threatData.vulnerabilityScore}</p>
          <p>Impact Factor: {threatData.impactFactor}</p>
        </div>
      )}
    </div>
  );
}
