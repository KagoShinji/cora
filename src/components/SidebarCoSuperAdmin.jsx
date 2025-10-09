import { Home, Landmark, Palette, ClipboardList, Menu, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { useAuthStore } from "../stores/userStores";
import { useAppSettingsStore } from "../stores/useSettingsStore";
import LogoutModal from "./LogoutModal"; // ← use the shared modal

function SidebarCoSuperAdmin({ isOpen, setOpen }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const primaryColor = useAppSettingsStore((state) => state.primary_color);
  const secondaryColor = useAppSettingsStore((state) => state.secondary_color);
  const getSettings = useAppSettingsStore((s) => s.getSettings);

  const signout = useAuthStore((state) => state.signout);

  const handleLogout = async () => {
    await signout();
    navigate("/login");
  };
  useEffect(() => {
      getSettings(); 
  }, [getSettings]);

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`h-screen fixed top-0 left-0 z-50 text-white transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-16"
        } flex flex-col`}
        style={{ backgroundColor: primaryColor || "#1D4ED8" }}
      >
        {/* Toggle Button */}
        <div className="flex items-center justify-start p-4 pl-4">
          <Menu
            onClick={() => setOpen(!isOpen)}
            className="cursor-pointer w-5 h-5 text-white"
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 p-2">
          {/* Home */}
          <Link
            to="/cosuperadmin"
            className="flex items-center gap-2 p-2 rounded hover:bg-primary transition text-white"
          >
            <Home size={18} className="text-white" />
            {isOpen && <span className="text-white">Home</span>}
          </Link>

          {/* Admins */}
          <Link
            to="/cosuperadmin/admins"
            className="flex items-center gap-2 p-2 rounded hover:bg-primary transition text-white"
          >
            <Users size={18} className="text-white" />
            {isOpen && <span className="text-white">Admins</span>}
          </Link>

          {/* Departments */}
          <Link
            to="/cosuperadmin/departments"
            className="flex items-center gap-2 p-2 rounded hover:bg-primary transition text-white"
          >
            <Landmark size={18} className="text-white" />
            {isOpen && <span className="text-white">Departments</span>}
          </Link>

          {/* Themes */}
          <Link
            to="/cosuperadmin/themes"
            className="flex items-center gap-2 p-2 rounded hover:bg-primary transition text-white"
          >
            <Palette size={18} className="text-white" />
            {isOpen && <span className="text-white">Themes</span>}
          </Link>

          {/* Logs 
          <Link
            to="/cosuperadmin/logs"
            className="flex items-center gap-2 p-2 rounded hover:bg-primary transition text-white"
          >
            <ClipboardList size={18} className="text-white" />
            {isOpen && <span className="text-white">Logs</span>}
          </Link>
          */}
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="mt-auto px-2 pb-4">
            <div
              onClick={() => setShowLogoutModal(true)}
              className="text-primary rounded-lg shadow p-4 cursor-pointer bg-white hover:bg-gray-100 transition"
            >
              <div style={{ color: secondaryColor }} className="font-semibold uppercase">
                {user}
              </div>
              <div style={{ color: secondaryColor }} className="text-sm">
                Co-Super Admin
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Shared Logout Modal via Portal */}
      <LogoutModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        primaryColor={primaryColor || "#1D4ED8"}
        // zIndexClass="z-[70]" // optional; default is already above the z-50 sidebar
      />
    </>
  );
}

export default SidebarCoSuperAdmin;
