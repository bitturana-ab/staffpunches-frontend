import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StaffAttendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!token || user.role !== "staff") navigate("/login");
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://staffpunches.vercel.app/api/punch/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      // Assuming the API returns attendance records in res.data.records
      setRecords(res.data.records || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-sm md:text-2xl font-bold">My Attendance Records</h1>
        <button
          onClick={() => navigate("/staff")}
          className="bg-gray-500 text-white px-4 py-2 text-sm md:text-xl cursor-pointer duration-300 rounded hover:bg-gray-600"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Attendance Table */}
      {loading ? (
        <p>Loading attendance...</p>
      ) : records.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <div className="overflow-x-auto">
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
                <tr key={r._id} className="border-t">
                  <td className="p-2 border">
                    {r.punchIn
                      ? new Date(r.punchIn).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="p-2 border">
                    {r.punchIn ? new Date(r.punchIn).toLocaleTimeString() : "—"}
                  </td>
                  <td className="p-2 border">
                    {r.punchOut
                      ? new Date(r.punchOut).toLocaleTimeString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffAttendance;
