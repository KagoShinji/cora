import { useState, useEffect } from "react";
import SidebarAdminApprover from "../../components/SidebarAdminApprover";
import DocumentModal from "../../components/DocumentModal";
import { useDocumentStore } from "../../stores/useDocumentStore";

function AdminApproverDocuments() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [remarks, setRemarks] = useState("");

  const { documents, fetchDocuments } = useDocumentStore();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleConfirm = (id) => {
    console.log("Confirmed:", id);
    // TODO: API call to mark as completed
  };

  const handleDelete = (id, remark) => {
    console.log("Rejected:", id, "with remarks:", remark);
    // TODO: API call to mark as rejected
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.uploaded_by_name?.toLowerCase().includes(search.toLowerCase()) ||
      doc.notes?.toLowerCase().includes(search.toLowerCase());

    if (filterStatus === "all") return matchesSearch;
    return doc.status === filterStatus && matchesSearch;
  });

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 h-screen fixed top-0 left-0 z-40 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <SidebarAdminApprover isOpen={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main content */}
      <main
        className={`transition-all duration-300 p-8 overflow-y-auto bg-gray-100 ${
          sidebarOpen ? "ml-64" : "ml-16"
        } w-full`}
      >
        <h1 className="text-3xl font-bold text-primary mb-6">Documents</h1>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Search by name or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full max-w-md text-black"
          />

          <div className="flex gap-2">
            {["all", "pending", "completed", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-md font-semibold ${
                  filterStatus === status
                    ? "!bg-blue-700 text-white"
                    : "!bg-primary text-white border"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-4 text-center">Submitted by</th>
                <th className="p-4 text-center">Department</th>
                <th className="p-4 text-center">Notes</th>
                <th className="p-4 text-center">File</th>
                <th className="p-4 text-center">Timestamp</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-100">
                    <td className="p-4 text-center text-black">
                      {doc.uploaded_by_name}
                    </td>
                    <td className="p-4 text-center text-black">
                      {doc.department}
                    </td>
                    <td className="p-4 text-center text-black">{doc.title}</td>
                    <td className="p-4 text-center text-black">
                      <button
                        onClick={async () => {
                          try {
                            const blob = await useDocumentStore
                              .getState()
                              .previewDocument(doc.id);
                            const url = window.URL.createObjectURL(blob);
                            const newTab = window.open(url);

                            if (!newTab) {
                              alert(
                                "Popup blocked! Please allow popups for this site."
                              );
                            }
                          } catch (err) {
                            console.error("Failed to preview document:", err);
                          }
                        }}
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        {doc.filename}
                      </button>
                    </td>
                    <td className="p-4 text-center text-black">
                      {new Date(doc.upload_timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          doc.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : doc.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : doc.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="!bg-primary text-white px-4 py-2 rounded-md hover:!bg-primary/80 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    No {filterStatus} documents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal */}
      <DocumentModal
        document={selectedDoc}
        onClose={() => {
          setSelectedDoc(null);
          setRemarks("");
        }}
        onConfirm={handleConfirm}
        onDelete={handleDelete}
        remarks={remarks}
        setRemarks={setRemarks}
      />
    </div>
  );
}

export default AdminApproverDocuments;
