import React, { useState, useEffect } from "react";

const AvailableDoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch doctors from the Flask backend
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:5000/available-doctors");
        const data = await response.json();

        if (response.ok) {
          setDoctors(data.doctors);
        } else {
          setError(data.message || "Failed to load doctors");
        }
      } catch (error) {
        setError("An error occurred while fetching doctors.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="m-4 p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Available Doctors</h1>
      {loading ? (
        <p>Loading doctors...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-fit table-auto mx-auto">
          <thead>
            <tr>
              <th className="border-black border-[2px] px-4 py-2">Name</th>
              <th className="border-black border-[2px] px-4 py-2">
                Specialist Category
              </th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, index) => (
              <tr key={index}>
                <td className="border-black border-[2px] px-4 py-2">
                  {doctor.name}
                </td>
                <td className="border-black border-[2px] px-4 py-2">
                  {doctor.specialist_category}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AvailableDoctorsPage;
