import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/SidebarCoSuperAdmin";
import ModalAddAdmins from "../../components/ModalAddAdmins";
import ModalEditAdmins from "../../components/ModalEditAdmins";
import ModalConfirmDelete from "../../components/ModalConfirmDelete";
import { useAuthStore } from "../../stores/userStores";
import { useAppSettingsStore } from "../../stores/useSettingsStore";
import { userDelete, userUpdate } from "../../api/api";
import { Menu } from "lucide-react";

function CoSuperAdminAdmins() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchUsers = useAuthStore((state) => state.fetchUsers);
  const users = useAuthStore((state) => state.users);
  const signup = useAuthStore((state) => state.signup);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Theme color for titles/borders/avatars
  const primaryColor = useAppSettingsStore((s) => s.primary_color) || "#3b82f6";

  // Responsive breakpoint (md < 768px)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767.98px)");
    const handler = (e) => setIsMobile(e.matches);
    handler(mql);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (!isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = sidebarOpen ? "hidden" : prev || "";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [isMobile, sidebarOpen]);

  // Desktop offset: 17rem open / 5rem closed; Mobile: overlay (0 offset)
  const sidebarOffset = useMemo(
    () => (isMobile ? "0" : sidebarOpen ? "17rem" : "5rem"),
    [isMobile, sidebarOpen]
  );

  const handleSaveAdmin = async (userData) => {
    await signup(userData);
    const { error } = useAuthStore.getState();
    if (!error) {
      alert("Account created successfully!");
      await fetchUsers();
      setShowAddModal(false);
    } else {
      alert("Failed to create account: " + error);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleUpdateAdmin = async (id, data) => {
    try {
      await userUpdate(id, data);
      const { error } = useAuthStore.getState();
      if (error) throw new Error(error);
      alert("Admin updated successfully!");
      setShowEditModal(false);
      setEditingUser(null);
      await fetchUsers();
    } catch (error) {
      alert("Failed to update admin: " + (error?.message || error));
    }
  };

  const handleDeleteClick = (user) => {
    setDeletingUser(user);
    setDeleteError("");
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    try {
      setIsDeleting(true);
      setDeleteError("");
      await userDelete(deletingUser.id);
      const { error } = useAuthStore.getState();
      if (error) throw new Error(error);
      await fetchUsers();
      setShowDeleteModal(false);
      setDeletingUser(null);
      alert("Admin deleted successfully!");
    } catch (err) {
      setDeleteError(err?.message || "Failed to delete admin.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const q = (search || "").toLowerCase();
  const filtered = (users || [])
    .filter((u) =>
      ["admincreator", "adminapprover"].includes((u.role || "").toLowerCase())
    )
    .filter((u) => {
      const name = (u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      return !q || name.includes(q) || email.includes(q);
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

      {/* Sidebar (mobile drawer / desktop collapsible) */}
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

      {/* Main Content */}
      <main
        className="transition-all duration-300 p-6 overflow-y-auto bg-gray-50 w-full"
        style={{ marginLeft: sidebarOffset }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Users</h1>
          <button
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-lg font-medium shadow-md transition"
            onClick={() => setShowAddModal(true)}
          >
            Add Admin
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full max-w-sm"
          />
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Admin Accounts</h3>
            <p className="text-sm text-gray-600 mt-1">{filtered.length} admins found</p>
          </div>

          {/* Table (hidden on small screens) */}
          <div className="overflow-x-auto hidden sm:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
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
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
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
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                          style={{
                            background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}CC 100%)`,
                          }}
                        >
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
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
                          (user.role || "").toLowerCase() === "admincreator"
                            ? "bg-green-100 text-green-800"
                            : "bg-indigo-100 text-indigo-800"
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
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-white !bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                          onClick={() => handleEditClick(user)}
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </button>
                        <button
                          className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-white !bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
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
            {filtered.map((user) => (
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
                      (user.role || "").toLowerCase() === "admincreator"
                        ? "bg-green-100 text-green-800"
                        : "bg-indigo-100 text-indigo-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>

                <div className="mt-3 text-sm text-gray-700">
                  <span className="font-medium">Department:</span> {user.department || "-"}
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

            {filtered.length === 0 && (
              <div className="text-center py-10 text-gray-500">No admins found</div>
            )}
          </div>
        </div>

        {/* Add Admin Modal */}
        <ModalAddAdmins
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveAdmin}
        />

        {/* Edit Admin Modal */}
        <ModalEditAdmins
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingUser(null);
          }}
          onSave={handleUpdateAdmin}
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

export default CoSuperAdminAdmins;
