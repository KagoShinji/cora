import { useState } from "react";
import SidebarCoSuperAdmin from "../../components/SidebarCoSuperAdmin";

function CoSuperAdminDepartments() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 h-screen fixed top-0 left-0 z-40 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <SidebarCoSuperAdmin isOpen={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main content */}
      <main
        className={`transition-all duration-300 p-8 overflow-y-auto bg-gray-100 ${
          sidebarOpen ? "ml-64" : "ml-16"
        } w-full`}
      >
        {/* Header and Add Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-red-800">Departments</h1>
          <button className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 transition">
            Add Department
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full max-w-sm text-black"
          />
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-auto">
          <table className="min-w-full text-sm text-black">
            <thead className="bg-red-800 text-white">
              <tr>
                <th className="p-4 text-center">Department</th>
                <th className="p-4 text-center">Timestamp</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-100 border-t border-gray-300">
                <td className="p-4 text-center">Computer Science</td>
                <td className="p-4 text-center">July 15, 2025 09:00 AM</td>
                <td className="p-4 flex justify-center gap-2">
                  <button className="bg-red-800 text-white px-3 py-1 rounded hover:bg-red-700 transition">
                    Edit
                  </button>
                  <button className="bg-white text-red-800 border border-red-800 px-3 py-1 rounded hover:bg-red-100 transition">
                    Delete
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-100 border-t border-gray-300">
                <td className="p-4 text-center">Business Administration</td>
                <td className="p-4 text-center">July 12, 2025 03:15 PM</td>
                <td className="p-4 flex justify-center gap-2">
                  <button className="bg-red-800 text-white px-3 py-1 rounded hover:bg-red-700 transition">
                    Edit
                  </button>
                  <button className="bg-white text-red-800 border border-red-800 px-3 py-1 rounded hover:bg-red-100 transition">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default CoSuperAdminDepartments;