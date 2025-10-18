import { Home, FileText, ClipboardList, ChevronDown, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState,useEffect } from "react";
import { useAuthStore } from "../stores/userStores";
import { useAppSettingsStore } from "../stores/useSettingsStore";
import LogoutModal from "./LogoutModal";

function SidebarAdminApprover({ isOpen, setOpen }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false); // Collapsible state

  const user = useAuthStore((state) => state.user);
  const signout = useAuthStore((state) => state.signout);

  const primaryColor = useAppSettingsStore((state) => state.primary_color) || "#1D4ED8";
  const secondaryColor = useAppSettingsStore((state) => state.secondary_color) || "#F3F4F6";
  const getSettings = useAppSettingsStore((s) => s.getSettings);

  const handleLogout = async () => {
    await signout();
    window.location.href = "/login"; // keep behavior as-is
  };
  useEffect(() => {
        getSettings(); 
    }, [getSettings]);
  return (
    <>
      <aside
        className="h-screen fixed top-0 left-0 z-50 text-white transition-all duration-300 ease-in-out flex flex-col"
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
            className="flex items-center gap-2 p-2 rounded transition text-white hover:bg-gray-200/20"
            style={{ color: "white" }}
          >
            <Home size={18} />
            {isOpen && <span>Home</span>}
          </Link>

          {/* Collapsible Documents Menu */}
          <div className="flex flex-col rounded transition cursor-pointer">
            <div
              className="flex items-center justify-between gap-2 p-2 rounded hover:bg-gray-200/20"
              onClick={() => setDocsOpen(!docsOpen)}
            >
              <div className="flex items-center gap-2">
                <FileText size={18} />
                {isOpen && <span>Documents</span>}
              </div>
              {isOpen && (
                <ChevronDown
                  size={16}
                  className={`transition-transform ${docsOpen ? "rotate-180" : "rotate-0"}`}
                />
              )}
            </div>

            {/* Submenu */}
            {docsOpen && isOpen && (
              <div className="flex flex-col ml-6">
                <Link to="/adminapprover/documents" className="p-2 rounded transition !text-white text-sm">
                  Approve Documents
                </Link>
                <Link to="/adminapprover/uploaddocuments" className="p-2 rounded transition !text-white text-sm">
                  Upload Documents
                </Link>
              </div>
            )}
          </div>
            {/* 
          <Link
            to="/adminapprover/logs"
            className="flex items-center gap-2 p-2 rounded hover:bg-primary transition"
            style={{ color: "white" }}
          >
            <ClipboardList size={18} />
            {isOpen && <span>Logs</span>}
          </Link>
          */}
        </nav>
        

        {/* Footer with Logout Trigger */}
        {isOpen && (
          <div className="mt-auto px-2 pb-4">
            <div
              onClick={() => setShowLogoutModal(true)}
              className="rounded-lg shadow p-4 cursor-pointer hover:bg-gray-100 transition "
              style={{backgroundColor:secondaryColor}}
            >
              <div style={{ color: secondaryColor }} className="font-semibold uppercase">
                {user}
              </div>
              <div style={{ color: secondaryColor }} className="text-sm">
                Admin Approver
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
        primaryColor={primaryColor}
      />
    </>
  );
}

export default SidebarAdminApprover;
