// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import SuperAdminDashboard from "./roles/superadmin/SuperAdminDashboard";
import SuperAdminUsers from "./roles/superadmin/SuperAdminUsers";
import SuperAdminLogs from "./roles/superadmin/SuperAdminLogs";
import CoSuperAdminDashboard from "./roles/cosuperadmin/CoSuperAdminDashboard";
import CoSuperAdminDepartments from "./roles/cosuperadmin/CoSuperAdminDepartments";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/superadmin" element={<SuperAdminDashboard />} />
        <Route path="/superadmin/users" element={<SuperAdminUsers />} />
        <Route path="/superadmin/logs" element={<SuperAdminLogs />} />
        <Route path="/cosuperadmin" element={<CoSuperAdminDashboard />} />
        <Route path="/cosuperadmin/departments" element={<CoSuperAdminDepartments />} />
      </Routes>
    </Router>
  );
}

export default App;
