import { useState } from "react";
import Sidebar from "../../components/SidebarSuperAdmin";

function SuperAdminUsers() {
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

      {/* Main Content */}
      <main
        className={`transition-all duration-300 p-8 overflow-y-auto bg-gray-100 ${
          sidebarOpen ? "ml-64" : "ml-16"
        } w-full`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-red-800">Users</h1>
          <button className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 transition">
            Add User
          </button>
        </div>

        {/* Search bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full max-w-sm"
          />
        </div>

        {/* Table */}
        {/* Table */}
<div className="bg-white shadow-md rounded-lg overflow-auto">
  <table className="min-w-full text-sm text-black">
    <thead className="bg-red-800 text-white">
      <tr>
        <th className="p-4 text-center">User</th>
        <th className="p-4 text-center">Timestamp</th>
        <th className="p-4 text-center">Role</th>
        <th className="p-4 text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr className="hover:bg-gray-100 border-t border-gray-300">
        <td className="p-4 text-center">Coby</td>
        <td className="p-4 text-center">March 23, 2025 10:42 AM</td>
        <td className="p-4 text-center">Creator</td>
        <td className="p-4">
          <div className="flex justify-center gap-3">
            <button className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 transition">
              Edit
            </button>
            <button className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition">
              Delete
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

export default SuperAdminUsers;