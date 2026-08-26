import React from "react";
import AIMetrics1 from "../assets/model_comparison.png";
import AIMetrics2 from "../assets/confusion_matrix.png";
import AIMetrics3 from "../assets/classification_report.png";

const AIMetricsPage = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-10 m-4 p-4 md:m-10">
        <div className="flex flex-col gap-4 items-center justify-center bg-green-600 text-white px-4 py-3">
          <div className="w-[300px] md:w-[350px]">
            <img src={AIMetrics1} alt="ai metrics" className="w-full" />
          </div>
          <h3 className="font-semibold">ML Models comparison for training</h3>
        </div>
        <div className="flex flex-col gap-4 items-center justify-center bg-green-600 text-white px-4 py-3">
          <div className="w-[300px] md:w-[350px]">
            <img src={AIMetrics2} alt="ai metrics" className="w-full" />
          </div>
          <h3 className="font-semibold">Confusion Matrix</h3>
        </div>
        <div className="flex flex-col gap-4 items-center justify-center bg-green-600 text-white px-4 py-3">
          <div className="w-[300px] md:w-[350px]">
            <img src={AIMetrics3} alt="ai metrics" className="w-full" />
          </div>
          <h3 className="font-semibold">Classification Report</h3>
        </div>
      </div>
    </>
  );
};

export default AIMetricsPage;
