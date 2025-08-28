import { useState, useEffect } from "react";
import SidebarCoSuperAdmin from "../../components/SidebarCoSuperAdmin";
import ModalUploadDocument from "../../components/ModalUploadDocument";
import ModalManualEntry from "../../components/ModalManualEntry";
import ModalScan from "../../components/ModalScan";
import { Upload, ScanLine, Pencil } from "lucide-react";
import { useDocumentStore } from "../../stores/useDocumentStore";
import { submitManualEntry } from "../../api/api";

function CoSuperAdminDocuments() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const { documents, fetchDocuments } = useDocumentStore();
  const [filterStatus, setFilterStatus] = useState("declined");
  const [search, setSearch] = useState("");
  const [showScanModal, setShowScanModal] = useState(false);

  const handleUpload = async (formData) => {
    try {
      const file = formData.get("file");
      const title = formData.get("title");
      const notes = formData.get("notes");

      await useDocumentStore.getState().createDocument(file, title, notes);
      alert("Document uploaded successfully!");
      setShowUploadModal(false);
    } catch (error) {
      alert("Upload failed: " + error.message);
    }
  };

  const handleManualSave = async (manualDoc) => {
    try {
      const formData = new FormData();
      formData.append("title", manualDoc.type);
      formData.append("content", manualDoc.content);
      if (manualDoc.notes) formData.append("notes", manualDoc.notes);

      await submitManualEntry(formData);
      alert("Manual entry saved successfully!");
      setShowManualModal(false);
      fetchDocuments(); // Refresh the document list
    } catch (err) {
      alert("Failed to submit manual document: " + err.message);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.uploaded_by_name?.toLowerCase().includes(search.toLowerCase()) ||
      doc.notes?.toLowerCase().includes(search.toLowerCase());

    const isNotPending = doc.status !== "pending-approval";
    if (filterStatus === "all") return matchesSearch && isNotPending;

    return doc.status === filterStatus && matchesSearch;
  });

  useEffect(() => {
    fetchDocuments(filterStatus === "all" ? "" : filterStatus);
  }, [filterStatus]);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 h-screen fixed top-0 left-0 z-40 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <SidebarCoSuperAdmin isOpen={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main */}
      <main
        className={`transition-all duration-300 p-8 overflow-y-auto bg-gray-100 ${
          sidebarOpen ? "ml-64" : "ml-16"
        } w-full`}
      >
        <h1 className="text-3xl font-bold text-primary mb-6">Documents</h1>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Upload */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
            <Upload className="text-primary w-12 h-12 mb-4" />
            <h2 className="text-xl font-semibold text-primary mb-4">
              Upload Documents
            </h2>
            <button
              className="!bg-primary text-white px-6 py-2 rounded hover:bg-primary transition"
              onClick={() => setShowUploadModal(true)}
            >
              Upload
            </button>
          </div>

          {/* Scan */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
            <ScanLine className="text-primary w-12 h-12 mb-4" />
            <h2 className="text-xl font-semibold text-primary mb-4">
              Scan Documents
            </h2>
            <button
              onClick={() => setShowScanModal(true)}
              className="!bg-primary text-white px-4 py-2 rounded"
            >
              Upload
            </button>
          </div>

          {/* Modal Scan */}
          {showScanModal && (
            <ModalScan onClose={() => setShowScanModal(false)} />
          )}

          {/* Manual Entry */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
            <Pencil className="text-primary w-12 h-12 mb-4" />
            <h2 className="text-xl font-semibold text-primary mb-4">
              Manual Entry
            </h2>
            <button
              className="!bg-primary text-white px-6 py-2 rounded hover:bg-primary transition"
              onClick={() => setShowManualModal(true)}
            >
              Create
            </button>
          </div>
        </div>

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
            {["approved", "declined"].map((status) => (
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
                <th className="p-4 text-center">Department</th>
                <th className="p-4 text-center">Type of Information</th>
                <th className="p-4 text-center">File</th>
                <th className="p-4 text-center">Timestamp</th>
                <th className="p-4 text-center">Status</th>
                {filterStatus === "declined" && (
                  <th className="p-4 text-center">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-100">
                    <td className="p-4 text-center text-black">
                      {doc.department}
                    </td>
                    <td className="p-4 text-center text-black">{doc.title}</td>
                    <td className="p-4 text-center text-black">
                      <button
                        onClick={async () => {
                          try {
                            const blob =
                              await useDocumentStore
                                .getState()
                                .previewDocument(doc.id);
                            const url = window.URL.createObjectURL(blob);
                            const newTab = window.open(url);
                            if (!newTab)
                              alert(
                                "Popup blocked! Please allow popups for this site."
                              );
                          } catch (err) {
                            console.error("Failed to preview document:", err);
                          }
                        }}
                        className="!bg-primary !text-white underline hover:text-blue-800"
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
                          doc.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No {filterStatus} documents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modals */}
      <ModalUploadDocument
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />
      <ModalManualEntry
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        onSave={handleManualSave}
      />
    </div>
  );
}

export default CoSuperAdminDocuments;