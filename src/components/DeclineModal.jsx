import { useState } from "react";
import { X, AlertTriangle, Info, Save } from "lucide-react";
import toast from "react-hot-toast";

function DeclineModal({ open, onClose, onConfirm, document, remarks, setRemarks }) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!open || !document) return null;

  const handleConfirm = async () => {
    if (!remarks.trim()) {
      toast.error("❌ Remarks are required to decline the document.");
      return;
    }

    try {
      setIsProcessing(true);
      await onConfirm(remarks);
      toast.success("🚫 Document declined successfully.");
    } catch (err) {
      console.error("Decline failed:", err);
      toast.error("❌ Failed to decline the document.");
    } finally {
      setIsProcessing(false);
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
      aria-labelledby="decline-title"
      aria-describedby="decline-desc"
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
              <AlertTriangle className="h-5 w-5 text-gray-700" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h2 id="decline-title" className="text-xl font-semibold text-gray-900">
                Confirm Decline
              </h2>
              <p
                id="decline-desc"
                className="mt-1 flex items-center gap-1 text-sm text-gray-600"
              >
                <Info className="h-4 w-4 text-gray-400" aria-hidden="true" />
                Provide remarks to proceed with declining.
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
            Are you sure you want to{" "}
            <strong className="font-semibold">decline</strong> the document{" "}
            <span className="font-semibold">"{document.title}"</span>?
          </p>

          {/* Remarks Input */}
          <div>
            <label
              htmlFor="remarks"
              className="block text-sm font-medium text-gray-800 mb-2"
            >
              Remarks <span className="text-red-500">*</span>
            </label>
            <textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
              placeholder="Enter reason for declining..."
              disabled={isProcessing}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          {/* Confirm Decline */}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl !bg-green-500 text-white text-sm font-semibold shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isProcessing ? "Processing..." : "Confirm Decline"}
          </button>

          {/* Cancel */}
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-medium text-white !bg-red-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeclineModal;
