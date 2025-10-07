import React, { useEffect, useState } from "react";
import { X, User, Info, Save, Loader2 } from "lucide-react"; // ✅ Added Loader2
import ModalAddDepartment from "./ModalAddDepartment";
import { useAuthStore } from "../stores/userStores";

export default function ModalEditAdmins({ isOpen, onClose, onSave, user }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [localError, setLocalError] = useState("");
  const [isSaving, setIsSaving] = useState(false); // ✅ Used for loading

  const departments = useAuthStore((state) => state.departments);
  const getDepartment = useAuthStore((state) => state.getDepartment);

  // Initialize form
  useEffect(() => {
    if (!isOpen || !user) return;
    setUsername(user.name || "");
    setEmail(user.email || "");
    setRole((user.role || "").toLowerCase());
    setDepartmentId(user.department_id ? String(user.department_id) : "");
    setLocalError("");
  }, [isOpen, user]);

  // Fetch departments
  useEffect(() => {
    if (!isOpen) return;
    getDepartment();
  }, [isOpen, getDepartment]);

  // Escape key + scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev || "";
    };
  }, [isOpen, onClose]);

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleNewDepartment = async (newDept) => {
    await getDepartment();
    const matchedDept = (departments || []).find(
      (dept) => dept.department_name === newDept
    );
    if (matchedDept) setDepartmentId(String(matchedDept.id));
    setIsDeptModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!user?.id) {
      setLocalError("Invalid user.");
      return;
    }

    const data = {
      name: username.trim(),
      email: email.trim(),
      role,
      department_id: departmentId ? parseInt(departmentId, 10) : null,
    };

    try {
      setIsSaving(true);
      await onSave(user.id, data);
      onClose();
    } catch (err) {
      setLocalError(err?.message || "Failed to update admin.");
      console.error("ModalEditAdmins onSave error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-admin-title"
        aria-describedby="edit-admin-desc"
        onMouseDown={handleBackdrop}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

        {/* Modal */}
        <div
          className="relative w-full max-w-lg mx-4 rounded-2xl bg-white shadow-2xl border border-gray-200 max-h-[calc(100vh-2rem)] overflow-hidden"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-200">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-200">
                <User className="h-5 w-5 text-gray-700" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2 id="edit-admin-title" className="text-xl font-semibold text-gray-900">
                  Edit Admin
                </h2>
                <p
                  id="edit-admin-desc"
                  className="mt-1 flex items-center gap-1 text-sm text-gray-600"
                >
                  <Info className="h-4 w-4" aria-hidden="true" />
                  Update admin details and save your changes.
                </p>
              </div>
              <X
                onClick={onClose}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") onClose();
                }}
                role="button"
                tabIndex={0}
                aria-label="Close dialog"
                className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700"
                title="Close"
              />
            </div>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-800 mb-2"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter name"
                  required
                  disabled={isSaving}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-200 disabled:bg-gray-100"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-800 mb-2"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  required
                  disabled={isSaving}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-200 disabled:bg-gray-100"
                />
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-800 mb-2"
                >
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  disabled={isSaving}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white shadow-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-200 disabled:bg-gray-100"
                >
                  <option value="">Select Role</option>
                  <option value="admincreator">Creator</option>
                  <option value="adminapprover">Approver</option>
                </select>
              </div>

              {/* Department */}
              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-800 mb-2"
                >
                  Department
                </label>
                <div className="flex items-center gap-2">
                  <select
                    id="department"
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    disabled={isSaving}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white shadow-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-200 disabled:bg-gray-100"
                  >
                    <option value="">Select Department</option>
                    {(departments || []).map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.department_name}
                      </option>
                    ))}
                  </select>
                  <div
                    onClick={() => !isSaving && setIsDeptModalOpen(true)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if ((e.key === "Enter" || e.key === " ") && !isSaving)
                        setIsDeptModalOpen(true);
                    }}
                    className={`px-3 py-2 text-sm border border-gray-300 rounded-xl text-gray-800 bg-white shadow-sm ${
                      isSaving
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-50 cursor-pointer"
                    }`}
                    title="Add Department"
                  >
                    +
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {localError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
                  {localError}
                </div>
              )}

              {/* Footer Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-medium text-white !bg-red-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl !bg-green-500 text-white text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Nested Department Modal */}
      <ModalAddDepartment
        isOpen={isDeptModalOpen}
        onClose={() => setIsDeptModalOpen(false)}
        onSave={handleNewDepartment}
      />
    </>
  );
}
