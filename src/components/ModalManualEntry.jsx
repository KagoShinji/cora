import { useState, useEffect } from "react";
import ModalManageDocumentType from "./ModalManageDocumentType";
import { fetchDocumentInfo } from "../api/api";
import { FileUp, Info, Tag, X, Loader2 } from "lucide-react"; // ✅ Added Loader2
import { useDocumentStore } from "../stores/useDocumentStore";

export default function ModalManualEntry({ isOpen, onClose, onSave }) {
  const [content, setContent] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [typeOfInfo, setTypeOfInfo] = useState("");
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [showError, setShowError] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // ✅ Spinner state
  const { refreshTrigger} = useDocumentStore();
  const handleKeywordKeyDown = (e) => {
    if (e.key === "Enter" && keywordInput.trim()) {
      e.preventDefault();
      const val = keywordInput.trim();
      if (!keywords.includes(val)) {
        setKeywords((prev) => [...prev, val]);
      }
      setKeywordInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() || !typeOfInfo.trim() || keywords.length === 0) {
      setShowError(true);
      return;
    }

    const payload = { title_id: typeOfInfo, keywords, content };

    try {
      setIsSaving(true);
      await onSave(payload);
      onClose();

      // Reset
      setTypeOfInfo("");
      setContent("");
      setKeywords([]);
      setKeywordInput("");
      setShowError(false);
    } catch (err) {
      console.error("Failed to save document:", err);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      (async () => {
        try {
          const res = await fetchDocumentInfo();
          setDocumentTypes(res || []);
        } catch (err) {
          console.error("Failed to fetch document types:", err);
        }
      })();
    }
  }, [isOpen,refreshTrigger]);

  if (!isOpen) return null;

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="manual-title"
        aria-describedby="manual-desc"
        onMouseDown={handleBackdrop}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

        {/* Modal Card */}
        <div
          className="relative w-full max-w-lg mx-4 rounded-2xl bg-white shadow-2xl border border-gray-200 max-h-[calc(100vh-2rem)] overflow-hidden"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-200">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-200">
                <FileUp className="h-5 w-5 text-gray-700" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2 id="manual-title" className="text-xl font-semibold text-gray-900">
                  Manual Document Entry
                </h2>
                <p
                  id="manual-desc"
                  className="mt-1 flex items-center gap-1 text-sm text-gray-600"
                >
                  <Info className="h-4 w-4" aria-hidden="true" />
                  Enter content, keywords, and type of information.
                </p>
              </div>

              {/* Clickable X icon */}
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
              {/* Type of Information */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Type of Information <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={typeOfInfo}
                    onChange={(e) => setTypeOfInfo(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white shadow-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
                  >
                    <option value="">Select type</option>
                    {documentTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>

                  {/* Manage Types */}
                  <button
                    type="button"
                    onClick={() => setShowTypeModal(true)}
                    className="flex items-center justify-center w-10 h-10 text-lg font-bold !bg-white border !border-gray-300 rounded-xl text-gray-700 hover:!bg-gray-100 transition"
                    title="Manage Types"
                    aria-label="Manage Types"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  placeholder="Enter the document content here..."
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-200 resize-none"
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Keywords <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={handleKeywordKeyDown}
                    placeholder="Press Enter to add keyword"
                    className={`w-full pl-9 pr-3 py-3 border rounded-xl text-gray-900 placeholder-gray-400 shadow-sm outline-none transition ${
                      keywords.length === 0 && showError
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
                    }`}
                  />
                </div>

                {showError && keywords.length === 0 && (
                  <p className="mt-1 text-sm text-red-500">
                    Please add at least one keyword.
                  </p>
                )}

                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {keywords.map((tag, idx) => (
                      <span
                        key={`${tag}-${idx}`}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200"
                      >
                        {tag}
                        <span
                          onClick={() =>
                            setKeywords(keywords.filter((_, i) => i !== idx))
                          }
                          role="button"
                          tabIndex={0}
                          className="text-gray-500 hover:text-red-500 cursor-pointer select-none"
                        >
                          ×
                        </span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl !bg-green-500 text-white text-sm font-semibold shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-70"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Proceed"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Document Type Modal */}
      <ModalManageDocumentType
        isOpen={showTypeModal}
        onClose={() => setShowTypeModal(false)}
      />
    </>
  );
}
