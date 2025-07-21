import { Home, FileText, ClipboardList, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function SidebarAdminCreator({ isOpen, setOpen }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <>
      <aside
        className={`h-screen fixed top-0 left-0 z-50 bg-primary text-white transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-16"
        } flex flex-col`}
      >
        {/* Toggle Icon */}
        <div className="flex items-center justify-start p-4 pl-4">
          <Menu onClick={() => setOpen(!isOpen)} className="cursor-pointer w-5 h-5 text-white" />
        </div>

        {/* Menu Links */}
        <nav className="flex flex-col gap-2 p-2">
          <Link
            to="/admincreator"
            className="flex items-center gap-2 p-2 rounded hover:bg-primary transition text-white"
          >
            <Home size={18} className="text-white" />
            {isOpen && <span className="text-white">Home</span>}
          </Link>
          <Link
            to="/admincreator/documents"
            className="flex items-center gap-2 p-2 rounded hover:bg-primary transition text-white"
          >
            <FileText size={18} className="text-white" />
            {isOpen && <span className="text-white">Documents</span>}
          </Link>
          <Link
            to="/admincreator/logs"
            className="flex items-center gap-2 p-2 rounded hover:bg-primary transition text-white"
          >
            <ClipboardList size={18} className="text-white" />
            {isOpen && <span className="text-white">Logs</span>}
          </Link>
        </nav>

        {/* Footer with Logout Trigger */}
        {isOpen && (
          <div className="mt-auto px-2 pb-4">
            <div
              onClick={() => setShowLogoutModal(true)}
              className="bg-white text-primary rounded-lg shadow p-4 cursor-pointer hover:bg-gray-100 transition"
            >
              <div className="font-semibold">Jinu</div>
              <div className="text-sm">Admin Creator</div>
            </div>
          </div>
        )}
      </aside>

      {/* Logout Modal */}
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

export default SidebarAdminCreator;