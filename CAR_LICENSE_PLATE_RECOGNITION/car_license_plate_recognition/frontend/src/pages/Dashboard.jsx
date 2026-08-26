import { useEffect, useState } from "react";
import axios from "axios";
import { backend_API } from "../config/Config";

export default function Dashboard() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, [search]);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${backend_API}/records?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(res.data);
    } catch (err) {
      console.error("Failed to fetch user records", err);
    }
  };

  const deleteRecord = async (filename) => {
    if (!window.confirm("Are you sure you want to delete it?")) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${backend_API}/record/${filename}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords((prev) => prev.filter((r) => r.filename !== filename));
    } catch (err) {
      alert("Failed to delete record");
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-center">
        <input
          className="border-[2px] p-3 mb-4 min-w-[325px]"
          placeholder="Search number plate"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {records.map((rec, i) => (
          <div
            key={i}
            className="border p-4 rounded flex flex-col items-center justify-center gap-5 bg-blue-100"
          >
            <img
              src={rec.image_url}
              className="mx-auto w-full max-h-[200px] md:max-h-[300px]"
            />
            <p className="mt-2 font-bold">Number: {rec.number_plate}</p>
            <p>Date: {new Date(rec.timestamp).toLocaleString()}</p>

            <button
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => deleteRecord(rec.filename)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
