import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/SidebarSuperAdmin";
import { useAuthStore } from "../../stores/userStores";

// NEW: modals
import ModalEditUser from "../../components/ModalEditUser";
import ModalConfirmDelete from "../../components/ModalConfirmDelete";

function SuperAdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const users = useAuthStore((state)=>state.users)
  const fetchUsers = useAuthStore((state)=> state.fetchUsers)

  // NEW: edit modal state + store action
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const updateUser = useAuthStore((state) => state.updateUser); // assumes this exists

  // NEW: delete modal state + store action
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const deleteUser = useAuthStore((state) => state.deleteUser); // assumes this exists

  useEffect(()=>{
    fetchUsers()
  },[]);

  // NEW: open edit modal
  const handleEditClick = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  // NEW: save edits via store
  const handleUpdateUser = async (id, data) => {
    await updateUser(id, data);
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
      await deleteUser(deletingUser.id);
      const { error } = useAuthStore.getState();
      if (error) throw new Error(error);

      // optional: refetch if your store doesn't update locally
      // await fetchUsers();

      setShowDeleteModal(false);
      setDeletingUser(null);
      alert("User deleted successfully!");
    } catch (err) {
      setDeleteError(err?.message || "Failed to delete user.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-screen transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"}`}>
        <Sidebar isOpen={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main content */}
      <main
        className={`transition-all duration-300 flex-1 p-8 overflow-y-auto bg-gray-100 ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <h1 className="text-3xl font-bold text-primary mb-6">Dashboard</h1>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Link to="/superadmin/users">
            <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-center flex-col cursor-pointer hover:shadow-lg transition">
              <div className="text-4xl mb-2">👤</div>
              <h2 className="text-xl font-semibold text-primary">Users</h2>
            </div>
          </Link>
          <Link to="/superadmin/logs">
            <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-center flex-col cursor-pointer hover:shadow-lg transition">
              <div className="text-4xl mb-2">📝</div>
              <h2 className="text-xl font-semibold text-primary">Logs</h2>
            </div>
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-4 text-center align-middle">User</th>
                <th className="p-4 text-center align-middle">Timestamp</th>
                <th className="p-4 text-center align-middle">Role</th>
                <th className="p-4 text-center align-middle">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users
              .filter((user) => user.role?.toLowerCase() === "co-superadmin" || user.role?.toLowerCase() === "superadmin")
              .map((user) => (
                <tr key={user.id} className="hover:bg-gray-100 border-t border-gray-300">
                  <td className="p-4 text-center text-black">{user.name}</td>
                  <td className="p-4 text-center text-black">{user.email}</td>
                  {/*<td className="p-4 text-center">{user.school}</td>*/}
                  <td className="p-4 text-center text-black">{user.role}</td>
                  {/*<td className="p-4 text-center">{user.created_at}</td>*/}
                  <td className="p-4 text-center text-black">
                    <div className="flex justify-center gap-3">
                      <button
                        className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary transition-colors"
                        onClick={() => handleEditClick(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary transition-colors"
                        onClick={() => handleDeleteClick(user)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {/* You can map more rows here dynamically */}
            </tbody>
          </table>
        </div>

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

export default SuperAdminDashboard;
