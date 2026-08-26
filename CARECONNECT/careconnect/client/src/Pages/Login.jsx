import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import patientLogo from "../assets/patient.png";
import doctorLogo from "../assets/doctor.png";

const Login = () => {
  const [userType, setUserType] = useState("patient"); // Default is patient
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (!email || !password) {
      setMessage("Please fill in both email and password.");
      return;
    }

    try {
      const data = { email, password, user_type: userType };
      const response = await axios.post("http://localhost:5000/login", data);

      if (response.data.message === "Login successful") {
        localStorage.setItem("userType", userType);
        localStorage.setItem("isLoggedIn", "true");
        navigate("/");
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-20 lg:justify-around my-10">
        <div className="w-[150px] lg:w-[300px]">
          <img src={patientLogo} alt="image" className="w-full" />
        </div>
        <div className="w-fit min-w-[300px] md:min-w-[450px] p-8 border-[1px] border-black shadow-lg shadow-black/50 z-10 bg-white flex flex-col gap-4 items-center">
          <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold my-4">
            Login
          </h2>
          <div className="flex gap-4 flex-wrap items-center justify-center">
            <label className="font-semibold text-xl">User Type</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="block border-[2px] border-black px-4 py-2"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          <label className="font-semibold text-xl">Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block border-[2px] border-black px-4 py-2"
          />

          <label className="font-semibold text-xl">Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block border-[2px] border-black px-4 py-2"
          />
          <button
            onClick={handleLogin}
            className="p-2 rounded-[7px] min-w-[95px] text-center hover:scale-105 bg-green-700 hover:bg-green-600 text-white font-bold text-xl md:text-2xl my-4"
          >
            Login
          </button>
          {message && <p className="mt-4 text-center">{message}</p>}
        </div>
        <div className="w-[150px] lg:w-[300px]">
          <img src={doctorLogo} alt="image" className="w-full" />
        </div>
      </div>
    </>
  );
};

export default Login;
