function DeclineModal({ open, onClose, onConfirm, document, remarks, setRemarks }) {
  if (!open || !document) return null;

  const handleViewFile = async () => {
    
    try {
      const blob = await document.preview();
      const url = URL.createObjectURL(blob);
      const newTab = window.open(url);

      if (!newTab) {
        alert("Popup blocked! Please allow popups for this site.");
      }
    } catch (err) {
      console.error("Failed to preview document:", err);
    }
  };

  const handleConfirm = () => {
  if (!remarks.trim()) {
    alert("Remarks are required to decline the document.");
    return;
  }
  onConfirm(remarks); 
};
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-red-600">Decline Document</h2>

        <div className="text-sm text-gray-700 space-y-2 mb-4">
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

        <div className="mb-4">
          <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
            Remarks <span className="text-red-500">*</span>
          </label>
          <textarea
            id="remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter reason for declining..."
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="!bg-gray-300 !text-black px-4 py-2 rounded-md hover:!bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="!bg-red-600 !text-white px-4 py-2 rounded-md hover:!bg-red-700 transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeclineModal;
