import { useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true; // Ensure credentials are always sent

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/profile", {
          withCredentials: true,
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("Failed to fetch profile data. Please log in.");
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/logout",
        {},
        { withCredentials: true }
      );
      setUserData(null); // Clear user data
      window.location.href = "/"; // Redirect to home or login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!userData) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-center">Profile Details</h1>
      <div className="flex flex-col items-center justify-center gap-4 my-8 bg-gray-200 border-gray-300 shadow-gray-400 shadow-md w-fit p-4 mx-auto">
        <h3 className="text-lg">
          <strong>Name:</strong> {userData.name}
        </h3>
        <h3 className="text-lg">
          <strong>Email:</strong> {userData.email}
        </h3>
        {userData.user_type === "doctor" && (
          <h3 className="text-lg">
            <strong>Specialist Category:</strong> {userData.specialist_category}
          </h3>
        )}

        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-500 hover:scale-105"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
