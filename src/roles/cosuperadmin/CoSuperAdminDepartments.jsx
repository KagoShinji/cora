import { useEffect, useState, useMemo } from "react";
import SidebarCoSuperAdmin from "../../components/SidebarCoSuperAdmin";
import ModalAddDepartment from "../../components/ModalAddDepartment";
import ModalEditDepartment from "../../components/ModalEditDepartment"; // NEW
import ModalConfirmDelete from "../../components/ModalConfirmDelete"; // NEW
import { useAuthStore } from "../../stores/userStores";

function CoSuperAdminDepartments() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const departments = useAuthStore((state) => state.departments);
  const fetchDepartment = useAuthStore((state) => state.getDepartment);

  // NEW: store actions for edit/delete
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

  useEffect(() => {
    fetchDepartment();
  }, []);

  // Optional: filtered list (uses your search input)
  const filteredDepartments = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return departments || [];
    return (departments || []).filter((d) =>
      (d.department_name || "").toLowerCase().includes(q)
    );
  }, [departments, search]);

  // You referenced onSave={(name) => handleSaveDepartment(name)}
  const handleSaveDepartment = (name) => {
    // You already add & reload inside ModalAddDepartment; this can be a no-op or toast.
    // Keeping it simple:
    console.log("Department added:", name);
  };

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
      // Optionally refresh if your store doesn't update locally
      await fetchDepartment();
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
      <div className={`transition-all duration-300 h-screen fixed top-0 left-0 z-40 ${sidebarOpen ? "w-64" : "w-16"}`}>
        <SidebarCoSuperAdmin isOpen={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main content */}
      <main className={`transition-all duration-300 p-8 overflow-y-auto bg-gray-100 ${sidebarOpen ? "ml-64" : "ml-16"} w-full`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Departments</h1>
          <button
            className="!bg-primary text-white px-4 py-2 rounded-md hover:bg-primary transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            Add Department
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full max-w-sm text-black"
          />
        </div>

        {/* Department Table */}
        <div className="bg-white shadow-md rounded-lg overflow-auto">
          <table className="min-w-full text-sm text-black">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-4 text-center">Department</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(filteredDepartments.length > 0 ? filteredDepartments : []).length > 0 ? (
                filteredDepartments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-gray-100 border-t border-gray-300">
                    <td className="p-4 text-center">{dept.department_name}</td>
                    <td className="p-4 flex justify-center gap-2">
                      <button
                        className="!bg-primary text-white px-4 py-2 rounded-md hover:bg-primary transition-colors"
                        onClick={() => handleEditClick(dept)}
                      >
                        Edit
                      </button>
                      <button
                        className="!bg-primary text-white px-4 py-2 rounded-md hover:bg-primary transition-colors"
                        onClick={() => handleDeleteClick(dept)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="p-4 text-center text-gray-500">
                    No departments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Add Department Modal */}
      <ModalAddDepartment
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(name) => handleSaveDepartment(name)}
      />

      {/* Edit Department Modal */}
      <ModalEditDepartment
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingDept(null);
        }}
        onSave={handleUpdateDepartment}
        department={editingDept}
      />

      {/* Delete Confirmation Modal */}
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

export default CoSuperAdminDepartments;
