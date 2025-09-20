// src/components/ModalEditDocument.jsx
import { useState, useEffect } from "react";
import { X, FileText, Info, Save } from "lucide-react";
import { fetchDocumentInfo } from "../api/api";

const ModalEditDocument = ({ isOpen, onClose, document: doc, onUpdate }) => {
  const [titleId, setTitleId] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [documentTypes, setDocumentTypes] = useState([]);

  // Sync fields when opening / when doc changes
  useEffect(() => {
    if (!isOpen) return;
    setTitleId(doc?.title_id ? String(doc.title_id) : "");
    setContent(doc?.content || "");
    setFile(null);
  }, [doc, isOpen]);

  // Fetch document types when modal opens
  useEffect(() => {
    if (!isOpen) return;
    const getTypes = async () => {
      try {
        const types = await fetchDocumentInfo();
        setDocumentTypes(types || []);
      } catch (err) {
        console.error("Failed to fetch document types:", err);
      }
    };
    getTypes();
  }, [isOpen]);

  // Escape to close + body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = window.document.body.style.overflow;
    window.document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.document.body.style.overflow = prevOverflow || "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!doc?.id) return; // safety

    const payload = {
      id: doc.id,
      title_id: parseInt(titleId, 10),
    };

    if (file) {
      payload.file = file;
    } else if (doc?.content !== undefined) {
      payload.content = content;
    }

    onUpdate(payload);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-doc-title"
      aria-describedby="edit-doc-desc"
      onMouseDown={handleBackdrop}
    >
      {/* Backdrop (same as department modal) */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

      {/* Card (same layout & styles as department modal) */}
      <div
        className="relative w-full max-w-lg mx-4 rounded-2xl bg-white shadow-2xl border border-gray-200 max-h-[calc(100vh-2rem)] overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header (neutral style, no brand color) */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-200">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-200">
              <FileText className="h-5 w-5 text-gray-700" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h2 id="edit-doc-title" className="text-xl font-semibold text-gray-900">
                Edit Document
              </h2>
              <p
                id="edit-doc-desc"
                className="mt-1 flex items-center gap-1 text-sm text-gray-600"
              >
                <Info className="h-4 w-4" aria-hidden="true" />
                Update the document information and save your changes.
              </p>
            </div>

            {/* Close icon (no button wrapper) */}
            <X
              onClick={onClose}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClose?.()}
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
          {/* Remarks (same alert style as your pattern) */}
          {doc?.remarks && (
            <div
              className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700 text-sm"
              role="alert"
            >
              <div className="font-semibold mb-1">Remarks from Approver</div>
              <div className="leading-relaxed">{doc.remarks}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Type of Information (select styling matches dept modal inputs) */}
            <div>
              <label
                htmlFor="titleId"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Type of Information <span className="text-red-500">*</span>
              </label>
              <select
                id="titleId"
                value={titleId}
                onChange={(e) => setTitleId(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-200 bg-white"
              >
                <option value="">Select a type</option>
                {documentTypes.map((type) => (
                  <option key={type.id} value={String(type.id)}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* File vs Content (same neutral inputs) */}
            {doc?.filename ? (
              <div>
                <label
                  htmlFor="fileUpload"
                  className="block text-sm font-medium text-gray-800 mb-2"
                >
                  Change File (Optional)
                </label>
                <input
                  type="file"
                  id="fileUpload"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border file:border-gray-300 file:text-sm file:font-medium file:bg-white file:text-gray-900 hover:file:bg-gray-50 file:shadow-sm"
                />
                {doc.filename && (
                  <p className="text-xs text-gray-500 mt-2">Current file: {doc.filename}</p>
                )}
              </div>
            ) : doc?.content !== undefined ? (
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-800 mb-2"
                >
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
                  placeholder="Enter the document content…"
                />
              </div>
            ) : null}

            {/* Actions (red Cancel, green Save — same as dept modal style) */}
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl !bg-green-500 text-white text-sm font-semibold shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalEditDocument;
