import { X } from "lucide-react";

export default function DocumentModal({
  document,
  onClose,
  onConfirm,
  onDelete,
  remarks,
  setRemarks,
}) {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-2xl border relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 !bg-primary !text-white hover:text-red-500 transition"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-6 text-primary text-center">
          Document Details
        </h2>

        {/* Document Info */}
        <div className="text-gray-700 mb-6 space-y-2 max-h-[300px] overflow-y-auto pr-2">
          <p>
            <strong>Submitted by:</strong> {document.user}
          </p>
          <p>
            <strong>Department:</strong> {document.department}
          </p>
          <p>
            <strong>Description:</strong> {document.description}
          </p>
          <p>
            <strong>File:</strong>{" "}
            <a
              href={`/${document.file}`}
              className="text-blue-600 underline"
              download
            >
              {document.file}
            </a>
          </p>
          <p>
            <strong>Timestamp:</strong> {document.timestamp}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`capitalize ${
                document.status === "pending"
                  ? "text-yellow-600"
                  : document.status === "completed"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {document.status}
            </span>
          </p>
        </div>

        {/* Pending Actions */}
        {document.status === "pending" && (
          <>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter remarks before disapproving..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 outline-none focus:ring focus:ring-primary/40 mb-4"
              rows={3}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
              >
                Close
              </button>
              <button
                onClick={() => onDelete(document.id, remarks)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Disapprove
              </button>
              <button
                onClick={() => onConfirm(document.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Approve
              </button>
            </div>
          </>
        )}

        {/* Completed / Rejected View */}
        {(document.status === "completed" || document.status === "rejected") && (
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
