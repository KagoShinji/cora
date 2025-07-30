export default function DocumentModal({ document, onClose, onConfirm, onDelete, remarks, setRemarks }) {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl border">
        <h2 className="text-2xl font-bold mb-4 text-primary text-center">Document Details</h2>

        <div className="text-primary mb-4 space-y-2">
          <p><strong>Submitted by:</strong> {document.user}</p>
          <p><strong>Department:</strong> {document.department}</p>
          <p><strong>Description:</strong> {document.description}</p>
          <p>
            <strong>File:</strong>{" "}
            <a href={`/${document.file}`} className="text-blue-600 underline" download>
              {document.file}
            </a>
          </p>
          <p><strong>Timestamp:</strong> {document.timestamp}</p>
          <p><strong>Status:</strong> {document.status}</p>
        </div>

        {document.status === "pending" && (
          <>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter remarks before disapproving..."
              className="w-full border border-primary rounded-md px-4 py-2 text-primary outline-none focus:ring-1 focus:ring-primary mb-4"
              rows={3}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 !bg-primary text-white border !border-primary rounded-md hover:bg-primary/10 transition"
              >
                Close
              </button>
              <button
                onClick={() => onDelete(document.id, remarks)}
                className="px-4 py-2 !bg-red-700 text-white rounded-md hover:bg-red-700 transition"
              >
                Disapprove
              </button>
              <button
                onClick={() => onConfirm(document.id)}
                className="px-4 py-2 !bg-green-600 text-white rounded-md hover:bg-primary/90 transition"
              >
                Approve
              </button>
            </div>
          </>
        )}

        {(document.status === "completed" || document.status === "rejected") && (
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 !bg-primary text-white rounded-md hover:bg-primary/90 transition"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
