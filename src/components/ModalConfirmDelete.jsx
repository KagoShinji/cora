import { useEffect } from "react";

export default function ModalConfirmDelete({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  error = "",
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-2xl border text-center">
        <h2 className="text-xl font-bold mb-4 text-primary">Delete Confirmation</h2>

        <p className="text-primary mb-4">Do you want to delete this?</p>

        {error && (
          <p className="text-red-600 bg-red-100 border border-red-400 rounded p-2 text-sm mb-3">
            {error}
          </p>
        )}

        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 !bg-white text-primary border !border-primary rounded-md hover:bg-primary/10 transition disabled:opacity-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 !bg-primary text-white rounded-md hover:bg-red-700 transition disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
