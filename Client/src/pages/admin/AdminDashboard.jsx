import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Admin = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!token || user.role !== "admin") navigate("/login");
  }, [token, user, navigate]);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://staffpunches.vercel.app/api/staff", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaff(res.data.staff);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://staffpunches.vercel.app/api/staff", newStaff, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewStaff({ name: "", email: "", password: "" });
      fetchStaff();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create staff");
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm("Are you sure to delete this staff?")) return;
    try {
      await axios.delete(`https://staffpunches.vercel.app/api/staff/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStaff();
    } catch (err) {
      console.error(err);
      alert("Failed to delete staff");
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return; // Stop if user cancels

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="p-3 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-200 rounded px-4 py-2 mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          className="bg-green-500 text-white h-10 w-22 mr-2 md:ml-auto rounded hover:bg-green-800 duration-300 cursor-pointer"
          onClick={() => navigate("/admin/tasks")}
        >
          Add Task
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-800 duration-300 cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Admin Profile */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Admin Profile</h2>
        <p>
          <span className="font-medium">Name:</span> {user.name || "N/A"}
        </p>
        <p>
          <span className="font-medium">Email:</span> {user.email || "N/A"}
        </p>
      </div>

      {/* Create Staff Form */}
      <form
        onSubmit={handleCreateStaff}
        className="grid md:grid-cols-4 gap-2 mb-6 bg-white p-4 rounded shadow"
      >
        <input
          placeholder="Name"
          value={newStaff.name}
          onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
          required
          className="border p-2 rounded"
        />
        <input
          placeholder="Email"
          type="email"
          value={newStaff.email}
          onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
          required
          className="border p-2 rounded"
        />
        <input
          placeholder="Password"
          type="password"
          minLength={6}
          value={newStaff.password}
          onChange={(e) =>
            setNewStaff({ ...newStaff, password: e.target.value })
          }
          required
          className="border p-2 rounded"
        />
        <button className="bg-green-500 text-white px-4 py-2 cursor-pointer duration-300 rounded hover:bg-green-600">
          Add Staff
        </button>
      </form>

      {/* Staff Table */}
      {loading ? (
        <p>Loading staff...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border bg-white rounded shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s._id} className="border-t">
                  <td className="p-2">{s.name}</td>
                  <td className="p-2">{s.email}</td>
                  <td className="p-2 capitalize">{s.role}</td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/admin/staff-attendance/${s._id}`)
                      }
                      className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                    >
                      Attendance
                    </button>
                    <button
                      onClick={() => navigate(`/admin/staff-tasks/${s._id}`)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Tasks
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(s._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
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

export default Admin;
