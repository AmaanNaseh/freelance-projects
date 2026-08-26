import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { backendAPI } from "../utils/backendAPI";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Using useNavigate instead of useHistory

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect to login if no token is found
        return;
      }
      try {
        const response = await axios.get(`${backendAPI}/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the JWT token from localStorage
    navigate("/login"); // Redirect to login page using useNavigate
  };

  return (
    <div className="mx-auto p-6 w-fit">
      <h1 className="text-3xl font-semibold mb-4 text-white text-center">
        Profile
      </h1>
      {user ? (
        <div className="bg-white p-8 shadow-md shadow-white rounded-lg flex flex-col items-center justify-center gap-8">
          <p className="text-xl font-medium">Full Name: {user.full_name}</p>
          <p className="text-xl font-medium">Email: {user.email}</p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-700 font-bold text-white rounded-md hover:bg-red-500 hover:scale-105"
          >
            Logout
          </button>
        </div>
      ) : (
        <p className="text-white">Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
