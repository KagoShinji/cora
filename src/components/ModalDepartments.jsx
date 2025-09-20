// src/components/ModalDepartments.jsx
import { useEffect, useState, useMemo } from "react";
import { Search, X, Building } from "lucide-react";
import { useAuthStore } from "../stores/userStores";
import ModalEditDepartment from "./ModalEditDepartment";
import ModalConfirmDelete from "./ModalConfirmDelete";
import { useAppSettingsStore } from "../stores/useSettingsStore";

function ModalDepartments({ isOpen, onClose, department }) {
  const fetchDepartment = useAuthStore((state) => state.getDepartment);
  const departments = useAuthStore((state) => state.departments);
  const updateDepartment = useAuthStore((state) => state.updateDepartment);
  const deleteDepartment = useAuthStore((state) => state.deleteDepartment);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const [search, setSearch] = useState("");

  // theme color
  const primaryColor = useAppSettingsStore((s) => s.primary_color) || "#3b82f6";

  // edit/delete modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingDept, setDeletingDept] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-[9999] p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-6xl max-h-[90vh] flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="bg-white px-8 py-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-xl">
                <Building className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Department Management
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Manage company departments and their records
                </p>
              </div>
            </div>

            {/* Close button */}
            <X
              onClick={onClose}
              role="button"
              tabIndex={0}
              aria-label="Close modal"
              className="w-6 h-6 text-gray-500 hover:text-gray-800 cursor-pointer transition z-20"
            />
          </div>

          {/* Decorative Blobs */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Search bar */}
          <div className="px-8 py-6 bg-gradient-to-b from-gray-50/80 to-white border-b border-gray-100">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search departments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm"
              />
            </div>

            {/* Results Counter */}
            <div className="mt-4 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 font-medium">
                {filteredDepartments.length} department
                {filteredDepartments.length !== 1 ? "s" : ""} found
              </span>
            </div>
          </div>

          {/* Loading / Error */}
          {isLoading && (
            <div className="px-8 py-12 text-center">
              <span className="text-gray-600 font-medium">Loading departments...</span>
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

          {/* Table */}
          {!isLoading && (
            <div className="flex-1 px-8 pb-8 overflow-hidden">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Departments
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {filteredDepartments.length} results
                  </p>
                </div>

                <div className="flex-1 overflow-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-800">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Timestamp
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredDepartments.length > 0 ? (
                        filteredDepartments.map((d) => (
                          <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {/* Avatar icon in themed circle (no text) */}
                                <div
                                  className="h-10 w-10 rounded-full flex items-center justify-center"
                                  style={{ background: primaryColor }}
                                  aria-hidden="true"
                                >
                                  <Building className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-gray-900">{d.department_name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">March 23, 2025 10:42 AM</td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button
                                  className="!bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                                  onClick={() => handleEditClick(d)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="!bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
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
                          <td colSpan={3} className="p-12 text-center">
                            <div className="flex flex-col items-center space-y-3">
                              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <Building className="w-8 h-8 text-gray-400" />
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-1">
                                  No departments found
                                </h3>
                                <p className="text-sm text-gray-500">
                                  Try adjusting your search criteria
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

      {/* Nested Modals */}
      <ModalEditDepartment
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingDept(null);
        }}
        onSave={handleUpdateDepartment}
        department={editingDept}
      />
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
