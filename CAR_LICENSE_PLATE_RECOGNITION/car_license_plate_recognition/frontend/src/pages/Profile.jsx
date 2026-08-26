import { useEffect, useState } from "react";
import axios from "axios";
import { backend_API } from "../config/Config";

export default function Profile() {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [newData, setNewData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${backend_API}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setNewData({
          name: res.data.name,
          email: res.data.email,
          password: "",
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load profile");
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setNewData({ ...newData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${backend_API}/profile`, newData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated");
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;

    try {
      await axios.delete(`${backend_API}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      alert("Account deleted");
      window.location.href = "/"; // redirect to login/home
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="flex flex-col gap-4">
        <input
          name="name"
          value={newData.name}
          onChange={handleChange}
          placeholder="Name"
          className="border p-2 rounded"
        />
        <input
          name="email"
          value={newData.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-2 rounded"
        />
        <input
          name="password"
          value={newData.password}
          onChange={handleChange}
          placeholder="New Password"
          type="password"
          className="border p-2 rounded"
        />
        <button
          onClick={handleUpdate}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded"
        >
          Update Profile
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
