import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/SidebarCoSuperAdmin";
import { useAuthStore } from "../../stores/userStores";

// NEW: modals
import ModalEditDepartment from "../../components/ModalEditDepartment";
import ModalConfirmDelete from "../../components/ModalConfirmDelete";

function CoSuperAdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const departments = useAuthStore((state)=>state.departments)
  const fetchDepartment = useAuthStore((state)=> state.getDepartment)

  // NEW: store actions
  const updateDepartment = useAuthStore((state) => state.updateDepartment); // ensure exists
  const deleteDepartment = useAuthStore((state) => state.deleteDepartment); // ensure exists

  // NEW: edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  // NEW: delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingDept, setDeletingDept] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(()=>{
    fetchDepartment();
  },[])

  // NEW: open edit
  const handleEditClick = (dept) => {
    setEditingDept(dept);
    setShowEditModal(true);
  };

  // NEW: save edit
  const handleUpdateDepartment = async (id, data) => {
    await updateDepartment(id, data);
    const { error } = useAuthStore.getState();
    if (!error) {
      alert("Department updated successfully!");
      await fetchDepartment(); // refresh if your store doesn't update locally
      setShowEditModal(false);
      setEditingDept(null);
    } else {
      alert("Failed to update department: " + error);
      throw new Error(error);
    }
  };

  // NEW: open delete
  const handleDeleteClick = (dept) => {
    setDeletingDept(dept);
    setDeleteError("");
    setShowDeleteModal(true);
  };

  // NEW: confirm delete
  const handleConfirmDelete = async () => {
    if (!deletingDept) return;
    try {
      setIsDeleting(true);
      setDeleteError("");
      await deleteDepartment(deletingDept.id);
      const { error } = useAuthStore.getState();
      if (error) throw new Error(error);

      await fetchDepartment(); // refresh list
      setShowDeleteModal(false);
      setDeletingDept(null);
      alert("Department deleted successfully!");
    } catch (err) {
      setDeleteError(err?.message || "Failed to delete department.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <Sidebar isOpen={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 flex-1 p-8 overflow-y-auto bg-gray-100 ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <h1 className="text-3xl font-bold text-primary mb-6">Dashboard</h1>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {/* Admin Users Card */}
          <Link
            to="/cosuperadmin/admins"
            className="bg-white shadow-md rounded-lg p-6 flex items-center justify-center flex-col hover:shadow-lg transition hover:scale-105"
          >
            <div className="text-4xl mb-2">👤</div>
            <h2 className="text-xl font-semibold text-primary">Admin Users</h2>
          </Link>

          {/* Departments Card */}
          <Link
            to="/cosuperadmin/departments"
            className="bg-white shadow-md rounded-lg p-6 flex items-center justify-center flex-col hover:shadow-lg transition hover:scale-105"
          >
            <div className="text-4xl mb-2">🏛️</div>
            <h2 className="text-xl font-semibold text-primary">Departments</h2>
          </Link>

          {/* Themes Card */}
          <Link
            to="/cosuperadmin/themes"
            className="bg-white shadow-md rounded-lg p-6 flex items-center justify-center flex-col hover:shadow-lg transition hover:scale-105"
          >
            <div className="text-4xl mb-2">🎨</div>
            <h2 className="text-xl font-semibold text-primary">Themes</h2>
          </Link>

          {/* Logs Card */}
          <Link
            to="/cosuperadmin/logs"
            className="bg-white shadow-md rounded-lg p-6 flex items-center justify-center flex-col hover:shadow-lg transition hover:scale-105"
          >
            <div className="text-4xl mb-2">📝</div>
            <h2 className="text-xl font-semibold text-primary">Logs</h2>
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-4 text-center align-middle">Department</th>
                <th className="p-4 text-center align-middle">Timestamp</th>
                <th className="p-4 text-center align-middle">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept)=>(
                <tr key={dept.id} className="hover:bg-gray-100">
                <td className="p-4 text-black text-center align-middle">
                  {dept.department_name}
                </td>
                <td className="p-4 text-black text-center align-middle">
                  March 23, 2025 10:42 AM
                </td>
                <td className="p-4 text-center align-middle">
                  <div className="flex justify-center gap-3">
                    <button
                      className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary transition-colors"
                      onClick={() => handleEditClick(dept)}
                    >
                      Edit
                    </button>
                    <button
                      className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary transition-colors"
                      onClick={() => handleDeleteClick(dept)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              ))}
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </main>

      {/* NEW: Edit Department Modal */}
      <ModalEditDepartment
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingDept(null);
        }}
        onSave={handleUpdateDepartment}
        department={editingDept}
      />

      {/* NEW: Delete Confirmation Modal */}
      <ModalConfirmDelete
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingDept(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        error={deleteError}
      />
    </div>
  );
}

export default CoSuperAdminDashboard;
