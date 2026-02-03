import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StaffTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token || user.role !== "staff") navigate("/login");
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://staffpunches.vercel.app/api/task/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setTasks(res.data.tasks);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (taskId, status) => {
    try {
      await axios.put(
        `https://staffpunches.vercel.app/api/task/${taskId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Failed to update task");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
      <button
        onClick={() => navigate("/staff")}
        className="bg-gray-500 text-white px-4 py-2 rounded mb-4 hover:bg-gray-600"
      >
        Back to Dashboard
      </button>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <table className="w-full border bg-white rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Due Date</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Update Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t._id}>
                <td className="p-2 border">{t.title}</td>
                <td className="p-2 border">{t.description}</td>
                <td className="p-2 border">
                  {new Date(t.dueDate).toLocaleDateString()}
                </td>
                <td className="p-2 border">{t.status}</td>
                <td className="p-2 border space-x-2">
                  {["pending", "in-progress", "completed"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(t._id, status)}
                      className={`px-2 py-1 rounded ${
                        t.status === status
                          ? "bg-green-400 text-white"
                          : "bg-gray-300 text-black"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StaffTasks;
