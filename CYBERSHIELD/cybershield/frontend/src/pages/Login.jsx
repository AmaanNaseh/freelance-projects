import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { backendAPI } from "../utils/backendAPI";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendAPI}/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      alert("Login Successful!");
      navigate("/"); // Redirect to Prediction Page
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-80 md:w-96 mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin}>
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
          Login
        </button>
      </form>
      <p className="text-center my-2">
        Don't have an account ?{" "}
        <Link
          to={"/signup"}
          className="text-blue-700 font-bold hover:border-b-[2px] border-black"
        >
          Signup
        </Link>
      </p>
    </div>
  );
};

export default Login;
