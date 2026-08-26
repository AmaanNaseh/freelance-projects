import React from "react";
import { Link } from "react-router-dom";
import riskAnalysisIcon from "../assets/riskAnalysis.png";
import cyberReportIcon from "../assets/cyberReport.png";
import AIMetricsIcon from "../assets/AIMetrics.png";
import scannerIcon from "../assets/scanner.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  var settings = {
    dots: true,
    autoplay: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      <div className="my-10 md:px-8 lg:px-20">
        <Slider {...settings}>
          <div className="bg-[#5985B3] text-white py-10 md:py-20">
            <h3 className="text-center font-bold text-2xl md:text-3xl lg:text-4xl">
              Cyber Risk Analytics System
            </h3>
          </div>
          <div className="bg-[#5985B3] text-white py-10 md:py-20">
            <h3 className="text-center font-bold text-2xl md:text-3xl lg:text-4xl">
              What We Provide ?
            </h3>
          </div>
          <div className="bg-[#5985B3] text-white py-10 md:py-20">
            <h3 className="text-center font-bold text-2xl md:text-3xl lg:text-4xl">
              ML Based Risk Analysis
            </h3>
          </div>
          <div className="bg-[#5985B3] text-white py-10 md:py-20">
            <h3 className="text-center font-bold text-2xl md:text-3xl lg:text-4xl">
              Analytics Report Generation
            </h3>
          </div>
          <div className="bg-[#5985B3] text-white py-10 md:py-20">
            <h3 className="text-center font-bold text-2xl md:text-3xl lg:text-4xl">
              Download Analytics Report
            </h3>
          </div>
        </Slider>
      </div>

      <div className="flex flex-col items-center justify-center gap-10 md:gap-20 my-10 md:px-8 lg:px-20">
        <div className="flex flex-col items-center justify-evenly gap-4 bg-white/75 rounded-md shadow-sm shadow-white border-[1px] border-gray-200 text-black w-full md:w-[75%] p-4">
          <div className="w-[150px] animate-bounce transition-all duration-75">
            <img src={scannerIcon} className="w-full" alt="image" />
          </div>
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center font-semibold italic">
              Our advanced URL scanner quickly analyzes website links for
              potential threats such as malware, phishing attempts, and
              suspicious activities. It provides real-time threat detection to
              ensure you browse and interact with safe websites.
            </p>
            <Link to={"/threat-scanner"}>
              <button className="bg-[#547792] text-white px-4 py-2 rounded-lg font-bold hover:scale-105 transition-all duration-300">
                Scan URL
              </button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center justify-evenly gap-4 bg-white/75 rounded-md shadow-sm shadow-white border-[1px] border-gray-200 text-black w-full md:w-[75%] p-4">
          <div className="w-[150px] animate-bounce transition-all duration-75">
            <img src={riskAnalysisIcon} className="w-full" alt="image" />
          </div>
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center font-semibold italic">
              By leveraging machine learning, our system predicts cyber risk
              levels based on input parameters like threat level, vulnerability
              score, and impact factor. This predictive analysis helps you
              identify vulnerabilities before they turn into serious threats.
            </p>
            <Link to={"/predict"}>
              <button className="bg-[#547792] text-white px-4 py-2 rounded-lg font-bold hover:scale-105 transition-all duration-300">
                Analyze Risks
              </button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center justify-evenly gap-4 bg-white/75 rounded-md shadow-sm shadow-white border-[1px] border-gray-200 text-black w-full md:w-[75%] p-4">
          <div className="w-[150px] animate-bounce transition-all duration-75">
            <img src={cyberReportIcon} className="w-full" alt="image" />
          </div>
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center font-semibold italic">
              After each risk evaluation, our system automatically generates a
              detailed analytics report. The report provides insights into
              detected risks, their severity, and recommended actions to improve
              your cybersecurity posture.
            </p>
            <Link to={"/reports"}>
              <button className="bg-[#547792] text-white px-4 py-2 rounded-lg font-bold hover:scale-105 transition-all duration-300">
                View Reports
              </button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center justify-evenly gap-4 bg-white/75 rounded-md shadow-sm shadow-white border-[1px] border-gray-200 text-black w-full md:w-[75%] p-4">
          <div className="w-[150px] animate-bounce transition-all duration-75">
            <img src={AIMetricsIcon} className="w-full" alt="image" />
          </div>
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center font-semibold italic">
              We showcase key AI metrics to visualize how effectively our model
              identifies threats, offering insights into its strengths and areas
              for improvement.
            </p>
            <Link to={"/ai-metrics"}>
              <button className="bg-[#547792] text-white px-4 py-2 rounded-lg font-bold hover:scale-105 transition-all duration-300">
                AI Metrics
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
