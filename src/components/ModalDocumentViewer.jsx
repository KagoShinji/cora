import { useState, useEffect } from "react";
import { X, FileText, Info, Save, Loader2 } from "lucide-react";
import { useAppSettingsStore } from "../stores/useSettingsStore";
import toast from "react-hot-toast";

export default function ModalDocumentViewer({ isOpen, onClose, doc, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const primaryColor = useAppSettingsStore((s) => s.primary_color) || "#1D4ED8";

  useEffect(() => {
    if (doc) {
      setEditedContent(doc.content ?? "");
      setIsEditing(false);
    }
  }, [doc]);

  if (!isOpen || !doc) return null;

  const handleSave = async () => {
    if (!doc.id) {
      toast.error("Missing document ID.", { position: "bottom-right" });
      return;
    }

    try {
      setIsSaving(true);
      await onSave?.(doc.id, editedContent);
      toast.success("✅ Document saved successfully!", { position: "bottom-right" });
      setIsEditing(false);
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("❌ Failed to save changes.", { position: "bottom-right" });
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
      aria-labelledby="doc-viewer-title"
      aria-describedby="doc-viewer-desc"
      onMouseDown={handleBackdrop}
      style={{ "--pc": primaryColor }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

      {/* Modal card */}
      <div
        className="relative w-full max-w-2xl mx-4 rounded-2xl bg-white shadow-2xl border border-gray-200 max-h-[calc(100vh-2rem)] overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-200">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-200">
              <FileText className="h-5 w-5 text-gray-700" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h2 id="doc-viewer-title" className="text-xl font-semibold text-gray-900">
                {doc.title || "Document"}
              </h2>
              <p
                id="doc-viewer-desc"
                className="mt-1 flex items-center gap-1 text-sm text-gray-600"
              >
                <Info className="h-4 w-4" aria-hidden="true" />
                View or edit the document content below, then save your changes.
              </p>
            </div>

            {/* Close (X icon only) */}
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
          <div className="space-y-5">
            <div>
              <label
                htmlFor="doc-content"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Content
              </label>
              <textarea
                id="doc-content"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                readOnly={!isEditing}
                rows={10}
                placeholder="No content yet"
                className={[
                  "w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 shadow-sm outline-none transition",
                  isEditing
                    ? "border-gray-300 bg-white focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
                    : "border-gray-300 bg-gray-100 cursor-not-allowed",
                ].join(" ")}
              />
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end gap-3 pt-4 px-6 pb-6 border-t border-gray-200">
          {isEditing ? (
            <>
              {/* Cancel = red */}
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditedContent(doc.content ?? "");
                }}
                className="px-5 py-2.5 rounded-xl text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 !bg-red-600 !text-white hover:!bg-red-700"
                disabled={isSaving}
              >
                Cancel
              </button>

              {/* Save = green */}
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 !bg-green-600 !text-white hover:!bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSaving ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <>
              {/* Edit = blue */}
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 !bg-blue-600 !text-white hover:!bg-blue-700"
              >
                Edit
              </button>

              {/* Close = primary (from theme) */}
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 !text-white"
                style={{
                  backgroundColor: primaryColor,
                  "--tw-ring-color": primaryColor,
                }}
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
