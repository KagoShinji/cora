import { useState } from "react";
import { X, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function DocumentModal({
  document,
  onClose,
  onConfirm,
  onDelete,
  remarks,
  setRemarks,
}) {
  const [isApproving, setIsApproving] = useState(false);
  const [isDisapproving, setIsDisapproving] = useState(false);

  if (!document) return null;

  const statusBadge =
    document.status === "pending"
      ? "bg-blue-100 text-blue-700"
      : document.status === "completed"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-rose-100 text-rose-700";

  const statusLabel =
    document.status === "completed"
      ? "Approved"
      : document.status?.charAt(0).toUpperCase() + document.status?.slice(1);

  const handleApprove = async () => {
    try {
      setIsApproving(true);
      await onConfirm(document.id);
      toast.success("✅ Document approved successfully!");
    } catch (err) {
      console.error("Approval failed:", err);
      toast.error("❌ Failed to approve the document.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleDisapprove = async () => {
    if (!remarks.trim()) {
      toast.error("❌ Please provide remarks before disapproving.");
      return;
    }

    try {
      setIsDisapproving(true);
      await onDelete(document.id, remarks);
      toast.success("🚫 Document disapproved successfully.");
    } catch (err) {
      console.error("Disapproval failed:", err);
      toast.error("❌ Failed to disapprove the document.");
    } finally {
      setIsDisapproving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-[9999] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="doc-modal-title"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-3xl max-h-[90vh] flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="bg-white px-8 py-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-xl">
                <FileText className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h2 id="doc-modal-title" className="text-2xl font-bold text-gray-900">
                  Document Details
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Review metadata, download file, and take action
                </p>
              </div>
            </div>

            {/* Close icon */}
            <X
              onClick={onClose}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                  e.preventDefault();
                  onClose();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Close modal"
              className="w-6 h-6 text-gray-500 hover:text-gray-800 cursor-pointer transition z-20"
            />
          </div>

          {/* Background glows */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Info block */}
          <div className="px-8 py-6 bg-gradient-to-b from-gray-50/80 to-white border-b border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <span className="block text-gray-500">Submitted by</span>
                <span className="font-medium text-gray-900">{document.user || "-"}</span>
              </div>
              <div>
                <span className="block text-gray-500">Department</span>
                <span className="font-medium text-gray-900">{document.department || "-"}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="block text-gray-500">Description</span>
                <span className="font-medium text-gray-900">{document.description || "-"}</span>
              </div>
              <div>
                <span className="block text-gray-500">File</span>
                {document.file ? (
                  <a
                    href={`/${document.file}`}
                    className="font-medium text-blue-700 hover:underline"
                    download
                  >
                    {document.file}
                  </a>
                ) : (
                  <span className="font-medium text-gray-900">-</span>
                )}
              </div>
              <div>
                <span className="block text-gray-500">Timestamp</span>
                <span className="font-medium text-gray-900">{document.timestamp || "-"}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="block text-gray-500">Status</span>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge}`}
                >
                  {statusLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Action area */}
          <div className="px-8 py-6 overflow-y-auto">
            {document.status === "pending" ? (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks (optional)
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add notes for the requester before disapproving…"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm mb-4"
                  rows={3}
                  disabled={isApproving || isDisapproving}
                />

                <div className="flex justify-end gap-3">
                  <button
                    onClick={onClose}
                    disabled={isApproving || isDisapproving}
                    className="px-4 py-2 rounded-xl border border-gray-200 !bg-white !text-gray-700 hover:!bg-gray-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Close
                  </button>

                  {/* Disapprove */}
                  <button
                    onClick={handleDisapprove}
                    disabled={isDisapproving || isApproving}
                    className="px-4 py-2 rounded-xl !bg-rose-600 !text-white hover:!bg-rose-700 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    {isDisapproving ? (
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
                    ) : null}
                    {isDisapproving ? "Processing..." : "Disapprove"}
                  </button>

                  {/* Approve */}
                  <button
                    onClick={handleApprove}
                    disabled={isApproving || isDisapproving}
                    className="px-4 py-2 rounded-xl !bg-emerald-600 !text-white hover:!bg-emerald-700 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    {isApproving ? (
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
                    ) : null}
                    {isApproving ? "Processing..." : "Approve"}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex justify-center">
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-xl !bg-gray-900 !text-white hover:!bg-gray-800 transition shadow-sm"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
