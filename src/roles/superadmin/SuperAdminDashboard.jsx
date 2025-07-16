import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/SidebarSuperAdmin";

function SuperAdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-screen transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"}`}>
        <Sidebar isOpen={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main content */}
      <main
        className={`transition-all duration-300 flex-1 p-8 overflow-y-auto bg-gray-100 ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <h1 className="text-3xl font-bold text-red-800 mb-6">Dashboard</h1>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Link to="/superadmin/users">
            <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-center flex-col cursor-pointer hover:shadow-lg transition">
              <div className="text-4xl mb-2">👤</div>
              <h2 className="text-xl font-semibold text-red-800">Users</h2>
            </div>
          </Link>
          <Link to="/superadmin/logs">
            <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-center flex-col cursor-pointer hover:shadow-lg transition">
              <div className="text-4xl mb-2">📝</div>
              <h2 className="text-xl font-semibold text-red-800">Logs</h2>
            </div>
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Roles</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-4">Coby</td>
                <td className="p-4">March 23, 2025 10:42 AM</td>
                <td className="p-4">Creator</td>
                <td className="p-4 flex gap-2">
                  <button className="text-blue-600 hover:underline">Edit</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default SuperAdminDashboard;