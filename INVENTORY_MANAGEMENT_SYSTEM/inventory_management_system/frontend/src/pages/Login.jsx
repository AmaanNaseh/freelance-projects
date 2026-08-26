import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { backendAPI } from "../utils/backendAPI";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backendAPI}/api/auth/login`, {
        email: form.email,
        password: form.password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/"); // Redirect to homepage after login
    } catch (err) {
      if (err.response) {
        alert(err.response.data.msg || "Invalid credentials");
      } else {
        alert("Network error");
      }
    }
  };

  return (
    <div className="max-w-[300px] md:max-w-md mx-auto mt-10 p-6 bg-white shadow-lg z-10 border-[1px] rounded-xl flex flex-col items-center justify-center gap-2">
      <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        className="w-full mb-2 p-2 border rounded"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button
        onClick={handleLogin}
        className="bg-accent text-black px-4 py-2 rounded mt-2 border-[2px] border-black hover:scale-105"
      >
        Login
      </button>
      <p className="mt-4">
        Don't have an account?{" "}
        <Link to={"/signup"} className="text-blue-500 underline font-bold">
          Signup
        </Link>
      </p>
    </div>
  );
}
