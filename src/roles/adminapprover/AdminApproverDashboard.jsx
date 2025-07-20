import { useState } from "react";
import { Link } from "react-router-dom";
import SidebarAdminApprover from "../../components/SidebarAdminApprover";

function AdminApproverDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-screen transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"}`}>
        <SidebarAdminApprover isOpen={sidebarOpen} setOpen={setSidebarOpen} />
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
          <Link to="/adminapprover/documents">
            <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-center flex-col cursor-pointer hover:shadow-lg transition">
              <div className="text-4xl mb-2">📄</div>
              <h2 className="text-xl font-semibold text-red-800">Documents</h2>
            </div>
          </Link>
          <Link to="/adminapprover/logs">
            <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-center flex-col cursor-pointer hover:shadow-lg transition">
              <div className="text-4xl mb-2">📝</div>
              <h2 className="text-xl font-semibold text-red-800">Logs</h2>
            </div>
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-red-800 text-white">
              <tr>
                <th className="p-4 text-center">Document</th>
                <th className="p-4 text-center">Submitted By</th>
                <th className="p-4 text-center">Timestamp</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-100">
                <td className="p-4 text-center">Request Form</td>
                <td className="p-4 text-center">Alex</td>
                <td className="p-4 text-center">March 25, 2025 10:30 AM</td>
                <td className="p-4 text-center text-yellow-500 font-semibold">Pending</td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="!bg-green-600 !text-white px-4 py-2 rounded-md hover:!bg-green-700 transition-colors">
                      Approve
                    </button>
                    <button className="!bg-red-800 !text-white px-4 py-2 rounded-md hover:!bg-red-700 transition-colors">
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default AdminApproverDashboard;