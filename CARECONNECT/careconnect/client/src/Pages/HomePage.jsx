import React from "react";
import { Link } from "react-router-dom";
import PredictionLogo from "../assets/Prediction.png";
import DashboardLogo from "../assets/Dashboard.png";
import DoctorLogo from "../assets/doctor.png";
import AppointmentLogo from "../assets/bookingIcon.png";
import AILogo from "../assets/AI.png";
import heroPoster from "../assets/heroPoster.png";

const HomePage = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = localStorage.getItem("userType"); // e.g., "doctor" or "patient"

  return (
    <>
      <div className="w-full h-28 md:h-80 relative">
        <img src={heroPoster} alt="..." className="w-full h-full" />
        <h1 className="absolute text-center p-2 text-white mix-blend-multiply bg-blue-500 text-3xl md:text-5xl lg:text-7xl font-bold top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          CARE CONNECT
        </h1>
      </div>
      <div className="my-10 p-8 flex flex-col items-center justify-center gap-8">
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-center">
          Healthcare App for Symptom Analysis and Doctor Recommendations
        </h1>
        <Link to={"/signup"}>
          <div className="text-white bg-black hover:scale-105 hover:bg-black/75 font-bold px-4 py-2 rounded-md text-2xl my-8">
            Get Started
          </div>
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center flex-wrap md:flex-row gap-10 md:gap-14 m-2 md:m-4 lg:m-10">
        {userRole === "doctor" ? (
          <Link
            to={"/doctor-appointments"}
            className="flex flex-col items-center justify-center gap-4 w-fit min-w-[250px] bg-green-400 hover:scale-105 shadow-md shadow-green-300 rounded-[24px] px-4 py-3"
          >
            <div className="w-[200px]">
              <img src={AppointmentLogo} className="w-full" alt="img" />
            </div>
            <h1 className="font-bold text-lg md:text-xl lg:text-2xl">
              Users Appointment
            </h1>
          </Link>
        ) : (
          <>
            <Link
              to={"/quiz"}
              className="flex flex-col items-center justify-center gap-4 w-fit min-w-[250px] bg-green-400 hover:scale-105 shadow-md shadow-green-300 rounded-[24px] px-4 py-3"
            >
              <div className="w-[200px]">
                <img src={PredictionLogo} className="w-full" alt="img" />
              </div>
              <h1 className="font-bold text-lg md:text-xl lg:text-2xl">
                Ask AI
              </h1>
            </Link>
            <Link
              to={"/quiz-dashboard"}
              className="flex flex-col items-center justify-center gap-4 w-fit min-w-[250px] bg-green-400 hover:scale-105 shadow-md shadow-green-300 rounded-[24px] px-4 py-3"
            >
              <div className="w-[200px]">
                <img src={DashboardLogo} className="w-full" alt="img" />
              </div>
              <h1 className="font-bold text-lg md:text-xl lg:text-2xl">
                Treatment History
              </h1>
            </Link>

            <Link
              to={"/book-appointment"}
              className="flex flex-col items-center justify-center gap-4 w-fit min-w-[250px] bg-green-400 hover:scale-105 shadow-md shadow-green-300 rounded-[24px] px-4 py-3"
            >
              <div className="w-[200px]">
                <img src={AppointmentLogo} className="w-full" alt="img" />
              </div>
              <h1 className="font-bold text-lg md:text-xl lg:text-2xl">
                Book Appointment
              </h1>
            </Link>
            <Link
              to={"/my-appointments"}
              className="flex flex-col items-center justify-center gap-4 w-fit min-w-[250px] bg-green-400 hover:scale-105 shadow-md shadow-green-300 rounded-[24px] px-4 py-3"
            >
              <div className="w-[200px]">
                <img src={DoctorLogo} className="w-full" alt="img" />
              </div>
              <h1 className="font-bold text-lg md:text-xl lg:text-2xl">
                My Appointments
              </h1>
            </Link>
          </>
        )}

        <Link
          to={"/ai-metrics"}
          className="flex flex-col items-center justify-center gap-4 w-fit min-w-[250px] bg-green-400 hover:scale-105 shadow-md shadow-green-300 rounded-[24px] px-4 py-3"
        >
          <div className="w-[200px]">
            <img src={AILogo} className="w-full" alt="img" />
          </div>
          <h1 className="font-bold text-lg md:text-xl lg:text-2xl">
            AI Metrics
          </h1>
        </Link>
      </div>
    </>
  );
};

export default HomePage;
