import { useState,useEffect } from "react";
import Sidebar from "../../components/SidebarSuperAdmin";
import ModalAddUser from "../../components/ModalAddUser";
import { useAuthStore } from "../../stores/userStores";
// NEW: import the edit modal
import ModalEditUser from "../../components/ModalEditUser";
// NEW: import the global delete modal
import ModalConfirmDelete from "../../components/ModalConfirmDelete";
import { userDelete,userUpdate } from "../../api/api";


function SuperAdminUsers() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(""); 
  const [showAddModal, setShowAddModal] = useState(false);
  const fetchUsers = useAuthStore((state) => state.fetchUsers);

  const users = useAuthStore((state) => state.users);

  const signup = useAuthStore((state) => state.signup);

  // NEW: edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // NEW: delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleAddUser = async (userData) => {
    await signup(userData);
    const { error } = useAuthStore.getState();
    if (!error) {
      alert("Account created successfully!");
      fetchUsers();
    } else {  
      alert("Failed to create account: " + error);
    }
  };

  // NEW: open edit modal with selected user
  const handleEditClick = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  // NEW: save edits via store
  const handleUpdateUser = async (id, data) => {
    await userUpdate(id, data);
    const { error } = useAuthStore.getState();
    if (!error) {
      alert("User updated successfully!");
      setShowEditModal(false);
      setEditingUser(null);
      // optional: refetch if your store doesn't update locally
      // await fetchUsers();
    } else {
      alert("Failed to update user: " + error);
      throw new Error(error);
    }
  };

  // NEW: open delete modal
  const handleDeleteClick = (user) => {
    setDeletingUser(user);
    setDeleteError("");
    setShowDeleteModal(true);
  };

  // NEW: confirm delete
  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    try {
      setIsDeleting(true);
      setDeleteError("");
      await userDelete(deletingUser.id);
      const { error } = useAuthStore.getState();
      if (error) throw new Error(error);

      // optional: refetch if your store doesn't update locally
      // await fetchUsers();

      setShowDeleteModal(false);
      setDeletingUser(null);
      alert("User deleted successfully!");
      fetchUsers()
    } catch (err) {
      setDeleteError(err?.message || "Failed to delete user.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
  fetchUsers();
}, []);

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
          <h1 className="text-3xl font-bold text-primary">Users</h1>
          <button
            className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary transition-colors"
            onClick={() => setShowAddModal(true)}
          >
            Add User
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-primary !text-primary rounded px-4 py-2 w-full sm:max-w-sm"
          />

          {/* Role filter dropdown 
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border !border-primary !text-primary rounded px-4 py-2 w-full sm:max-w-xs"
          >
            <option value="">All Roles</option>
            <option value="superadmin">Super Admin</option>
            <option value="co-superadmin">Co Super Admin</option>
          </select>
          */}
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-auto">
          <table className="min-w-full text-sm text-black">
            <thead className="bg-primary text-white">
  <tr>
    <th className="p-4 text-center">User</th>
    <th className="p-4 text-center">Email</th>
    {/*<th className="p-4 text-center">School</th>*/}
    <th className="p-4 text-center">Role</th>
    {/*<th className="p-4 text-center">Timestamp</th>*/}
    <th className="p-4 text-center">Actions</th>
  </tr>
</thead>
      <tbody>
        {users
          .filter((user) => user.role?.toLowerCase() === "co-superadmin" || "superadmin")
          .map((user) => (
            <tr key={user.id} className="hover:bg-gray-100 border-t border-gray-300">
              <td className="p-4 text-center">{user.name}</td>
              <td className="p-4 text-center">{user.email}</td>
              {/*<td className="p-4 text-center">{user.school}</td>*/}
              <td className="p-4 text-center">{user.role}</td>
              {/*<td className="p-4 text-center">{user.created_at}</td>*/}
              <td className="p-4 text-center">
                <div className="flex justify-center gap-3">
                  <button
                    className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary transition-colors"
                    onClick={() => handleEditClick(user)} // NEW
                  >
                    Edit
                  </button>
                  <button
                    className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary transition-colors"
                    onClick={() => handleDeleteClick(user)} // NEW
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
      </tbody>
          </table>
        </div>

        {/* Add User Modal */}
        <ModalAddUser
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddUser}
        />

        {/* NEW: Edit User Modal */}
        <ModalEditUser
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingUser(null);
          }}
          onSave={handleUpdateUser}
          user={editingUser}
        />

        {/* NEW: Delete Confirmation Modal */}
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

export default SuperAdminUsers;
