import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Admin from "./pages/admin/AdminDashboard.jsx";
import Staff from "./pages/staff/StaffDashboard.jsx";

const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/admin"
        element={user?.role === "admin" ? <Admin /> : <Navigate to="/" />}
      />

      <Route
        path="/staff"
        element={user?.role === "staff" ? <Staff /> : <Navigate to="/" />}
      />
    </Routes>
  );
};

export default App;
