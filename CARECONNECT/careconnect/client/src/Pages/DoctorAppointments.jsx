// src/Pages/DoctorAppointments.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/doctor-appointments",
          {
            withCredentials: true,
          }
        );
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      await axios.post(
        "http://localhost:5000/update-appointment-status",
        {
          appointment_id: appointmentId,
          status: status,
        },
        { withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: status }
            : appointment
        )
      );
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Appointment Requests</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b whitespace-nowrap">
                Patient Name
              </th>
              <th className="py-2 px-4 border-b whitespace-nowrap">
                Appointment Date
              </th>
              <th className="py-2 px-4 border-b whitespace-nowrap">Status</th>
              <th className="py-2 px-4 border-b whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id} className="text-center">
                <td className="py-2 px-4 border-b">
                  {appointment.patient_name}
                </td>
                <td className="py-2 px-4 border-b">
                  {appointment.appointment_date}
                </td>
                <td className="py-2 px-4 border-b">{appointment.status}</td>
                <td className="py-2 px-4 border-b space-x-2 whitespace-nowrap">
                  {appointment.status.toLowerCase() === "pending" && (
                    <>
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm sm:text-base"
                        onClick={() =>
                          handleUpdateStatus(appointment._id, "Accepted")
                        }
                      >
                        Accept
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm sm:text-base"
                        onClick={() =>
                          handleUpdateStatus(appointment._id, "Rejected")
                        }
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorAppointments;
