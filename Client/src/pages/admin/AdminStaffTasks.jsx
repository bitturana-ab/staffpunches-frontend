import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminStaffTasks = () => {
  const { staffId } = useParams();
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token || user.role !== "admin") navigate("/login");
    fetchTasks();
  }, [staffId]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `https://staffpunches.vercel.app/api/tasks?assignedTo=${staffId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setTasks(res.data.tasks);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch tasks");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Tasks for Staff</h1>
      <button
        className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => navigate("/admin")}
      >
        Back to Dashboard
      </button>
      <table className="w-full border bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Due Date</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t._id}>
              <td className="p-2 border">{t.title}</td>
              <td className="p-2 border">{t.description}</td>
              <td className="p-2 border">{t.status}</td>
              <td className="p-2 border">
                {new Date(t.dueDate).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminStaffTasks;
