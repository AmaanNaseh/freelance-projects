import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const QuizDashboard = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:5000/get-all-reports", {
          withCredentials: true,
        });
        setReports(res.data.reports);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto my-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        All Quiz Reports
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left border">Risk Level</th>
              <th className="px-4 py-2 text-left border">Timestamp</th>
              <th className="px-4 py-2 text-left border">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <tr key={report._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">
                    {report.recommendations?.level || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">{report.timestamp}</td>
                  <td className="px-4 py-2 border">
                    <Link
                      to={`/quiz-report/${report._id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuizDashboard;
