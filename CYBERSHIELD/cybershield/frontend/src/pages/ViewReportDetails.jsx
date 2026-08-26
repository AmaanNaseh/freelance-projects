import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams to access the URL parameter
import html2pdf from "html2pdf.js"; // Import html2pdf.js
import { backendAPI } from "../utils/backendAPI";

const ViewReportDetails = () => {
  const [report, setReport] = useState(null);
  const { id } = useParams(); // Get the report ID from the URL

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login"); // Redirect to login if no token is found
          return;
        }
        const res = await axios.get(`${backendAPI}/reports/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReport(res.data.report);
      } catch (err) {
        console.error("Error fetching report details:", err);
      }
    };

    fetchReportDetails();
  }, [id]); // Run when the report ID changes

  if (!report) {
    return <p>Loading report details...</p>;
  }

  // Static data based on risk category
  const riskCategoryData = {
    Low: {
      actions: [
        "Minimal Action Needed: Continuous monitoring, regular security audits.",
        "Ensure all software, firmware, and systems are up-to-date.",
        "Enable Multi-Factor Authentication (MFA) where applicable.",
        "Ensure sensitive data is encrypted both in transit and at rest.",
        "General cybersecurity awareness training for employees.",
      ],
      impact:
        "Business Impact: Low potential financial, operational, or reputational loss.",
    },
    Medium: {
      actions: [
        "Ensure firewalls and antivirus definitions are up-to-date.",
        "Review user access levels and ensure only authorized users have access to sensitive systems.",
        "Implement immediate patches for identified vulnerabilities.",
        "Implement stronger authentication methods, such as MFA or biometric authentication.",
        "Increase monitoring for unusual activities and set up intrusion detection systems (IDS).",
      ],
      impact:
        "Business Impact: Moderate potential financial, operational, or reputational loss.",
    },
    High: {
      actions: [
        "Limit user access to critical systems or sensitive data.",
        "Activate the organization’s incident response plan.",
        "Improve encryption protocols for sensitive data.",
        "Conduct penetration tests on critical systems.",
        "Ensure regular data backups and test recovery procedures.",
      ],
      impact:
        "Business Impact: High potential financial, operational, or reputational loss.",
    },
    Critical: {
      actions: [
        "Disconnect compromised systems or networks immediately to limit further damage.",
        "Initiate the organization’s disaster recovery and business continuity plan.",
        "Notify law enforcement or regulatory bodies if the breach is serious enough.",
        "Perform a comprehensive forensic analysis of the attack, affected systems, and data.",
        "Rebuild or wipe compromised systems to ensure that no backdoors or malware remain.",
      ],
      impact:
        "Business Impact: Critical potential financial, operational, or reputational loss, may include legal and regulatory consequences.",
    },
  };

  const { actions, impact } = riskCategoryData[report.risk_category] || {};

  const handleDownloadReport = () => {
    const element = document.getElementById("report-content"); // Target the content to download as PDF
    const opt = {
      margin: 1,
      filename: `Cyber_Risk_Report_${id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save(); // Generate the PDF and download it
  };

  return (
    <>
      <div
        className="bg-white p-8 rounded-lg shadow-md w-fit mx-auto"
        id="report-content"
      >
        <h2 className="text-xl font-bold mb-4">Risk Report Details</h2>
        <div>
          <h3 className="text-lg font-semibold">
            Risk Category: {report.risk_category}
          </h3>
          <p className="text-sm text-gray-600">
            Generated at: {new Date(report.generated_at).toLocaleString()}
          </p>
          <p className="mt-2">
            <strong>Threat Level:</strong> {report.threat_level}
          </p>
          <p className="mt-2">
            <strong>Vulnerability Score:</strong> {report.vulnerability_score}
          </p>
          <p className="mt-2">
            <strong>Impact Factor:</strong> {report.impact_factor}
          </p>
          {/* <p className="mt-2">
          <strong>Threat Entities:</strong> {report.threat_entities.join(", ")}
        </p> */}

          {/* Display Actions and Impact based on Risk Category */}
          <div className="mt-4">
            <h4 className="text-lg font-semibold">Suggested Actions:</h4>
            <ul className="list-disc pl-6">
              {actions &&
                actions.map((action, index) => <li key={index}>{action}</li>)}
            </ul>
          </div>
          <div className="mt-4">
            <h4 className="text-lg font-semibold">Impact:</h4>
            <p>{impact}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button
          onClick={handleDownloadReport}
          className="p-2 rounded-[7px] my-4 w-fit text-center hover:scale-105 bg-blue-700 hover:bg-blue-600 text-white font-bold text-md"
        >
          Download Report as PDF
        </button>
      </div>
    </>
  );
};

export default ViewReportDetails;
