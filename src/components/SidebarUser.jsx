import { Home, FilePen, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../stores/userStores";
import { useAppSettingsStore } from "../stores/useSettingsStore";

function SidebarUser({ isOpen, setOpen, onNewChat }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const signout = useAuthStore((state) => state.signout);

  const primaryColor = useAppSettingsStore((state) => state.primary_color);
  const secondaryColor = useAppSettingsStore((state) => state.secondary_color);

  const handleLogout = async () => {
    await signout();
    navigate("/");
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        style={{ backgroundColor: primaryColor || "#B91C1C" }}
        className={`h-screen fixed top-0 left-0 z-50 transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-16"
        } flex flex-col`}
      >
        {/* Toggle Button */}
        <div className="flex items-center justify-start p-4">
          <Menu
            onClick={() => setOpen(!isOpen)}
            className="cursor-pointer w-5 h-5 text-white"
          />
        </div>

        {/* Search Bar */}
        <div
          className={`px-4 mb-2 transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? "h-10 opacity-100" : "h-0 opacity-0"
          }`}
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 rounded bg-white text-black text-sm focus:outline-none focus:ring-1 focus:ring-white"
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 p-2 text-white">
          <div
            className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-red-800 transition"
            onClick={onNewChat}
          >
            <FilePen size={18} className="text-white" />
            {isOpen && <span className="font-semibold">New Chat</span>}
          </div>
        </nav>

        {/* Chat History */}
        <div
          className={`flex flex-col !text-white px-2 mt-2 overflow-y-auto sidebar-scroll transition-all duration-300 ease-in-out`}
        >
          <ul className="space-y-2 text-sm pl-2">
            {[
              "Tuition Fee Inquiry",
              "Enrollment Requirements",
              "Class Schedule",
              "Scholarship Info",
              "Subject Pre-requisites",
            ]
              .filter((chat) =>
                chat.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((chat, idx) => (
                <li
                  key={idx}
                  className="cursor-pointer truncate rounded p-2 hover:bg-red-800 text-left"
                >
                  {isOpen ? chat : ""}
                </li>
              ))}
          </ul>
        </div>

        {/* Footer */}
        {isOpen && (
          <div className="mt-auto px-2 pb-4">
            <div
              style={{ backgroundColor: secondaryColor || "#F3F4F6" }}
              onClick={() => setShowLogoutModal(true)}
              className="bg-white text-red-800 rounded-lg shadow p-4 cursor-pointer hover:bg-gray-100 transition"
            >
              <div className="font-semibold uppercase">{user || "Guest"}</div>
              <div className="text-sm">User</div>
            </div>
          </div>
        )}
      </aside>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold text-red-800 mb-4">
              Confirm Logout
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded !bg-white !border-primary hover:bg-gray-400 text-primary"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded !bg-primary hover:bg-red-900 text-white"
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

export default SidebarUser;
