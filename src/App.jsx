  import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import SuperAdminDashboard from "./roles/superadmin/SuperAdminDashboard";
import SuperAdminUsers from "./roles/superadmin/SuperAdminUsers";
import SuperAdminLogs from "./roles/superadmin/SuperAdminLogs";
import CoSuperAdminDashboard from "./roles/cosuperadmin/CoSuperAdminDashboard";
import CoSuperAdminAdmins from "./roles/cosuperadmin/CoSuperAdminAdmins";
import CoSuperAdminDepartments from "./roles/cosuperadmin/CoSuperAdminDepartments";
import CoSuperAdminThemes from "./roles/cosuperadmin/CoSuperAdminThemes";
import CoSuperAdminDocuments from "./roles/cosuperadmin/CoSuperAdminDocuments";
import CoSuperAdminLogs from "./roles/cosuperadmin/CoSuperAdminLogs";
import AdminCreatorDashboard from "./roles/admincreator/AdminCreatorDashboard";
import AdminCreatorDocuments from "./roles/admincreator/AdminCreatorDocuments";
import AdminCreatorLogs from "./roles/admincreator/AdminCreatorLogs";
import AdminApproverDashboard from "./roles/adminapprover/AdminApproverDashboard";
import AdminApproverDocuments from "./roles/adminapprover/AdminApproverDocuments";
import AdminApproverLogs from "./roles/adminapprover/AdminApproverLogs";
import UserChat from "./pages/user/UserChat";
import ResetPasswordPage from "./pages/ResetPasswordPage";

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
        <Route path="/cosuperadmin/admins" element={<CoSuperAdminAdmins />} />
        <Route path="/cosuperadmin/departments" element={<CoSuperAdminDepartments />} />
        <Route path="/cosuperadmin/themes" element={<CoSuperAdminThemes />} />
        <Route path="/cosuperadmin/documents" element={<CoSuperAdminDocuments />} />
        <Route path="/cosuperadmin/logs" element={<CoSuperAdminLogs />} />
        <Route path="/admincreator" element={<AdminCreatorDashboard />} />
        <Route path="/admincreator/logs" element={<AdminCreatorLogs />} />
        <Route path="/admincreator/documents" element={<AdminCreatorDocuments />} />
        <Route path="/adminapprover" element={<AdminApproverDashboard />} />
        <Route path="/adminapprover/documents" element={<AdminApproverDocuments />} />
        <Route path="/adminapprover/logs" element={<AdminApproverLogs />} />
        <Route path="/user/chat" element={<UserChat />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/chat/:convId" element={<UserChat />} />
        <Route path="/chat" element={<UserChat />} /> 
      </Routes>
    </Router>
  );
}

export default App;