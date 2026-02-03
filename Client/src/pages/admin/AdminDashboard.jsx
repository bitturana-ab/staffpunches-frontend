import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Redirect if not admin
  useEffect(() => {
    if (!token || user.role !== "admin") {
      navigate("/login");
    }
  }, [token, user, navigate]);

  // Fetch all staff
  const fetchStaff = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("https://staffpunches.vercel.app/api/staff", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaff(res.data.staff);
    } catch (err) {
      console.error(err);
      setError("Failed to load staff data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Create new staff
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
      alert("Failed to create staff.");
    }
  };

  // Delete staff
  const handleDeleteStaff = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff?")) return;
    try {
      await axios.delete(`https://staffpunches.vercel.app/api/staff/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStaff();
    } catch (err) {
      console.error(err);
      alert("Failed to delete staff.");
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
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Create Staff */}
      <form
        onSubmit={handleCreateStaff}
        className="bg-white p-4 rounded shadow mb-6 md:flex grid gap-2"
      >
        <input
          className="border p-2 flex-1"
          placeholder="Name"
          value={newStaff.name}
          onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
          required
        />
        <input
          className="border p-2 flex-1"
          placeholder="Email"
          type="email"
          value={newStaff.email}
          onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
          required
        />
        <input
          className="border p-2 flex-1"
          placeholder="Password"
          type="password"
          minLength={6}
          value={newStaff.password}
          onChange={(e) =>
            setNewStaff({ ...newStaff, password: e.target.value })
          }
          required
        />
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Add Staff
        </button>
      </form>

      {/* Staff Table */}
      {loading ? (
        <p>Loading staff...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto ">
          <table className="border bg-white shadow rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s._id} className="border-t">
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{s.email}</td>
                  <td className="px-4 py-2 capitalize">{s.role}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      onClick={() => navigate(`/staff-attendance/${s._id}`)}
                    >
                      Attendance
                    </button>
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      onClick={() => navigate(`/staff-tasks/${s._id}`)}
                    >
                      Tasks
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDeleteStaff(s._id)}
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
