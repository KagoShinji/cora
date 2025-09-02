import { useState } from "react";
import { Link } from "react-router-dom";
import SidebarAdminApprover from "../../components/SidebarAdminApprover";
import DocumentModal from "../../components/DocumentModal";
import { useDocumentStore } from "../../stores/useDocumentStore";
import { useEffect } from "react";

function AdminApproverDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // NEW: basic local documents state so we can update status after Approve/Disapprove
  const { documents, fetchDocuments } = useDocumentStore();

  // NEW: modal state
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [remarks, setRemarks] = useState("");

  // NEW: open modal
  const handleView = (doc) => {
    setSelectedDoc(doc);
    setRemarks(doc.remarks || "");
  };

  // NEW: close modal
  const handleClose = () => {
    setSelectedDoc(null);
    setRemarks("");
  };

  // NEW: approve handler
  const handleApprove = async (id) => {
    // TODO: Replace with your store/API call, then refresh state from server.
    // e.g., await approveDocument(id)
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "completed" } : d))
    );
    handleClose();
  };

  // NEW: disapprove handler (with remarks)
  const handleDisapprove = async (id, newRemarks) => {
    // TODO: Replace with your store/API call, then refresh state from server.
    // e.g., await rejectDocument(id, newRemarks)
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: "rejected", remarks: newRemarks || "" }
          : d
      )
    );
    handleClose();
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <SidebarAdminApprover isOpen={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main content */}
      <main
        className={`transition-all duration-300 flex-1 p-8 overflow-y-auto bg-gray-100 ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <h1 className="text-3xl font-bold text-primary mb-6">Dashboard</h1>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Link to="/adminapprover/documents">
            <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-center flex-col cursor-pointer hover:shadow-lg transition">
              <div className="text-4xl mb-2">📄</div>
              <h2 className="text-xl font-semibold text-primary">Documents</h2>
            </div>
          </Link>
          <Link to="/adminapprover/logs">
            <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-center flex-col cursor-pointer hover:shadow-lg transition">
              <div className="text-4xl mb-2">📝</div>
              <h2 className="text-xl font-semibold text-primary">Logs</h2>
            </div>
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-4 text-center">Document</th>
                <th className="p-4 text-center">Submitted By</th>
                <th className="p-4 text-center">Timestamp</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-100">
                  <td className="p-4 text-center">{doc.title}</td>
                  <td className="p-4 text-center">{doc.uploaded_by_name}</td>
                  <td className="p-4 text-center">
                    {new Date(doc.upload_timestamp).toLocaleString()}
                  </td>
                  <td className="p-4 text-center">
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold ${
      doc.status === "pending"
        ? "bg-yellow-100 text-yellow-700"
        : doc.status === "completed"
        ? "bg-green-100 text-green-700"   // Approved → Green
        : "bg-red-100 text-red-700"
    }`}
  >
    {doc.status === "completed"
      ? "Approved"
      : doc.status?.charAt(0).toUpperCase() + doc.status?.slice(1)}
  </span>
</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary transition-colors"
                        onClick={() => handleView(doc)}
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {documents.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No documents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Document Modal */}
        <DocumentModal
          document={selectedDoc}
          onClose={handleClose}
          onConfirm={handleApprove}
          onDelete={handleDisapprove}
          remarks={remarks}
          setRemarks={setRemarks}
        />
      </main>
    </div>
  );
}

export default AdminApproverDashboard;
