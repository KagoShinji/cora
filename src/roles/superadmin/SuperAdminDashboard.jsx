// src/pages/superadmin/SuperAdminDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/SidebarSuperAdmin";
import { useAuthStore } from "../../stores/userStores";
import { useAppSettingsStore } from "../../stores/useSettingsStore";

// Modals
import ModalEditUser from "../../components/ModalEditUser";
import ModalConfirmDelete from "../../components/ModalConfirmDelete";
import { Menu } from "lucide-react";

function SuperAdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Responsive breakpoint (md < 768px)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767.98px)");
    const handler = (e) => setIsMobile(e.matches);
    handler(mql);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Optional: prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (!isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = sidebarOpen ? "hidden" : prev || "";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [isMobile, sidebarOpen]);

  // Stores
  const users = useAuthStore((state) => state.users);
  const fetchUsers = useAuthStore((state) => state.fetchUsers);
  const updateUser = useAuthStore((state) => state.updateUser);
  const deleteUser = useAuthStore((state) => state.deleteUser);

  // Search state (from Users page)
  const [search, setSearch] = useState("");

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const primaryColor = useAppSettingsStore((s) => s.primary_color) || "#3b82f6";

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Desktop offset: 17rem open / 5rem closed; Mobile: overlay (0 offset)
  const sidebarOffset = useMemo(
    () => (isMobile ? "0" : sidebarOpen ? "17rem" : "5rem"),
    [isMobile, sidebarOpen]
  );

  // Open edit modal
  const handleEditClick = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  // Save edits
  const handleUpdateUser = async (id, data) => {
    await updateUser(id, data);
    const { error } = useAuthStore.getState();
    if (!error) {
      alert("User updated successfully!");
      setShowEditModal(false);
      setEditingUser(null);
    } else {
      alert("Failed to update user: " + error);
      throw new Error(error);
    }
  };

  // Open delete modal
  const handleDeleteClick = (user) => {
    setDeletingUser(user);
    setDeleteError("");
    setShowDeleteModal(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    try {
      setIsDeleting(true);
      setDeleteError("");
      await deleteUser(deletingUser.id);
      const { error } = useAuthStore.getState();
      if (error) throw new Error(error);

      setShowDeleteModal(false);
      setDeletingUser(null);
      alert("User deleted successfully!");
    } catch (err) {
      setDeleteError(err?.message || "Failed to delete user.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filters
  const q = (search || "").toLowerCase();
  const filteredAdmins = (users || [])
    .filter((u) =>
      ["co-superadmin", "superadmin"].includes((u.role || "").toLowerCase())
    )
    .filter((u) => {
      const name = (u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      {/* Mobile backdrop (tap to close) */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar (mobile = drawer; desktop = collapsible) */}
      <div
        className={[
          "fixed top-0 left-0 h-screen z-50 transition-all duration-300",
          isMobile
            ? `w-64 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
            : `${sidebarOpen ? "w-64" : "w-16"}`
        ].join(" ")}
      >
        <Sidebar isOpen={sidebarOpen} setOpen={setSidebarOpen} isMobile={isMobile} />
      </div>

      {/* Main content (shifts on desktop, not on mobile) */}
      <main
        className="transition-all duration-300 p-6 overflow-y-auto bg-gray-50 w-full"
        style={{ marginLeft: sidebarOffset }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
{/* Mobile: burger + large title */}
<div className="md:hidden flex items-center gap-3 mb-2">
  <Menu
    onClick={() => setSidebarOpen(true)}
    role="button"
    tabIndex={0}
    aria-label="Open menu"
    className="h-6 w-6 cursor-pointer"
    style={{ color: primaryColor }}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") setSidebarOpen(true);
    }}
    aria-pressed={sidebarOpen}
  />
  <div className="flex-1">
    <h1
      className="text-2xl sm:text-3xl font-bold leading-tight"
      style={{ color: primaryColor }}
    >
      Dashboard
    </h1>
    <p className="text-xs sm:text-sm text-gray-600">
      Manage users and view system logs
    </p>
  </div>
</div>

{/* Desktop title */}
<div className="hidden md:block">
  <h1
    className="text-3xl font-bold leading-tight"
    style={{ color: primaryColor }}
  >
    Dashboard
  </h1>
  <p className="text-gray-600">Manage users and view system logs</p>
</div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Users Card */}
          <Link to="/superadmin/users" className="group">
            <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-blue-200 hover:-translate-y-1 overflow-hidden">
              <div className="absolute top-6 right-3 w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="absolute bottom-5 left-4 w-12 h-12 bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-full opacity-30"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg group-hover:shadow-blue-200 transition-all duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{users.length}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Total</div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  User Management
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  View, edit, and manage all system users. Control access permissions and user roles.
                </p>

                <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors">
                  <span>Manage Users</span>
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Logs Card */}
          <Link to="/superadmin/logs" className="group">
            <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-emerald-200 hover:-translate-y-1 overflow-hidden">
              <div className="absolute top-6 right-4 w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-tr from-emerald-50 to-teal-50 rounded-full opacity-30"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg group-hover:shadow-emerald-200 transition-all duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600">Live</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Status</div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  System Logs
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Monitor system activity, track user actions, and review audit trails for security.
                </p>

                <div className="flex items-center text-emerald-600 font-medium text-sm group-hover:text-emerald-700 transition-colors">
                  <span>View Logs</span>
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: primaryColor }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none"
                style={{ border: `2px solid ${primaryColor}`, backgroundColor: "#fff" }}
              />
            </div>
          </div>
        </div>

        {/* Users: Table on sm+ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">System Users</h3>
            <p className="text-sm text-gray-600 mt-1">{filteredAdmins.length} users found</p>
          </div>

          {/* Table (hidden on small screens) */}
          <div className="overflow-x-auto hidden sm:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdmins.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-25"}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                          style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}CC 100%)` }}
                        >
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          (user.role || "").toLowerCase() === "superadmin"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.position || "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-white !bg-blue-600 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                          onClick={() => handleEditClick(user)}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                          Edit
                        </button>
                        <button
                          className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-white !bg-red-600 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards (visible on small screens only) */}
          <div className="sm:hidden p-4 space-y-4">
            {filteredAdmins.map((user) => (
              <div key={user.id} className="rounded-xl border border-gray-200 shadow-sm p-4 bg-white">
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
                    style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}CC 100%)` }}
                  >
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 truncate">{user.name}</div>
                    <div className="text-sm text-gray-600 truncate">{user.email}</div>
                  </div>
                  <span
                    className={`ml-auto shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      (user.role || "").toLowerCase() === "superadmin"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>

                <div className="mt-3 text-sm text-gray-700">
                  <span className="font-medium">Position:</span> {user.position || "-"}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    className="px-3 py-2 rounded-md text-white !bg-blue-600 text-sm font-medium"
                    onClick={() => handleEditClick(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-2 rounded-md text-white !bg-red-600 text-sm font-medium"
                    onClick={() => handleDeleteClick(user)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {filteredAdmins.length === 0 && (
              <div className="text-center py-10 text-gray-500">No users found</div>
            )}
          </div>
        </div>

        {/* Edit User Modal */}
        <ModalEditUser
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingUser(null);
          }}
          onSave={handleUpdateUser}
          user={editingUser}
        />

        {/* Delete Confirmation Modal */}
        <ModalConfirmDelete
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeletingUser(null);
          }}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
          error={deleteError}
        />
      </main>
    </div>
  );
}

export default SuperAdminDashboard;
