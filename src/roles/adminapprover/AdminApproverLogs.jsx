import { useState } from "react";
import SidebarAdminApprover from "../../components/SidebarAdminApprover";

function AdminApproverLogs() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 fixed top-0 left-0 z-40 h-screen ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <SidebarAdminApprover isOpen={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 p-8 overflow-y-auto bg-gray-100 ${
          sidebarOpen ? "ml-64" : "ml-16"
        } w-full`}
      >
        <h1 className="text-3xl font-bold text-primary mb-6">Logs</h1>

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

            {/* Logs Table */}
            <table className="min-w-full text-sm text-black">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="p-4 text-center">Description</th>
                  <th className="p-4 text-center">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-100 border-t border-gray-300">
                  <td className="p-4 text-center">Approved document submission</td>
                  <td className="p-4 text-center">July 15, 2025 10:45 AM</td>
                </tr>
                <tr className="hover:bg-gray-100 border-t border-gray-300">
                  <td className="p-4 text-center">Declined a document request</td>
                  <td className="p-4 text-center">July 14, 2025 03:22 PM</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminApproverLogs;
