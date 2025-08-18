import { X } from "lucide-react";

function ArchiveModal({ open, onClose, onConfirm, document }) {
  if (!open || !document) return null;

  const actionText = document.archived ? "Unarchive" : "Archive";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
        {/* Title */}
        <h2 className="text-xl font-bold mb-6 text-primary text-center">
          Confirm {actionText.charAt(0).toUpperCase() + actionText.slice(1)}
        </h2>

        {/* Message */}
        <p className="text-gray-700 text-center mb-8">
          Are you sure you want to{" "}
          <span className="font-semibold text-primary">{actionText}</span>{" "}
          the document <span className="font-semibold">"{document.title}"</span>?
        </p>

        {/* Actions */}
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 !bg-white !text-primary !border-primary rounded-md hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 !bg-primary text-white rounded-md hover:!bg-primary/90 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ArchiveModal;
