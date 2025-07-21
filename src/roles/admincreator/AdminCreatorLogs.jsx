import { useState } from "react";
import SidebarAdminCreator from "../../components/SidebarAdminCreator";

function AdminCreatorLogs() {
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
        <SidebarAdminCreator isOpen={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main content */}
      <main
        className={`transition-all duration-300 p-8 overflow-y-auto bg-gray-100 ${
          sidebarOpen ? "ml-64" : "ml-16"
        } w-full`}
      >
        <h1 className="text-3xl font-bold text-primary mb-6">Logs</h1>

        {/* Logs Table with Search */}
        <div className="bg-white shadow-md rounded-lg overflow-auto">
          <div className="p-4">
            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 w-full max-w-sm text-black"
              />
            </div>

            {/* Table */}
            <table className="min-w-full text-sm">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="p-4 text-center align-middle">Description</th>
                  <th className="p-4 text-center align-middle">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-100 border-t">
                  <td className="p-4 text-black text-center align-middle">
                    Approved new student document
                  </td>
                  <td className="p-4 text-black text-center align-middle">
                    July 15, 2025 09:10 AM
                  </td>
                </tr>
                <tr className="hover:bg-gray-100 border-t">
                  <td className="p-4 text-black text-center align-middle">
                    Reviewed and rejected outdated form
                  </td>
                  <td className="p-4 text-black text-center align-middle">
                    July 14, 2025 01:45 PM
                  </td>
                </tr>
                <tr className="hover:bg-gray-100 border-t">
                  <td className="p-4 text-black text-center align-middle">
                    Logged in to Admin Panel
                  </td>
                  <td className="p-4 text-black text-center align-middle">
                    July 14, 2025 08:00 AM
                  </td>
                </tr>
                <tr className="hover:bg-gray-100 border-t">
                  <td className="p-4 text-black text-center align-middle">
                    Checked logs activity
                  </td>
                  <td className="p-4 text-black text-center align-middle">
                    July 13, 2025 06:30 PM
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminCreatorLogs;