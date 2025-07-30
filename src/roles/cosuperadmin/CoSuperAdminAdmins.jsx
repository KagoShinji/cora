import { useEffect, useState } from "react";
import Sidebar from "../../components/SidebarCoSuperAdmin";
import ModalAddAdmins from "../../components/ModalAddAdmins";
import ModalEditAdmins from "../../components/ModalEditAdmins"; // NEW
import ModalConfirmDelete from "../../components/ModalConfirmDelete"; // NEW
import { useAuthStore } from "../../stores/userStores";

function CoSuperAdminAdmins() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchUsers = useAuthStore((state)=>state.fetchUsers);
  const users = useAuthStore((state)=>state.users);

  // authstore 
  const signup = useAuthStore((state) => state.signup);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  // NEW: edit + delete actions
  const updateUser = useAuthStore((state) => state.updateUser); // ensure this exists
  const deleteUser = useAuthStore((state) => state.deleteUser); // ensure this exists

  // NEW: edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // NEW: delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleSaveAdmin = async(userData) =>{
    await signup(userData)
    const {error} = useAuthStore.getState();
    if(!error){
      alert("Account created successfully!");
      // Optionally refresh the list:
      // await fetchUsers();
    }else{
      alert("Failed to create account: " + error);
    }
  }

  // NEW: open edit
  const handleEditClick = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  // NEW: save edit
  const handleUpdateAdmin = async (id, data) => {
    await updateUser(id, data);
    const { error } = useAuthStore.getState();
    if (!error) {
      alert("Admin updated successfully!");
      setShowEditModal(false);
      setEditingUser(null);
      // Optionally refresh:
      // await fetchUsers();
    } else {
      alert("Failed to update admin: " + error);
      throw new Error(error);
    }
  };

  // NEW: open delete
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

      setShowDeleteModal(false);
      setDeletingUser(null);
      alert("Admin deleted successfully!");
      // Optionally refresh:
      // await fetchUsers();
    } catch (err) {
      setDeleteError(err?.message || "Failed to delete admin.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(()=>{
    fetchUsers();
  },[]);

  const filtered = users
    .filter((user)=> user.role?.toLowerCase() === "admincreator" || user.role?.toLowerCase() === "adminapprover")
    .filter((u) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q);
    });

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
          <h1 className="text-3xl font-bold text-primary">Admin Users</h1>
          <button
            className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary"
            onClick={() => setShowAddModal(true)}
          >
            Add Admin
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search admin users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full max-w-sm"
          />
        </div>

        {/* Admin Table */}
        <div className="bg-white shadow-md rounded-lg overflow-auto">
          <table className="min-w-full text-sm text-black">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-4 text-center">Name</th>
                {/*<th className="p-4 text-center">Timestamp</th>*/}
                <th className="p-4 text-center">Role</th>
                <th className="p-4 text-center">Department</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user)=>(
                <tr
                  key={user.id}
                  className="hover:bg-gray-100 border-t border-gray-300"
                >
                  <td className="p-4 text-center uppercase">{user.name}</td>
                 {/*} <td className="p-4 text-center">{admin.timestamp}</td>*/}
                  <td className="p-4 text-center uppercase">{user.role}</td>
                  <td className="p-4 text-center">{user.department}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button
                        className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary"
                        onClick={() => handleEditClick(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary"
                        onClick={() => handleDeleteClick(user)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500">No admins found.</td>
                </tr>
              )}
            </tbody>
          </table>
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
