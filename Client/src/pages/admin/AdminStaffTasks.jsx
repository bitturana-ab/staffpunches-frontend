import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminStaffTasks = () => {
  const { staffId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [staff, setStaff] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!token || user.role !== "admin") navigate("/login");
    fetchTasks();
  }, [staffId]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://staffpunches.vercel.app/api/task", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter tasks assigned to this staff
      const staffTasks = res.data.tasks.filter(
        (task) => task.assignedTo && task.assignedTo._id === staffId,
      );
      setTasks(staffTasks);

      // Get staff info from the first task (if available)
      if (staffTasks.length > 0 && staffTasks[0].assignedTo) {
        setStaff({
          name: staffTasks[0].assignedTo.name,
          email: staffTasks[0].assignedTo.email,
        });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Staff Tasks</h1>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={() => navigate("/admin")}
        >
          Back to Dashboard
        </button>
      </div>

      {/* Staff Info */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg font-semibold mb-2">Staff Info</h2>
        <p>
          <span className="font-medium">Name:</span> {staff.name || "N/A"}
        </p>
        <p>
          <span className="font-medium">Email:</span> {staff.email || "N/A"}
        </p>
      </div>

      {/* Tasks Table */}
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks assigned to this staff member.</p>
      ) : (
        <div className="overflow-x-auto">
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
              {tasks.map((task) => (
                <tr key={task._id} className="border-t">
                  <td className="p-2 border">{task.title}</td>
                  <td className="p-2 border">{task.description}</td>
                  <td className="p-2 border capitalize">{task.status}</td>
                  <td className="p-2 border">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "N/A"}
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

export default AdminStaffTasks;
