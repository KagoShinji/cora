// src/components/ModalDepartments.jsx
import { useEffect, useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useAuthStore } from "../stores/userStores";
import ModalEditDepartment from "./ModalEditDepartment";
import ModalConfirmDelete from "./ModalConfirmDelete";

function ModalDepartments({ isOpen, onClose, department }) {
  const fetchDepartment = useAuthStore((state) => state.getDepartment);
  const departments = useAuthStore((state) => state.departments);
  const updateDepartment = useAuthStore((state) => state.updateDepartment);
  const deleteDepartment = useAuthStore((state) => state.deleteDepartment);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const [search, setSearch] = useState("");

  // edit/delete modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingDept, setDeletingDept] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Fetch departments whenever modal opens
  useEffect(() => {
    if (isOpen) fetchDepartment();
  }, [isOpen, fetchDepartment]);

  const filteredDepartments = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return departments || [];
    return (departments || []).filter((d) =>
      (d.department_name || "").toLowerCase().includes(q)
    );
  }, [departments, search]);

  // Handlers
  const handleEditClick = (dept) => {
    setEditingDept(dept);
    setShowEditModal(true);
  };

  const handleUpdateDepartment = async (id, data) => {
    await updateDepartment(id, data);
    const { error } = useAuthStore.getState();
    if (!error) {
      alert("Department updated successfully!");
      await fetchDepartment();
      setShowEditModal(false);
      setEditingDept(null);
    } else {
      alert("Failed to update department: " + error);
      throw new Error(error);
    }
  };

  const handleDeleteClick = (dept) => {
    setDeletingDept(dept);
    setDeleteError("");
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingDept) return;
    try {
      setIsDeleting(true);
      setDeleteError("");
      await deleteDepartment(deletingDept.id);
      const { error } = useAuthStore.getState();
      if (error) throw new Error(error);

      await fetchDepartment();
      setShowDeleteModal(false);
      setDeletingDept(null);
      alert("Department deleted successfully!");
    } catch (err) {
      setDeleteError(err?.message || "Failed to delete department.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-[9999]">
      <div className="bg-white rounded-2xl shadow-2xl border w-full max-w-5xl p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 !bg-primary text-white hover:text-red-600 transition rounded-full px-2 py-1"
        >
          ✖
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-6 text-primary text-center">
          {department ? department.department_name : "Departments"}
        </h2>

        {/* Search Input */}
        <div className="relative w-1/3 mb-6 ml-0">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Loading / Error */}
        {isLoading && <p className="text-gray-500 text-center">Loading...</p>}
        {error && <p className="text-red-500 text-center">Error: {error}</p>}

        {/* Departments Table */}
        <div className="overflow-auto max-h-[400px] border rounded-xl">
          <table className="min-w-full text-sm text-black">
            <thead className="bg-primary text-white text-base">
              <tr>
                <th className="p-4 text-center">Department</th>
                <th className="p-4 text-center">Timestamp</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((d) => (
                  <tr
                    key={d.id}
                    className={`border-t hover:bg-gray-100 ${
                      department?.id === d.id ? "bg-yellow-100" : ""
                    }`}
                  >
                    <td className="p-4 text-center">{d.department_name}</td>
                    <td className="p-4 text-center">March 23, 2025 10:42 AM</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-red-700 transition-colors"
                          onClick={() => handleEditClick(d)}
                        >
                          Edit
                        </button>
                        <button
                          className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-red-700 transition-colors"
                          onClick={() => handleDeleteClick(d)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-gray-500">
                    No departments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
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

export default ModalDepartments;
