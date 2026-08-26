import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { backendAPI } from "../utils/backendAPI";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendAPI}/signup`, {
        full_name: fullName,
        email,
        password,
      });
      alert(res.data.message);
      navigate("/login"); // Redirect to Login Page
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-80 md:w-96 mx-auto">
      <h2 className="text-xl font-bold mb-4">Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Full Name"
          className="input-field"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="p-2 rounded-[7px] mx-auto w-full text-center hover:scale-105 bg-blue-700 hover:bg-blue-600 text-white font-bold text-md"
        >
          Sign Up
        </button>
      </form>
      <p className="text-center my-2">
        Already have an account ?{" "}
        <Link
          to={"/login"}
          className="text-blue-700 font-bold hover:border-b-[2px] border-black"
        >
          Login
        </Link>
      </p>
    </div>
  );
};

export default Signup;
