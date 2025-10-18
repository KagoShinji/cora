import { X, MessageSquare, FileText, Eye } from "lucide-react";

function RemarksModal({ open, onClose, document, remarks, onView }) {
  if (!open || !document) return null;

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="remarks-title"
      aria-describedby="remarks-desc"
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
              <MessageSquare className="h-5 w-5 text-gray-700" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h2 id="remarks-title" className="text-xl font-semibold text-gray-900">
                Approver Remarks
              </h2>
              <p id="remarks-desc" className="mt-1 text-sm text-gray-600">
                Remarks provided for declined document.
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
          <p className="text-sm text-gray-700 mb-4">
            This document <strong>"{document.title}"</strong> was declined with the
            following remarks:
          </p>

          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 text-gray-800 whitespace-pre-wrap text-sm shadow-inner">
            {remarks || "No remarks provided."}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onView}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl !bg-blue-600 text-white text-sm font-semibold shadow-sm hover:!bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            <Eye className="h-4 w-4" />
            View Document
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-300 !bg-red-600 text-sm font-medium text-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default RemarksModal;