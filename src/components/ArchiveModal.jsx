import { useEffect, useState } from "react";
import { X, AlertTriangle, Info, Save, Loader2 } from "lucide-react"; // ✅ Added Loader2 for spinner

export default function ArchiveModal({ open, onClose, onConfirm, document: doc }) {
  const [isLoading, setIsLoading] = useState(false); // ✅ spinner state

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !doc) return null;

  const actionText = doc.archived ? "Unarchive" : "Archive";

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
    } catch (err) {
      console.error(`${actionText} failed:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="archive-title"
      aria-describedby="archive-desc"
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
              <AlertTriangle className="h-5 w-5 text-gray-700" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h2 id="archive-title" className="text-xl font-semibold text-gray-900">
                Confirm {actionText}
              </h2>
              <p
                id="archive-desc"
                className="mt-1 flex items-center gap-1 text-sm text-gray-600"
              >
                <Info className="h-4 w-4 text-gray-400" aria-hidden="true" />
                You can reverse this by {doc.archived ? "archiving" : "unarchiving"} again.
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
        <div className="p-6">
          <p className="text-sm text-gray-700">
            Are you sure you want to{" "}
            <strong className="font-semibold">{actionText.toLowerCase()}</strong>{" "}
            the document <span className="font-semibold">"{doc.title}"</span>?
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          {/* Confirm (green, first) */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleConfirm}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl !bg-green-500 text-white text-sm font-semibold shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {doc.archived ? "Unarchiving..." : "Archiving..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Confirm
              </>
            )}
          </button>

          {/* Cancel (red, second) */}
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-medium text-white !bg-red-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
