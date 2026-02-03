import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Admin from "./pages/admin/AdminDashboard.jsx";
import Staff from "./pages/staff/StaffDashboard.jsx";
import Home from "./pages/Home.jsx";
import AdminStaffAttendance from "./pages/admin/AdminStaffAttendance.jsx";
import StaffAttendance from "./pages/staff/StaffAttendance.jsx";

const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Admin */}
      <Route path="/admin" element={<Admin />} />
      <Route
        path="/staff-attendance/:staffId"
        element={<AdminStaffAttendance />}
      />

      {/* Staff */}
      <Route path="/staff" element={<StaffAttendance />} />
    </Routes>
  );
};

export default App;
