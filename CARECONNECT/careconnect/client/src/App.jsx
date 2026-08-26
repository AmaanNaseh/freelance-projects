import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import HomePage from "./Pages/HomePage";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import ProfilePage from "./Pages/ProfilePage";
import AvailableDoctorsPage from "./Pages/AvailableDoctorsPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import Footer from "./Components/Footer";
import AboutPage from "./Pages/AboutPage";
import AIMetricsPage from "./Pages/AIMetricsPage";
import QuizDashboard from "./Pages/QuizDashboard";
import Quiz from "./Pages/Quiz";
import QuizReport from "./Pages/QuizReport";
import BookAppointment from "./Pages/BookAppointment";
import DoctorAppointments from "./Pages/DoctorAppointments";
import MyAppointments from "./Pages/MyAppointments";

const App = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-[125vh]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/available-doctors"
            element={
              <ProtectedRoute>
                <AvailableDoctorsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/ai-metrics" element={<AIMetricsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/quiz-dashboard"
            element={
              <ProtectedRoute>
                <QuizDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz-report/:id"
            element={
              <ProtectedRoute>
                <QuizReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            }
          />
          // Inside your Routes component
          <Route
            path="/book-appointment"
            element={
              <ProtectedRoute>
                <BookAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor-appointments"
            element={
              <ProtectedRoute>
                <DoctorAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-appointments"
            element={
              <ProtectedRoute>
                <MyAppointments />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <div className="mt-32">
        <Footer />
      </div>
    </>
  );
};

export default App;
