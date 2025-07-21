import { useState } from "react";
import Sidebar from "../../components/SidebarSuperAdmin";

function SuperAdminLogs() {
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
        <Sidebar isOpen={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main content */}
      <main
        className={`transition-all duration-300 p-8 overflow-y-auto bg-gray-100 ${
          sidebarOpen ? "ml-64" : "ml-16"
        } w-full`}
      >
        <h1 className="text-3xl font-bold text-primary mb-6">Logs</h1>

        {/* Logs Card with Search */}
        <div className="bg-white shadow-md rounded-lg overflow-auto">
          <div className="p-4">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 w-full max-w-sm text-black"
              />
            </div>
            <table className="min-w-full text-sm text-black">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="p-4 text-center">Description</th>
                  <th className="p-4 text-center">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-100 border-t border-gray-300">
                  <td className="p-4 text-center">User Coby updated profile</td>
                  <td className="p-4 text-center">March 23, 2025 10:42 AM</td>
                </tr>
                <tr className="hover:bg-gray-100 border-t border-gray-300">
                  <td className="p-4 text-center">Admin Raven created a new user</td>
                  <td className="p-4 text-center">March 24, 2025 09:15 AM</td>
                </tr>
                <tr className="hover:bg-gray-100 border-t border-gray-300">
                  <td className="p-4 text-center">Super Admin logged in</td>
                  <td className="p-4 text-center">March 25, 2025 08:30 AM</td>
                </tr>
                <tr className="hover:bg-gray-100 border-t border-gray-300">
                  <td className="p-4 text-center">User Mira deleted an inquiry</td>
                  <td className="p-4 text-center">March 25, 2025 01:05 PM</td>
                </tr>
                <tr className="hover:bg-gray-100 border-t border-gray-300">
                  <td className="p-4 text-center">System backup completed successfully</td>
                  <td className="p-4 text-center">March 26, 2025 12:00 AM</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SuperAdminLogs;