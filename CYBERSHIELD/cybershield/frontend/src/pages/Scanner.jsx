import React from "react";
import ThreatScanner from "../components/ThreatScanner";
import { Link } from "react-router-dom";

const Scanner = () => {
  return (
    <div>
      <h1 className="text-white font-semibold text-lg italic text-center my-8">
        Scan any website to know its threat values which may be used to predict
        risk using our Analytics feature.
      </h1>
      <ThreatScanner />
      <p className="text-center bg-black/50 w-fit px-4 py-2 mx-auto text-white font-semibold text-lg">
        Done scanning?{" "}
        <Link
          to={"/predict"}
          className="text-blue-400 hover:text-blue-300 underline"
        >
          Analyze Risk Now
        </Link>
      </p>
    </div>
  );
};

export default Scanner;
