// src/components/SidebarAdminApprover.jsx
import { Home, FileText, ClipboardList, Menu } from "lucide-react";
import { Link } from "react-router-dom";

function SidebarAdminApprover({ isOpen, setOpen }) {
  return (
    <aside
      className={`h-screen fixed top-0 left-0 z-50 bg-red-800 text-white transition-all duration-300 ease-in-out ${
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
          to="/adminapprover"
          className="flex items-center gap-2 p-2 rounded hover:bg-red-700 transition text-white"
        >
          <Home size={18} className="text-white" />
          {isOpen && <span className="text-white">Home</span>}
        </Link>
        <Link
          to="/adminapprover/documents"
          className="flex items-center gap-2 p-2 rounded hover:bg-red-700 transition text-white"
        >
          <FileText size={18} className="text-white" />
          {isOpen && <span className="text-white">Documents</span>}
        </Link>
        <Link
          to="/adminapprover/logs"
          className="flex items-center gap-2 p-2 rounded hover:bg-red-700 transition text-white"
        >
          <ClipboardList size={18} className="text-white" />
          {isOpen && <span className="text-white">Logs</span>}
        </Link>
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="mt-auto px-2 pb-4">
          <div className="bg-white text-red-800 rounded-lg shadow p-4">
            <div className="font-semibold">Jinu</div>
            <div className="text-sm">Admin Approver</div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default SidebarAdminApprover;
