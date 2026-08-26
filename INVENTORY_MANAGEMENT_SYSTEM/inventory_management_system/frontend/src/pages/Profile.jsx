import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendAPI } from "../utils/backendAPI";

const Profile = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${backendAPI}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          ...formData,
          username: res.data.username,
          email: res.data.email,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;
    try {
      await axios.delete(`${backendAPI}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      window.location.href = "/signup"; // Redirect to login
    } catch (err) {
      console.error(err);
      setMessage("Delete failed");
    }
  };

  return (
    <div className="max-w-[300px] md:max-w-md mx-auto mt-10 p-6 z-10 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center gap-2 border-[1px]">
      <h2 className="text-2xl font-bold mb-4 text-center ">Your Profile</h2>
      {message && <p className="text-center text-pink-600">{message}</p>}
      <p className="my-2">Name: {formData.username}</p>
      <p className="my-2">Email: {formData.email}</p>
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white py-2 my-4 w-fit px-4 rounded hover:scale-105 font-bold"
      >
        Delete Account
      </button>
    </div>
  );
};

export default Profile;
