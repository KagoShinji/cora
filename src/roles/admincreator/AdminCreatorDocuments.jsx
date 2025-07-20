import { useState } from "react";
import SidebarAdminCreator from "../../components/SidebarAdminCreator"; // ✅ Correct component name
import { Upload, ScanLine, Pencil } from "lucide-react";

function AdminCreatorDocuments() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 h-screen fixed top-0 left-0 z-40 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <SidebarAdminCreator isOpen={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main content */}
      <main
        className={`transition-all duration-300 p-8 overflow-y-auto bg-gray-100 ${
          sidebarOpen ? "ml-64" : "ml-16"
        } w-full`}
      >
        <h1 className="text-3xl font-bold text-red-800 mb-6">Documents</h1>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Upload Documents */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-between">
            <Upload className="text-red-800 w-12 h-12 mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-4">Upload Documents</h2>
            <button className="!bg-red-800 text-white px-6 py-2 rounded hover:bg-red-700 transition">
              Upload
            </button>
          </div>

          {/* Scan Documents */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-between">
            <ScanLine className="text-red-800 w-12 h-12 mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-4">Scan Documents</h2>
            <button className="!bg-red-800 text-white px-6 py-2 rounded hover:bg-red-700 transition">
              Upload
            </button>
          </div>

          {/* Manual Entry */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-between">
            <Pencil className="text-red-800 w-12 h-12 mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-4">Manual Entry</h2>
            <button className="!bg-red-800 text-white px-6 py-2 rounded hover:bg-red-700 transition">
              Create
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminCreatorDocuments;