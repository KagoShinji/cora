// src/components/ChangeNameModal.jsx
import { useEffect, useState } from "react";
import { X, Info, Save } from "lucide-react";

function ChangeNameModal({ isOpen, onClose, onSave }) {
  const [newName, setNewName] = useState("");

  // Reset input when opening
  useEffect(() => {
    if (isOpen) setNewName("");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSave = () => {
    const trimmed = newName.trim();
    if (trimmed) {
      onSave(trimmed);
      setNewName(""); // keep original behavior (do not auto-close)
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-name-title"
      aria-describedby="change-name-desc"
      onMouseDown={handleBackdrop}
    >
      {/* Backdrop (same style as your other modal) */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

      {/* Modal Card (consistent shell) */}
      <div
        className="relative w-full max-w-lg mx-4 rounded-2xl bg-white shadow-2xl border border-gray-200 max-h-[calc(100vh-2rem)] overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-200">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-200">
              <Info className="h-5 w-5 text-gray-700" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h2 id="change-name-title" className="text-xl font-semibold text-gray-900">
                Change Name
              </h2>
              <p id="change-name-desc" className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                <Info className="h-4 w-4" aria-hidden="true" />
                Update the system’s display name.
              </p>
            </div>
            <X
              onClick={onClose}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClose()}
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
          <div className="space-y-5">
            <div>
              <label htmlFor="new-name" className="block text-sm font-medium text-gray-800 mb-2">
                New Name <span className="text-red-500">*</span>
              </label>
              <input
                id="new-name"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter new name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
              />
            </div>

            {/* Actions — red Cancel / green Save (consistent with your other modal) */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setNewName("");
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-medium text-white !bg-red-500 shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl !bg-green-500 text-white text-sm font-semibold shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangeNameModal;
