import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import carIcon from "../assets/car.png";
import { backend_API } from "../config/Config";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backend_API}/signup`, form);
      alert("Signup successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response.data.error || "Signup failed");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row-reverse items-center justify-center lg:justify-evenly gap-10 lg:gap-20">
      <div className="w-[300px] lg:w-[400px]">
        <img src={carIcon} alt="car icon" />
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-blue-100 p-6 rounded shadow-md py-12 flex flex-col items-center justify-center gap-6 max-w-[400px] min-w-[300px] md:min-w-[500px] md:max-w-[600px]"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        <input
          type="text"
          placeholder="Name"
          className="w-full border p-3 mb-3"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 mb-3"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 mb-3"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="w-full font-bold text-lg bg-[#041FFE] text-white p-2 rounded hover:scale-105 hover:bg-[#041FFE]/75 transition-transform duration-100">
          Sign Up
        </button>
      </form>
    </div>
  );
}
