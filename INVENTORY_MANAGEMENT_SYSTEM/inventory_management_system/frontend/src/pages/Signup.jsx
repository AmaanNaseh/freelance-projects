import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { backendAPI } from "../utils/backendAPI";

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backendAPI}/api/auth/signup`, {
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role, // Add role if required
      });

      const data = response.data;

      // Store token and user info in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to home or other page
      window.location.href = "/login"; // Redirect to home page, you can change this URL
    } catch (error) {
      // Handle error response
      if (error.response) {
        console.log("Error:", error.response.data.msg); // The error message from backend
      } else {
        console.log("Error:", error.message); // Network or server error
      }
    }
  };

  return (
    <div className="max-w-[300px] md:max-w-md mx-auto mt-10 p-6 bg-white shadow-lg z-10 border-[1px] rounded-xl flex flex-col items-center justify-center gap-2">
      <h2 className="text-xl font-bold mb-4 text-center">Signup</h2>
      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="Full Name"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <select
        className="w-full mb-2 p-2 border rounded"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button
        onClick={handleSignup}
        className="bg-accent text-black px-4 py-2 rounded w-fit border-[2px] border-black hover:scale-105"
      >
        Signup
      </button>
      <p className="mt-4">
        Already have an account?{" "}
        <Link to={"/login"} className="text-blue-500 underline font-bold">
          Login
        </Link>
      </p>
    </div>
  );
}
