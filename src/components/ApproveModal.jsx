function ApproveModal({ open, onClose, onConfirm, document }) {
  if (!open || !document) return null;

  const handleViewFile = async () => {
    try {
      const blob = await document.preview(); // expects a function passed via `document`
      const url = URL.createObjectURL(blob);
      const newTab = window.open(url);

      if (!newTab) {
        alert("Popup blocked! Please allow popups for this site.");
      }
    } catch (err) {
      console.error("Failed to preview document:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-primary">Approve Document</h2>

        <div className="text-sm text-gray-700 space-y-2 mb-6">
          <p><strong>Title:</strong> {document.title}</p>
          <p><strong>Submitted by:</strong> {document.uploaded_by_name}</p>
          <p><strong>Department:</strong> {document.department}</p>
          <p><strong>Notes:</strong> {document.notes || "None"}</p>

          <button
            onClick={handleViewFile}
            className="underline text-blue-600 hover:text-blue-800 text-sm mt-2"
          >
            View Attached File
          </button>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApproveModal;
