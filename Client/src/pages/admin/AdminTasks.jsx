import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
  });
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token || user.role !== "admin") navigate("/login");
  }, [token, user, navigate]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://staffpunches.vercel.app/api/task", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data.tasks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await axios.get("https://staffpunches.vercel.app/api/staff", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaffList(res.data.staff);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchStaff();
  }, []);

  const handleAssignTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://staffpunches.vercel.app/api/task", newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewTask({ title: "", description: "", assignedTo: "", dueDate: "" });
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign task");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Task Dashboard</h1>
        <button
          className="bg-gray-500 text-white h-10 p-1 mr-2 md:ml-auto rounded hover:bg-gray-800 duration-300 cursor-pointer"
          onClick={() => navigate("/admin")}
        >
          Dashboard
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Assign Task */}
      <form
        onSubmit={handleAssignTask}
        className="md:grid md:grid-cols-4 gap-2 mb-6 bg-white p-4 rounded shadow"
      >
        <input
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
          className="border p-2 m-3 rounded"
        />
        <input
          placeholder="Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          required
          className="border p-2 m-3 rounded"
        />
        <select
          value={newTask.assignedTo}
          onChange={(e) =>
            setNewTask({ ...newTask, assignedTo: e.target.value })
          }
          required
          className="border p-2 m-3 rounded"
        >
          <option value="">Assign To</option>
          {staffList.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          required
          className="border p-2 m-3 rounded"
        />
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 col-span-4 md:col-span-1">
          Assign Task
        </button>
      </form>

      {/* Task Table */}
      <div className="bg-white p-4 overflow-x-auto rounded shadow">
        <h2 className="text-lg font-semibold mb-3">All Tasks</h2>
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks assigned</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Assigned To</th>
                <th className="p-2 border">Due Date</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t._id}>
                  <td className="p-2 border">{t.title}</td>
                  <td className="p-2 border">{t.description}</td>
                  <td className="p-2 border">{t.assignedTo.name}</td>
                  <td className="p-2 border">
                    {new Date(t.dueDate).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminTasks;
