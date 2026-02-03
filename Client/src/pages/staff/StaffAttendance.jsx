import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StaffAttendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token || user?.role !== "staff") {
      navigate("/login");
    }
  }, [token, user, navigate]);

  const fetchMyAttendance = async () => {
    try {
      const res = await axios.get(
        "https://staffpunches.vercel.app/api/punch/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setRecords(res.data.records);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAttendance();
  }, []);

  const handlePunchIn = async () => {
    try {
      await axios.post(
        "https://staffpunches.vercel.app/api/punch/punch-in",
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchMyAttendance();
    } catch (err) {
      alert(err.response?.data?.message || "Punch-in failed");
    }
  };

  const handlePunchOut = async () => {
    try {
      await axios.post(
        "https://staffpunches.vercel.app/api/punch/punch-out",
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchMyAttendance();
    } catch (err) {
      alert(err.response?.data?.message || "Punch-out failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const todayRecord = records[0];

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Staff Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
        </div>

        <div className="space-x-2">
          <button
            onClick={() => navigate("/staff")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Dashboard
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Punch Buttons */}
      <div className="bg-white p-6 rounded shadow max-w-md mb-6">
        <button
          onClick={handlePunchIn}
          disabled={todayRecord?.punchIn}
          className="w-full mb-3 bg-green-500 text-white py-2 rounded disabled:opacity-50"
        >
          Punch In
        </button>

        <button
          onClick={handlePunchOut}
          disabled={!todayRecord?.punchIn || todayRecord?.punchOut}
          className="w-full bg-blue-500 text-white py-2 rounded disabled:opacity-50"
        >
          Punch Out
        </button>
      </div>

      {/* Attendance Table */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-3">Attendance History</h2>

        {loading ? (
          <p>Loading...</p>
        ) : records.length === 0 ? (
          <p>No records found</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Punch In</th>
                <th className="p-2 border">Punch Out</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r._id}>
                  <td className="p-2 border">
                    {new Date(r.punchIn).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">
                    {new Date(r.punchIn).toLocaleTimeString()}
                  </td>
                  <td className="p-2 border">
                    {r.punchOut
                      ? new Date(r.punchOut).toLocaleTimeString()
                      : "--"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StaffAttendance;
