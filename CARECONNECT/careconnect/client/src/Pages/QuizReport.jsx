// src/pages/QuizReport.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";

const QuizReport = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/diabetes-report/${id}`,
          {
            withCredentials: true,
          }
        );
        setReport(res.data);
      } catch (err) {
        console.error("Error fetching report:", err);
      }
    };
    fetchReport();
  }, [id]);

  const handleDownload = () => {
    if (!report) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Diabetes Risk Report", 20, 20);

    doc.setFontSize(12);
    const lineHeight = 10;
    let y = 30;

    const fields = [
      ["Name", report.user_name],
      ["Email", report.user_email],
      ["Risk Level", report.recommendations?.level],
      ["Confidence", `${Math.round(report.probability * 100)}%`],
      ["Suggestions", report.recommendations?.suggestions],
      ["Precautions", report.recommendations?.precautions],
      ["Medicine", report.recommendations?.medicine],
    ];

    fields.forEach(([label, value]) => {
      const lines = doc.splitTextToSize(`${label}: ${value}`, 180);
      doc.text(lines, 20, y);
      y += lines.length * lineHeight;
    });

    doc.save(`diabetes-report-${report._id}.pdf`);
  };

  if (!report) return <div>Loading...</div>;

  return (
    <div className="max-w-lg md:max-w-2xl mx-4 md:mx-auto my-10 md:my-20 p-6 bg-white shadow-xl rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Diabetes Risk Report</h2>
      <p>
        <strong>Name:</strong> {report.user_name}
      </p>
      <p>
        <strong>Email:</strong> {report.user_email}
      </p>
      <p>
        <strong>Risk Level:</strong> {report.recommendations?.level}
      </p>
      <p>
        <strong>Confidence:</strong> {Math.round(report.probability * 100)}%
      </p>
      <p>
        <strong>Suggestions:</strong> {report.recommendations?.suggestions}
      </p>
      <p>
        <strong>Precautions:</strong> {report.recommendations?.precautions}
      </p>
      <p>
        <strong>Medicine:</strong> {report.recommendations?.medicine}
      </p>
      <button
        onClick={handleDownload}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700"
      >
        Download Report
      </button>
    </div>
  );
};

export default QuizReport;
