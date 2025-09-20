import { useEffect, useState } from "react";
import { X, Building2, Info, Save } from "lucide-react";

/**
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - onSave: (id, { department_name }) => Promise<void> | void
 * - department: { id, department_name }
 */
export default function ModalEditDepartment({
  isOpen,
  onClose,
  onSave,
  department,
}) {
  const [name, setName] = useState("");
  const [localError, setLocalError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen || !department) return;
    setName(department.department_name || "");
    setLocalError("");
  }, [isOpen, department]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !department) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    const trimmed = name.trim();
    if (!trimmed) {
      setLocalError("Department name is required.");
      return;
    }

    try {
      setIsSaving(true);
      await onSave(department.id, { department_name: trimmed });
      onClose();
    } catch (err) {
      setLocalError(err?.message || "Failed to update department.");
      console.error("ModalEditDepartment onSave error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-dept-title"
      aria-describedby="edit-dept-desc"
      onMouseDown={handleBackdrop}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg mx-4 rounded-2xl bg-white shadow-2xl border border-gray-200 max-h-[calc(100vh-2rem)] overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header (no gradient) */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-200">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-200">
              <Building2 className="h-5 w-5 text-gray-700" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h2 id="edit-dept-title" className="text-xl font-semibold text-gray-900">
                Edit Department
              </h2>
              <p
                id="edit-dept-desc"
                className="mt-1 flex items-center gap-1 text-sm text-gray-600"
              >
                <Info className="h-4 w-4" aria-hidden="true" />
                Update the department name and save your changes.
              </p>
            </div>

            {/* Close icon (no button wrapper) */}
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
            {/* Department Name */}
            <div>
              <label
                htmlFor="department_name"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Department Name <span className="text-red-500">*</span>
              </label>
              <input
                id="department_name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Human Resources"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
              />
            </div>

            {/* Error Message */}
            {localError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
                {localError}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-medium text-white !bg-red-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl !bg-green-500 text-white text-sm font-semibold shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
