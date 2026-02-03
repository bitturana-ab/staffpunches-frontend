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
    if (!token || user.role !== "staff") navigate("/login");
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://staffpunches.vercel.app/api/attendance/me/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setRecords(res.data.attendance);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">My Attendance Records</h1>
      <button
        onClick={() => navigate("/staff")}
        className="bg-gray-500 text-white px-4 py-2 rounded mb-4 hover:bg-gray-600"
      >
        Back to Dashboard
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border bg-white rounded shadow">
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
                  {new Date(r.date).toLocaleDateString()}
                </td>
                <td className="p-2 border">
                  {r.punchIn ? new Date(r.punchIn).toLocaleTimeString() : "—"}
                </td>
                <td className="p-2 border">
                  {r.punchOut ? new Date(r.punchOut).toLocaleTimeString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StaffAttendance;
