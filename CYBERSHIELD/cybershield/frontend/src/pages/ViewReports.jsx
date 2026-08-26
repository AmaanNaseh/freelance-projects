import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { backendAPI } from "../utils/backendAPI";

const ViewReports = () => {
  const [reports, setReports] = useState([]);
  const [sortBy, setSortBy] = useState("time_desc"); // Default: sort by time descending
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login"); // Redirect to login if no token is found
          return;
        }
        const res = await axios.get(`${backendAPI}/reports`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports(res.data.reports);
      } catch (err) {
        console.error("Error fetching reports:", err);
      }
    };

    fetchReports();
  }, []); // This will run only once when the component is mounted

  // Sorting logic based on selected filter
  const sortReports = (reports, sortBy) => {
    switch (sortBy) {
      case "time_desc":
        return [...reports].sort(
          (a, b) => new Date(b.generated_at) - new Date(a.generated_at)
        );
      case "time_asc":
        return [...reports].sort(
          (a, b) => new Date(a.generated_at) - new Date(b.generated_at)
        );
      case "risk_level":
        const riskOrder = ["Critical", "High", "Medium", "Low"]; // Custom risk level order
        return [...reports].sort(
          (a, b) =>
            riskOrder.indexOf(a.risk_category) -
            riskOrder.indexOf(b.risk_category)
        );
      default:
        return reports;
    }
  };

  const handleViewReport = (id) => {
    // Navigate to individual report view
    navigate(`/view-report/${id}`);
  };

  // Sort reports based on the selected filter
  const sortedReports = sortReports(reports, sortBy);

  return (
    <div className="mx-4 md:mx-10 py-8 px-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center text-white">
        Previous Cyber Risk Reports
      </h2>

      {/* Filter Options */}
      <div className="flex space-x-4 mb-4">
        <select
          className="p-2 border-[2px] border-black rounded-md mx-auto"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="time_desc">Sort by Time (Latest First)</option>
          <option value="time_asc">Sort by Time (Oldest First)</option>
          <option value="risk_level">Sort by Risk Level</option>
        </select>
      </div>

      {sortedReports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <ul className="flex flex-col md:flex-row flex-wrap items-center justify-start gap-10">
          {sortedReports.map((report, index) => (
            <li key={index} className="mb-4 p-4 border rounded-md bg-white">
              <h3 className="text-lg font-semibold">{report.title}</h3>
              <p className="text-gray-600">
                Generated on: {new Date(report.generated_at).toLocaleString()}
              </p>
              <p className="text-sm">Risk Category: {report.risk_category}</p>
              <button
                onClick={() => handleViewReport(report._id)}
                className="mt-2 text-blue-600"
              >
                View Report
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewReports;
