import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const AdminStaffAttendance = () => {
  const { staffId } = useParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token || user?.role !== "admin") navigate("/login");
  }, [token, user, navigate]);

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(
        `https://staffpunches.vercel.app/api/punch/${staffId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setRecords(res.data.records);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [staffId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Staff Attendance Records</h1>

        <div className="space-x-2">
          <button
            onClick={() => navigate("/admin")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white p-4 rounded shadow">
        {loading ? (
          <p>Loading attendance...</p>
        ) : records.length === 0 ? (
          <p>No attendance found</p>
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

export default AdminStaffAttendance;
