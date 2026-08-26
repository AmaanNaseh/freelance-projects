import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import DrivingRules from "./pages/DrivingRules";
import DrivingLaws from "./pages/DrivingLaws";
import AccidentZones from "./pages/AccidentZones";
import Dashboard from "./pages/Dashboard";
import HelmetDetection from "./pages/HelmetDetection";
import WrongSideDetection from "./pages/WrongSideDetection";
import SignalViolationDetection from "./pages/SignalViolationDetection";
import TrafficDensityDetection from "./pages/TrafficDensityDetection";
import AccidentDetection from "./pages/AccidentDetection";
import DrowsinessDetection from "./pages/DrowsinessDetection";
import NumberPlateDetection from "./pages/NumberPlateDetection";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scroll({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "#060d1f",
        }}
      >
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/driving-rules" element={<DrivingRules />} />

            <Route path="/driving-laws" element={<DrivingLaws />} />

            <Route path="/accident-zones" element={<AccidentZones />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/detect/helmet" element={<HelmetDetection />} />
            <Route path="/detect/wrong-side" element={<WrongSideDetection />} />
            <Route
              path="/detect/signal-violation"
              element={<SignalViolationDetection />}
            />
            <Route
              path="/detect/traffic-density"
              element={<TrafficDensityDetection />}
            />
            <Route path="/detect/accident" element={<AccidentDetection />} />
            <Route
              path="/detect/drowsiness"
              element={<DrowsinessDetection />}
            />
            <Route
              path="/detect/number-plate"
              element={<NumberPlateDetection />}
            />
          </Routes>
        </div>

        <Footer />
      </div>
    </>
  );
}
