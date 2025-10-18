import { Home, Users, ClipboardList, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { useAuthStore } from "../stores/userStores";
import { useAppSettingsStore } from "../stores/useSettingsStore";
import LogoutModal from "./LogoutModal"; // ← use the shared modal

function SidebarSuperAdmin({ isOpen, setOpen }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const getSettings = useAppSettingsStore((s) => s.getSettings);
  const primaryColor = useAppSettingsStore((state) => state.primary_color);
  const secondaryColor = useAppSettingsStore((state) => state.secondary_color);

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
        style={{ backgroundColor: primaryColor || "#1D4ED8" }}
        className={`h-screen fixed top-0 left-0 z-50 transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-16"
        } flex flex-col`}
      >
        {/* Toggle Button */}
        <div className="flex items-center justify-start p-4 pl-4">
          <Menu
            onClick={() => setOpen(!isOpen)}
            className="cursor-pointer w-5 h-5 !text-white"
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 p-2 text-white">
          <Link
            to="/superadmin"
            className="flex items-center gap-2 p-2 rounded transition text-white hover:bg-gray-200/20"
          >
            <Home size={18} className="!text-white" />
            {isOpen && <span className="!text-white">Home</span>}
          </Link>
          <Link
            to="/superadmin/users"
            className="flex items-center gap-2 p-2 rounded transition text-white hover:bg-gray-200/20"
          >
            <Users size={18} className="!text-white" />
            {isOpen && <span className="!text-white">Users</span>}
          </Link>
          {/* <Link
            to="/superadmin/logs"
            className="flex items-center gap-2 p-2 rounded hover:bg-primary transition !text-white"
          >
            <ClipboardList size={18} className="!text-white" />
            {isOpen && <span className="!text-white">Logs</span>}
          </Link>
          */}
        </nav>
        

        {/* Footer */}
        {isOpen && (
          <div className="mt-auto px-2 pb-4"style={{backgroundColor:secondaryColor}}>
            <div
              onClick={() => setShowLogoutModal(true)}
              className="bg-white text-primary rounded-lg shadow p-4 cursor-pointer hover:bg-gray-100 transition"
            >
              <div
                style={{ color: primaryColor }}
                className="font-semibold uppercase"
              >
                {user}
              </div>
              <div style={{ color: primaryColor }} className="text-sm">
                Super Admin
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
        // zIndexClass="z-[70]" // optional; default already above z-50 sidebar
      />
    </>
  );
}

export default SidebarSuperAdmin;
