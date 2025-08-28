import { Home, FileText, ClipboardList, Upload, ChevronDown, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../stores/userStores";
import { useAppSettingsStore } from "../stores/useSettingsStore"; 

function SidebarAdminApprover({ isOpen, setOpen }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false); // Collapsible state
  const user = useAuthStore((state) => state.user);
  const signout = useAuthStore((state) => state.signout);

  const primaryColor = useAppSettingsStore((state) => state.primary_color) || "#1D4ED8";
  const secondaryColor = useAppSettingsStore((state) => state.secondary_color) || "#F3F4F6";

  const handleLogout = async () => {
    await signout();
    window.location.href = "/login";
  };

  return (
    <>
      <aside
        className={`h-screen fixed top-0 left-0 z-50 text-white transition-all duration-300 ease-in-out flex flex-col`}
        style={{ width: isOpen ? "16rem" : "4rem", backgroundColor: primaryColor }}
      >
        {/* Toggle Icon */}
        <div className="flex items-center justify-start p-4">
          <Menu onClick={() => setOpen(!isOpen)} className="cursor-pointer w-5 h-5 text-white" />
        </div>

        {/* Menu Links */}
        <nav className="flex flex-col gap-2 p-2">
          <Link
            to="/adminapprover"
            className="flex items-center gap-2 p-2 rounded hover:bg-primary transition"
            style={{ color: "white" }}
          >
            <Home size={18} />
            {isOpen && <span>Home</span>}
          </Link>

          {/* Collapsible Documents Menu */}
          <div
            className="flex flex-col rounded transition cursor-pointer"
          >
            <div
              className="flex items-center justify-between gap-2 p-2"
              onClick={() => setDocsOpen(!docsOpen)}
            >
              <div className="flex items-center gap-2 ">
                <FileText size={18} />
                {isOpen && <span>Documents</span>}
              </div>
              {isOpen && <ChevronDown size={16} className={`transition-transform ${docsOpen ? "rotate-180" : "rotate-0"}`} />}
            </div>

            {/* Submenu */}
            {docsOpen && isOpen && (
              <div className="flex flex-col ml-6">
                <Link
                  to="/adminapprover/documents"
                  className="p-2 rounded transition !text-white text-sm"
                >
                  Approve Documents
                </Link>
                <Link
                  to="/adminapprover/uploaddocuments"
                  className="p-2 rounded transition !text-white text-sm"
                >
                  Upload Documents
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/adminapprover/logs"
            className="flex items-center gap-2 p-2 rounded hover:bg-primary transition"
            style={{ color: "white" }}
          >
            <ClipboardList size={18} />
            {isOpen && <span>Logs</span>}
          </Link>
        </nav>

        {/* Footer with Logout Trigger */}
        {isOpen && (
          <div className="mt-auto px-2 pb-4">
            <div
              onClick={() => setShowLogoutModal(true)}
              className="rounded-lg shadow p-4 cursor-pointer hover:bg-gray-100 transition"
              style={{ backgroundColor: secondaryColor, color: primaryColor }}
            >
              <div className="font-semibold uppercase">{user}</div>
              <div className="text-sm">Admin Approver</div>
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
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
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

export default SidebarAdminApprover;
