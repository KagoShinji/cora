function DeclineModal({ open, onClose, onConfirm, document, remarks, setRemarks }) {
  if (!open || !document) return null;

  const handleConfirm = () => {
    if (!remarks.trim()) {
      alert("Remarks are required to decline the document.");
      return;
    }
    onConfirm(remarks);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
        
        {/* Title */}
        <h2 className="text-xl font-bold mb-6 text-primary text-center">
          Confirm Decline
        </h2>

        {/* Message */}
        <p className="text-gray-700 text-center mb-6">
          Are you sure you want to{" "}
          <span className="font-semibold text-primary">decline</span> the document{" "}
          <span className="font-semibold">"{document.title}"</span>?
        </p>

        {/* Remarks Input */}
        <div className="mb-8">
          <label
            htmlFor="remarks"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Remarks <span className="text-primary">*</span>
          </label>
          <textarea
            id="remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black focus:outline-none focus:ring focus:border-primary/40"
            placeholder="Enter reason for declining..."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 !bg-white !text-primary !border !border-primary rounded-md hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 !bg-primary text-white rounded-md hover:!bg-primary/90 transition"
          >
            Confirm Decline
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeclineModal;
