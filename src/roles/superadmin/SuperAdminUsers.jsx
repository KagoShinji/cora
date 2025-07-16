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

      {/* Main content */}
      <main
        className={`transition-all duration-300 p-8 overflow-y-auto bg-gray-100 ${
          sidebarOpen ? "ml-64" : "ml-16"
        } w-full`}
      >
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
        <div className="bg-white shadow-md rounded-lg overflow-auto">
          <table className="min-w-full text-left text-sm text-black">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Role</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-300">
                <td className="p-4">Coby</td>
                <td className="p-4">March 23, 2025 10:42 AM</td>
                <td className="p-4">Creator</td>
                <td className="p-4 flex gap-2">
                  <button className="bg-red-800 text-white px-3 py-1 rounded hover:bg-red-700 transition">Edit</button>
                  <button className="bg-white text-red-800 border border-red-800 px-3 py-1 rounded hover:bg-red-100 transition">Delete</button>
                </td>
              </tr>
              {/* Add more user rows here */}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default SuperAdminUsers;