// src/components/ModalAdminUsers.jsx
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useAuthStore } from "../stores/userStores";

function ModalAdminUsers({ isOpen, onClose }) {
  const fetchUsers = useAuthStore((state) => state.fetchUsers);
  const users = useAuthStore((state) => state.users);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const [search, setSearch] = useState("");

  // Fetch users when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen, fetchUsers]);

  const filtered = users.filter((user) =>
    (user.name || "").toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-[9999]">
      <div className="bg-white rounded-2xl shadow-2xl border w-full max-w-6xl p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 !bg-primary  text-white hover:text-red-600 transition"
        >
          ✖
        </button>

        <h2 className="text-3xl font-bold mb-6 text-primary text-center">
          Users
        </h2>

        {/* Search */}
<div className="relative w-1/3 mb-6">
  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
    <Search size={18} />
  </span>
  <input
    type="text"
    placeholder="Search admins..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
  />
</div>

        {/* Loading/Error States */}
        {isLoading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {/* Admin Users Table */}
        <div className="overflow-auto max-h-[500px] border rounded-xl">
          <table className="min-w-full text-sm text-black">
            <thead className="bg-primary text-white text-base">
              <tr>
                <th className="p-4 text-center">Name</th>
                <th className="p-4 text-center">Email</th>
                <th className="p-4 text-center">Role</th>
                <th className="p-4 text-center">Department</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-100">
                  <td className="p-4 text-center">{user.name}</td>
                  <td className="p-4 text-center">{user.email}</td>
                  <td className="p-4 text-center">{user.role}</td>
                  <td className="p-4 text-center">{user.department}</td>
                </tr>
              ))}
              {filtered.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500">
                    No Users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ModalAdminUsers;
