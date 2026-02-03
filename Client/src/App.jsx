import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Admin from "./pages/admin/AdminDashboard.jsx";
import Home from "./pages/Home.jsx";
import AdminStaffAttendance from "./pages/admin/AdminStaffAttendance.jsx";
import StaffAttendance from "./pages/staff/StaffAttendance.jsx";
import StaffDashboard from "./pages/staff/StaffDashboard.jsx";
import StaffTasks from "./pages/staff/StaffTasks.jsx";
import AdminTasks from "./pages/admin/AdminTasks.jsx";
import AdminStaffTasks from "./pages/admin/AdminStaffTasks.jsx";

const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Admin */}
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/tasks" element={<AdminTasks />} />
      <Route
        path="/admin/staff-attendance/:staffId"
        element={<AdminStaffAttendance />}
      />
      <Route path="/admin/staff-tasks/:staffId" element={<AdminStaffTasks />} />

      {/* Staff */}
      <Route path="/staff" element={<StaffDashboard />} />
      <Route path="/staff/attendance" element={<StaffAttendance />} />
      <Route path="/staff/tasks" element={<StaffTasks />} />
    </Routes>
  );
};

export default App;
