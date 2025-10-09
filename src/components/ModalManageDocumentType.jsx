import { useState, useEffect } from "react";
import { Info, X, FilePlus, Loader2 } from "lucide-react";
import { createDocumentInfo } from "../api/api";
import toast from "react-hot-toast";
import { useDocumentStore } from "../stores/useDocumentStore";

export default function ModalManageDocumentType({ isOpen, onClose }) {
  const [newType, setNewType] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { refreshDocumentInfo } = useDocumentStore();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleAddType = async () => {
    const trimmed = newType.trim();
    if (!trimmed) {
      toast.error("Please enter a type name.", { position: "bottom-right" });
      return;
    }

    try {
      setIsSaving(true);
      const payload = { name: trimmed };
      const response = await createDocumentInfo(payload);

      if (response) {
        toast.success("✅ Document type created successfully!", { position: "bottom-right" });
        refreshDocumentInfo(); 
        setNewType("");
        onClose();
      }
    } catch (error) {
      console.error("Error adding document type:", error);
      toast.error(error?.message || "❌ Failed to create document type.", {
        position: "bottom-right",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="manage-doc-title"
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
              <FilePlus className="h-5 w-5 text-gray-700" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h2 id="manage-doc-title" className="text-xl font-semibold text-gray-900">
                Manage Types of Information
              </h2>
              <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                <Info className="h-4 w-4" aria-hidden="true" />
                Create new document types for categorization.
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
          {/* Add New Type */}
          <div className="flex gap-3 mb-5">
            <input
              type="text"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              placeholder="New type"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
            />
            <button
              onClick={handleAddType}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl !bg-green-500 text-white text-sm font-semibold shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FilePlus className="h-4 w-4" />
              )}
              {isSaving ? "Adding..." : "Add"}
            </button>
          </div>

          {/* Close Button */}
          <div className="text-right pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-medium text-white !bg-red-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
