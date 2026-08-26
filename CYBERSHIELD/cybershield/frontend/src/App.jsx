import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Prediction from "./pages/Prediction";
import Home from "./pages/Home";
import ViewReports from "./pages/ViewReports";
import ViewReportDetails from "./pages/ViewReportDetails";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
import Attributions from "./pages/Attributions";
import AIMetrics from "./pages/AIMetrics";
import Scanner from "./pages/Scanner";

function App() {
  return (
    <>
      <Navbar />
      <div className="min-h-[125vh] m-4 p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/attributions" element={<Attributions />} />
          <Route path="/threat-scanner" element={<Scanner />} />
          <Route path="/predict" element={<Prediction />} />
          <Route path="/reports" element={<ViewReports />} />
          <Route path="/view-report/:id" element={<ViewReportDetails />} />
          <Route path="/ai-metrics" element={<AIMetrics />} />
        </Routes>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
}

export default App;
