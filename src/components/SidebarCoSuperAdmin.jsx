import { Home, Landmark, Palette, ClipboardList, Menu, Users } from "lucide-react"; // Added Users icon
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../stores/userStores";

function SidebarCoSuperAdmin({ isOpen, setOpen }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore((state)=>state.user)


  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`h-screen fixed top-0 left-0 z-50 bg-primary text-white transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-16"
        } flex flex-col`}
      >
        {/* Toggle Button */}
        <div className="flex items-center justify-start p-4 pl-4">
          <Menu onClick={() => setOpen(!isOpen)} className="cursor-pointer w-5 h-5 text-white" />
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

          {/* Logs */}
          <Link
            to="/cosuperadmin/logs"
            className="flex items-center gap-2 p-2 rounded hover:bg-primary transition text-white"
          >
            <ClipboardList size={18} className="text-white" />
            {isOpen && <span className="text-white">Logs</span>}
          </Link>
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="mt-auto px-2 pb-4">
            <div
              onClick={() => setShowLogoutModal(true)}
              className="bg-white text-primary rounded-lg shadow p-4 cursor-pointer hover:bg-gray-100 transition"
            >
              <div className="font-semibold uppercase">{user}</div>
              <div className="text-sm">Co-Super Admin</div>
            </div>
          </div>
        )}
      </aside>

      {/* Modal for Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold text-primary mb-4">Confirm Logout</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded !bg-primary hover:bg-gray-300 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded !bg-green-700 hover:bg-primary text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SidebarCoSuperAdmin;
