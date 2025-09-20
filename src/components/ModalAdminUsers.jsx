// src/components/ModalAdminUsers.jsx
import { useEffect, useState } from "react";
import { Search, X, Users, Filter } from "lucide-react";
import { useAuthStore } from "../stores/userStores";
import { useAppSettingsStore } from "../stores/useSettingsStore";

function ModalAdminUsers({ isOpen, onClose }) {
  const fetchUsers = useAuthStore((state) => state.fetchUsers);
  const users = useAuthStore((state) => state.users);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
<<<<<<< HEAD
=======

  // Theme primary color
  const primaryColor = useAppSettingsStore((s) => s.primary_color) || "#3b82f6";

  const allowedRoles = ["admincreator", "adminapprover"];
>>>>>>> 7bb83e5a08edaf31ea0dae7b10306f7bb481c622

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen, fetchUsers]);

<<<<<<< HEAD
  const filtered = users.filter((user) => {
    if (
      user.role?.toLowerCase() === "superadmin" ||
      user.role?.toLowerCase() === "co-superadmin"
    ) {
      return false;
    }

    const matchesSearch = (user.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;

    return matchesSearch && matchesRole;
  });
=======
  const filtered = users
    .filter((user) => allowedRoles.includes(user.role?.toLowerCase()))
    .filter((user) => {
      const matchesSearch =
        (user.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter ? user.role === roleFilter : true;
      return matchesSearch && matchesRole;
    });
>>>>>>> 7bb83e5a08edaf31ea0dae7b10306f7bb481c622

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-[9999] p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-7xl max-h-[90vh] flex flex-col relative overflow-hidden">
        {/* Header (No Gradient) */}
        <div className="bg-white px-8 py-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-xl">
                <Users className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Admin Users Management
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Manage administrative users and permissions
                </p>
              </div>
            </div>

            {/* Clickable X icon (no button wrapper) */}
            <X
              onClick={onClose}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                  e.preventDefault();
                  onClose();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Close modal"
              className="w-6 h-6 text-gray-500 hover:text-gray-800 cursor-pointer transition z-20"
            />
          </div>

<<<<<<< HEAD
          {/* Role Filter */}
          <div className="w-1/4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-600"
            >
              <option value="">All Roles</option>
              <option value="admincreator">Admin Creator</option>
              <option value="adminapprover">Admin Approver</option>
              <option value="user">User</option>
              {/* ⚠️ Notice: superadmin & co-superadmin removed here too */}
            </select>
          </div>
=======
          {/* Decorative Elements (kept) — ensure they don't block clicks */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 rounded-full blur-2xl pointer-events-none"></div>
>>>>>>> 7bb83e5a08edaf31ea0dae7b10306f7bb481c622
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Modern Search + Filter Section */}
          <div className="px-8 py-6 bg-gradient-to-b from-gray-50/80 to-white border-b border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm"
                />
              </div>

              {/* Role Filter */}
              <div className="relative w-full lg:w-64">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Filter className="w-5 h-5 text-gray-400" />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-700 shadow-sm appearance-none cursor-pointer"
                >
                  <option value="">All Roles</option>
                  <option value="admincreator">Admin Creator</option>
                  <option value="adminapprover">Admin Approver</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Results Counter */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 font-medium">
                  {filtered.length} admin user{filtered.length !== 1 ? 's' : ''} found
                </span>
              </div>
              {(search || roleFilter) && (
                <button
                  onClick={() => {
                    setSearch("");
                    setRoleFilter("");
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Loading/Error States */}
          {isLoading && (
            <div className="px-8 py-12 text-center">
              <div className="inline-flex items-center space-x-3">
                <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600 font-medium">Loading admin users...</span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="px-8 py-6">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <X className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-red-700 font-medium">Error: {error}</span>
                </div>
              </div>
            </div>
          )}

          {/* Users Table - Preserved Exactly, with themed avatar circle */}
          {!isLoading && (
            <div className="flex-1 px-8 pb-8 overflow-hidden">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
                {/* Table Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900">Admin Users</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {filtered.length} users found
                  </p>
                </div>

                <div className="flex-1 overflow-x-auto overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-800">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Department
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filtered.map((user, index) => (
                        <tr
                          key={user.id}
                          className={`hover:bg-gray-50 transition-colors duration-200 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-25"
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {/* Avatar circle themed by primaryColor */}
                                <div
                                  className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                                  style={{ background: primaryColor }}
                                >
                                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.role?.toLowerCase() === "admincreator"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {user.department || "-"}
                            </div>
                          </td>
                        </tr>
                      ))}

                      {/* Empty State */}
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-12 text-center">
                            <div className="flex flex-col items-center space-y-3">
                              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <Users className="w-8 h-8 text-gray-400" />
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-1">No users found</h3>
                                <p className="text-sm text-gray-500">
                                  {search || roleFilter ? "Try adjusting your search criteria" : "No admin users available"}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalAdminUsers;
