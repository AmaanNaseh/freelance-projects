import React, { useEffect, useState } from "react";
import axios from "axios";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/user-appointments", {
          withCredentials: true,
        });
        setAppointments(res.data.appointments);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) return <div className="p-4">Loading appointments...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (appointments.length === 0)
    return <div className="p-4">No appointments found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">My Appointments</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-md min-w-[600px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                Doctor Email
              </th>
              <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                Date
              </th>
              <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                Time
              </th>
              <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                Status
              </th>
              <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                Booked On
              </th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {appt.doctor_email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {appt.date}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {appt.time}
                </td>
                <td
                  className={`border border-gray-300 px-4 py-2 font-semibold whitespace-nowrap ${
                    appt.status === "accepted"
                      ? "text-green-600"
                      : appt.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {appt.created_at}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyAppointments;
