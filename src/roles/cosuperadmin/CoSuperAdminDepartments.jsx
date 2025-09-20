import { useEffect, useState, useMemo } from "react";
import SidebarCoSuperAdmin from "../../components/SidebarCoSuperAdmin";
import ModalAddDepartment from "../../components/ModalAddDepartment";
import ModalEditDepartment from "../../components/ModalEditDepartment"; // NEW
import ModalConfirmDelete from "../../components/ModalConfirmDelete"; // NEW
import { useAuthStore } from "../../stores/userStores";
import { updateDepartment } from "../../api/api";
import { useAppSettingsStore } from "../../stores/useSettingsStore";
import { Menu } from "lucide-react";

function CoSuperAdminDepartments() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const departments = useAuthStore((state) => state.departments);
  const fetchDepartment = useAuthStore((state) => state.getDepartment);
  const deleteDepartment = useAuthStore((state) => state.deleteDept);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingDept, setDeletingDept] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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

  // Theme color (used for titles, search icon + input border)
  const primaryColor = useAppSettingsStore((s) => s.primary_color) || "#3b82f6";

  useEffect(() => {
    fetchDepartment();
  }, [fetchDepartment]);

  // Desktop offset: 17rem open / 5rem closed; Mobile: overlay (0 offset)
  const sidebarOffset = useMemo(
    () => (isMobile ? "0" : sidebarOpen ? "17rem" : "5rem"),
    [isMobile, sidebarOpen]
  );

  // Filtered list by search
  const filteredDepartments = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return departments || [];
    return (departments || []).filter((d) =>
      (d.department_name || "").toLowerCase().includes(q)
    );
  }, [departments, search]);

  const handleSaveDepartment = (name) => {
    // ModalAddDepartment already adds & refreshes; leave as optional toast/log.
    console.log("Department added:", name);
  };

  // Open edit
  const handleEditClick = (dept) => {
    setEditingDept(dept);
    setShowEditModal(true);
  };

  // Save edit
  const handleUpdateDepartment = async (id, data) => {
    try {
      await updateDepartment(id, data.department_name);
      alert("Department updated successfully!");
      await fetchDepartment();
      setShowEditModal(false);
      setEditingDept(null);
    } catch (error) {
      alert("Failed to update department: " + error.message);
    }
  };

  // Open delete
  const handleDeleteClick = (dept) => {
    setDeletingDept(dept);
    setDeleteError("");
    setShowDeleteModal(true);
  };

  // Confirm delete
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
        <SidebarCoSuperAdmin isOpen={sidebarOpen} setOpen={setSidebarOpen} isMobile={isMobile} />
      </div>

      {/* Main content */}
      <main
        className="transition-all duration-300 p-6 overflow-y-auto bg-gray-50 w-full"
        style={{ marginLeft: sidebarOffset }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {/* Mobile: burger + large colored title */}
          <div className="md:hidden flex items-center gap-3">
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
                Departments
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                Manage departments for admin assignments
              </p>
            </div>
          </div>

          {/* Desktop title + Add */}
          <div className="hidden md:flex items-center justify-between w-full">
            <div>
              <h1
                className="text-3xl font-bold leading-tight mb-2"
                style={{ color: primaryColor }}
              >
                Departments
              </h1>
              <p className="text-gray-600">Manage departments for admin assignments</p>
            </div>
            <button
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              onClick={() => setIsModalOpen(true)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Department
            </button>
          </div>
        </div>

        {/* Mobile Add button */}
        <div className="md:hidden mb-4">
          <button
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-lg font-medium shadow-md transition"
            onClick={() => setIsModalOpen(true)}
          >
            Add Department
          </button>
        </div>

        {/* Search Card */}
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search departments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none"
                style={{
                  border: `2px solid ${primaryColor}`,
                  backgroundColor: "#fff",
                }}
              />
            </div>
          </div>
        </div>

        {/* Modern Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Departments</h3>
            <p className="text-sm text-gray-600 mt-1">
              {filteredDepartments.length} departments found
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDepartments.length > 0 ? (
                  filteredDepartments.map((dept, index) => (
                    <tr
                      key={dept.id}
                      className={`hover:bg-gray-50 transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-25"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {dept.department_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center gap-2">
                          {/* Edit = blue */}
                          <button
                            className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-white !bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                            onClick={() => handleEditClick(dept)}
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

                          {/* Delete = red */}
                          <button
                            className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-white !bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                            onClick={() => handleDeleteClick(dept)}
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="p-8">
                      {/* Empty State */}
                      <div className="text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                          />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No departments found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Get started by creating a new department.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
