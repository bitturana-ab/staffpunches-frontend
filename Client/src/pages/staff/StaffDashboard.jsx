import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StaffDashboard = () => {
  const [attendance, setAttendance] = useState(null); // today's punch
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!token || user.role !== "staff") navigate("/login");
    fetchAttendance();
  }, []);

  // Fetch all attendance and get today's record
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://staffpunches.vercel.app/api/punch/me`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Find today's punch from all records
      const todayAttendance = res.data.records.find(
        (p) => new Date(p.punchIn) >= today,
      );

      setAttendance(todayAttendance || null);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  const handlePunchIn = async () => {
    try {
      await axios.post(
        `https://staffpunches.vercel.app/api/punch/punch-in`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchAttendance();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Punch in failed");
    }
  };

  const handlePunchOut = async () => {
    try {
      await axios.post(
        `https://staffpunches.vercel.app/api/punch/punch-out`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchAttendance();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Punch out failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-200 px-4 py-2 rounded-md mb-6">
        <h1 className="text-2xl font-bold">Staff Dashboard</h1>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-800 duration-300"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* User Info */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Profile</h2>
        <p>
          <span className="font-medium">Name:</span> {user.name || "N/A"}
        </p>
        <p>
          <span className="font-medium">Email:</span> {user.email || "N/A"}
        </p>
      </div>

      {/* Today's Attendance */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Today's Attendance</h2>
        {loading ? (
          <p>Loading...</p>
        ) : attendance ? (
          <div className="space-y-2">
            <p>
              Punch In:{" "}
              {attendance.punchIn
                ? new Date(attendance.punchIn).toLocaleTimeString()
                : "Not yet"}
            </p>
            <p>
              Punch Out:{" "}
              {attendance.punchOut
                ? new Date(attendance.punchOut).toLocaleTimeString()
                : "Not yet"}
            </p>
          </div>
        ) : (
          <p>No attendance recorded yet</p>
        )}

        <div className="mt-4 space-x-2">
          {!attendance?.punchIn && (
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={handlePunchIn}
            >
              Punch In
            </button>
          )}
          {attendance?.punchIn && !attendance?.punchOut && (
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              onClick={handlePunchOut}
            >
              Punch Out
            </button>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="space-x-4">
        <button
          onClick={() => navigate("/staff/tasks")}
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer duration-300 hover:bg-blue-600"
        >
          View Tasks
        </button>
        <button
          onClick={() => navigate("/staff/attendance")}
          className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer duration-300 hover:bg-gray-600"
        >
          View Attendance
        </button>
      </div>
    </div>
  );
};

export default StaffDashboard;
