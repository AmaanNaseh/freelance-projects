import React, { useEffect, useState } from "react";
import axios from "axios";

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState({});
  const [userAppointments, setUserAppointments] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/available-doctors",
          {
            withCredentials: true,
          }
        );
        setDoctors(response.data.doctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchUserAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/user-appointments",
          {
            withCredentials: true,
          }
        );
        // Convert to map for quick access by doctor email
        const apptsMap = {};
        response.data.appointments.forEach((appt) => {
          apptsMap[appt.doctor_email] = appt;
        });
        setUserAppointments(apptsMap);
      } catch (error) {
        console.error("Error fetching user appointments:", error);
      }
    };

    fetchUserAppointments();
  }, []);

  const handleChange = (doctorEmail, field, value) => {
    setAppointments((prev) => ({
      ...prev,
      [doctorEmail]: {
        ...prev[doctorEmail],
        [field]: value,
      },
    }));
  };

  const handleBookAppointment = async (doctorEmail) => {
    const { date, time } = appointments[doctorEmail] || {};

    if (!date || !time) {
      alert("Please select both date and time.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/book-appointment",
        {
          doctor_email: doctorEmail,
          date,
          time,
        },
        { withCredentials: true }
      );
      alert("Appointment request sent!");

      // Immediately update userAppointments state for this doctor to 'Pending'
      setUserAppointments((prev) => ({
        ...prev,
        [doctorEmail]: { status: "Pending" },
      }));
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Book an Appointment</h2>

      {/* Responsive wrapper for table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b whitespace-nowrap">Name</th>
              <th className="py-2 px-4 border-b whitespace-nowrap">
                Specialist Category
              </th>
              <th className="py-2 px-4 border-b whitespace-nowrap">Status</th>
              <th className="py-2 px-4 border-b whitespace-nowrap">
                Select Date
              </th>
              <th className="py-2 px-4 border-b whitespace-nowrap">
                Select Time
              </th>
              <th className="py-2 px-4 border-b whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, index) => {
              const userAppt = userAppointments[doctor.email];
              const isBooked = !!userAppt;
              const status = userAppt?.status || "Not Booked";

              return (
                <tr key={index} className="text-center">
                  <td className="py-2 px-4 border-b">{doctor.name}</td>
                  <td className="py-2 px-4 border-b">
                    {doctor.specialist_category}
                  </td>
                  <td className="py-2 px-4 border-b">{status}</td>

                  <td className="py-2 px-4 border-b">
                    <input
                      type="date"
                      className="border rounded px-2 py-1"
                      onChange={(e) =>
                        handleChange(doctor.email, "date", e.target.value)
                      }
                      disabled={isBooked}
                      value={appointments[doctor.email]?.date || ""}
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="time"
                      className="border rounded px-2 py-1"
                      onChange={(e) =>
                        handleChange(doctor.email, "time", e.target.value)
                      }
                      disabled={isBooked}
                      value={appointments[doctor.email]?.time || ""}
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className={`px-3 py-1 rounded text-sm sm:text-base ${
                        isBooked
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                      onClick={() => handleBookAppointment(doctor.email)}
                      disabled={isBooked}
                    >
                      {isBooked ? status : "Book Appointment"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookAppointment;
