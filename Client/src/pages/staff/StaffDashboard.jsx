import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StaffDashboard = () => {
  const [punch, setPunch] = useState({});
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token || user.role !== "staff") navigate("/login");
    fetchPunch();
    fetchTasks();
  }, []);

  const fetchPunch = async () => {
    try {
      const res = await axios.get(
        "https://staffpunches.vercel.app/api/punch/today",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setPunch(res.data.punch);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get("https://staffpunches.vercel.app/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data.tasks);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePunch = async (type) => {
    try {
      await axios.post(
        `https://staffpunches.vercel.app/api/punch/${type}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchPunch();
    } catch (err) {
      alert(err.response.data.message || "Failed to punch");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Staff Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Punch Section */}
      <div className="bg-white p-4 rounded shadow mb-6 flex gap-2">
        <button
          disabled={!!punch.punchIn}
          className={`px-4 py-2 rounded ${
            punch.punchIn ? "bg-gray-400" : "bg-green-500 text-white"
          }`}
          onClick={() => handlePunch("punchIn")}
        >
          Punch In
        </button>
        <button
          disabled={!!punch.lunchOut}
          className={`px-4 py-2 rounded ${
            punch.lunchOut ? "bg-gray-400" : "bg-yellow-500 text-white"
          }`}
          onClick={() => handlePunch("lunchOut")}
        >
          Lunch Out
        </button>
        <button
          disabled={!!punch.punchOut}
          className={`px-4 py-2 rounded ${
            punch.punchOut ? "bg-gray-400" : "bg-red-500 text-white"
          }`}
          onClick={() => handlePunch("punchOut")}
        >
          Punch Out
        </button>
      </div>

      {/* Task Section */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl mb-4">My Tasks</h2>
        {tasks.length === 0 ? (
          <p>No tasks assigned</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((t) => (
              <li
                key={t._id}
                className="border p-2 rounded flex justify-between"
              >
                <span>{t.title}</span>
                <span
                  className={`px-2 py-1 rounded ${
                    t.status === "completed" ? "bg-green-200" : "bg-yellow-200"
                  }`}
                >
                  {t.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
