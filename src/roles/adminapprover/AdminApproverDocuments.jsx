import { useState, useEffect } from "react";
import SidebarAdminApprover from "../../components/SidebarAdminApprover";
import DocumentModal from "../../components/DocumentModal";
import { useDocumentStore } from "../../stores/useDocumentStore";
import ApproveModal from "../../components/ApproveModal";
import { approveDocument } from "../../api/api";
import DeclineModal from "../../components/DeclineModal";
import { declineDocument } from "../../api/api";

function AdminApproverDocuments() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending-approval");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);


  const [selectedDoc, setSelectedDoc] = useState(null);
  const [remarks, setRemarks] = useState("");

  const { documents, fetchDocuments } = useDocumentStore();
  

  useEffect(() => {
  fetchDocuments(filterStatus === "all" ? "" : filterStatus); 
}, [filterStatus]);

  const handleApprove = async (docId) => {
  try {
    const status = "approved"
    await approveDocument(docId,status);
    await fetchDocuments(); 
    setSelectedDoc(null);   
    setShowApproveModal(false);
    alert("Approved Succesfully")
  } catch (error) {
    console.error("Approval failed:", error);
  }
};

const handleDecline = async (docId, remarks) => {
  try {
    const status = "declined";
    await declineDocument(docId, status, remarks);
    await fetchDocuments(); 
    setSelectedDoc(null);   
    setShowDeclineModal(false);
    alert("Declined successfully");
  } catch (error) {
    console.error("Decline failed:", error);
  }
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
            {["all", "pending-approval", "approved","declined"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-md font-semibold ${
                  filterStatus === status
                    ? "!bg-blue-700 text-white"
                    : "!bg-primary text-white border"
                }`}
              >
                {status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
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
                <th className="p-4 text-center">Title</th>
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
                    <td className="p-4 text-center text-white">
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
                        className="underline hover:text-blue-800"
                      >
                        View
                      </button>
                    </td>
                    <td className="p-4 text-center text-black">
                      {new Date(doc.upload_timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          doc.status === "pending-approval"
                            ? "bg-yellow-100 text-yellow-700"
                            : doc.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : doc.status === "declined"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {doc.status === "pending-approval" ? (
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => {
                              setSelectedDoc({
                                ...doc,
                                preview: () => useDocumentStore.getState().previewDocument(doc.id),
                              });
                              setShowApproveModal(true);
                            }}
                            className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary transition-colors">
                            APPROVE
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDoc({
                                ...doc,
                                preview: () => useDocumentStore.getState().previewDocument(doc.id),
                              });
                              setShowDeclineModal(true);
                            }}
                            className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary transition-colors"
                          >
                            DECLINE
                        </button>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic"></span>
                      )}
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
      <ApproveModal
        open={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={() => handleApprove(selectedDoc.id)}
        document={selectedDoc}
      />
      <DeclineModal
        open={showDeclineModal}
        onClose={() => setShowDeclineModal(false)}
        onConfirm={(remarks) => handleDecline(selectedDoc.id, remarks)}
        document={selectedDoc}
        remarks={remarks}
        setRemarks={setRemarks}       
      />

    </div>
  );
}

export default AdminApproverDocuments;
