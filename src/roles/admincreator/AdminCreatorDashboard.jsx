import { useState } from "react";
import { Link } from "react-router-dom";
import SidebarAdminCreator from "../../components/SidebarAdminCreator";

function AdminCreatorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-screen transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"}`}>
        <SidebarAdminCreator isOpen={sidebarOpen} setOpen={setSidebarOpen} />
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
          <Link to="/admincreator/documents">
            <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-center flex-col cursor-pointer hover:shadow-lg transition">
              <div className="text-4xl mb-2">📄</div>
              <h2 className="text-xl font-semibold text-red-800">Documents</h2>
            </div>
          </Link>
          <Link to="/admincreator/logs">
            <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-center flex-col cursor-pointer hover:shadow-lg transition">
              <div className="text-4xl mb-2">📝</div>
              <h2 className="text-xl font-semibold text-red-800">Logs</h2>
            </div>
          </Link>
        </div>

        {/* Logs Table */}
        <div className="bg-white shadow-md rounded-lg overflow-auto">
          <div className="p-4">
            <table className="min-w-full text-left text-sm text-black">
              <thead className="bg-red-800 text-white">
                <tr>
                  <th className="p-4">Description</th>
                  <th className="p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-300 hover:bg-gray-100">
                  <td className="p-4">Approved new student document</td>
                  <td className="p-4">July 15, 2025 09:10 AM</td>
                </tr>
                <tr className="border-t border-gray-300 hover:bg-gray-100">
                  <td className="p-4">Reviewed and rejected outdated form</td>
                  <td className="p-4">July 14, 2025 01:45 PM</td>
                </tr>
                <tr className="border-t border-gray-300 hover:bg-gray-100">
                  <td className="p-4">Logged in to Admin Panel</td>
                  <td className="p-4">July 14, 2025 08:00 AM</td>
                </tr>
                <tr className="border-t border-gray-300 hover:bg-gray-100">
                  <td className="p-4">Checked logs activity</td>
                  <td className="p-4">July 13, 2025 06:30 PM</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminCreatorDashboard;
