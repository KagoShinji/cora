import { useState, useEffect } from "react";
import SidebarAdminCreator from "../../components/SidebarAdminCreator";
import ModalUploadDocument from "../../components/ModalUploadDocument";
import ModalManualEntry from "../../components/ModalManualEntry";
import ModalScan from "../../components/ModalScan";
import ModalEditDocument from "../../components/ModalEditDocument";
import { Upload, ScanLine, Pencil } from "lucide-react";
import { useDocumentStore } from "../../stores/useDocumentStore";
import { submitManualEntry, updateDocument } from "../../api/api";

// New content modal
function ContentModal({ isOpen, onClose, title, content }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-xl relative">
        {/* Top-right close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="mb-4 whitespace-pre-wrap text-black">{content}</div>

        {/* Bottom close button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminCreatorDocuments() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const { documents, fetchDocuments } = useDocumentStore();
  const [filterStatus, setFilterStatus] = useState("declined");
  const [search, setSearch] = useState("");
  const [showScanModal, setShowScanModal] = useState(false);  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);

  // New: content modal state
  const [showContentModal, setShowContentModal] = useState(false);
  const [contentModalData, setContentModalData] = useState({ title: "", content: "" });

  const handleUpload = async (formData) => {
    try {
      const file = formData.get("file");
      const title_id = formData.get("title_id");
      const keywords = formData.get("keywords");

      await useDocumentStore.getState().createDocument(file, title_id, keywords);
      alert("Document uploaded successfully!");
      setShowUploadModal(false);
      fetchDocuments();
    } catch (error) {
      alert("Upload failed: " + error.message);
    }
  };

  const handleManualSave = async (manualDoc) => {
    try {
      const payload = {
        title_id: manualDoc.title_id,
        content: manualDoc.content,
        keywords: manualDoc.keywords || [],
      };
      await submitManualEntry(payload);
      alert("Manual entry saved successfully!");
      setShowManualModal(false);
      fetchDocuments(); 
    } catch (err) {
      alert("Failed to submit manual document: " + err.message);
    }
  };

  const handleEdit = (doc) => {
    setEditingDoc(doc);
    setShowEditModal(true);
  };

  const handleUpdate = async (updatedData) => {
    try {
      await updateDocument(updatedData.id, updatedData);
      alert("Document updated successfully!");
      setShowEditModal(false);
      setEditingDoc(null);
      fetchDocuments(filterStatus === "all" ? "" : filterStatus);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update document: " + error.message);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.uploaded_by_name?.toLowerCase().includes(search.toLowerCase()) ||
      doc.keywords?.toLowerCase().includes(search.toLowerCase());

    const isNotPending = doc.status !== "pending-approval";
    if (filterStatus === "all") return matchesSearch && isNotPending;

    return doc.status === filterStatus && matchesSearch;
  });

  const handleView = async (doc) => {
    try {
      if (doc.content) {
        // Manual content: open modal
        setContentModalData({
          title: doc.title || "No title",
          content: doc.content || "No content",
        });
        setShowContentModal(true);
      } else {
        // File: open in new tab
        const blob = await useDocumentStore.getState().previewDocument(doc.id);
        if (!blob) {
          alert("No file found for this document.");
          return;
        }
        const url = window.URL.createObjectURL(blob);
        const newTab = window.open(url);
        if (!newTab) alert("Popup blocked! Please allow popups for this site.");
      }
    } catch (err) {
      console.error("Failed to preview document:", err);
      alert("Failed to preview document. Please check if the file exists.");
    }
  };

  useEffect(() => {
    fetchDocuments(filterStatus === "all" ? "" : filterStatus); 
  }, [filterStatus]);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div className={`transition-all duration-300 h-screen fixed top-0 left-0 z-40 ${sidebarOpen ? "w-64" : "w-16"}`}>
        <SidebarAdminCreator isOpen={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main */}
      <main className={`transition-all duration-300 p-8 overflow-y-auto bg-gray-100 ${sidebarOpen ? "ml-64" : "ml-16"} w-full`}>
        <h1 className="text-3xl font-bold text-primary mb-6">Documents</h1>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
            <Upload className="text-primary w-12 h-12 mb-4" />
            <h2 className="text-xl font-semibold text-primary mb-4">Upload Documents</h2>
            <button className="!bg-primary text-white px-6 py-2 rounded hover:bg-primary transition" onClick={() => setShowUploadModal(true)}>Upload</button>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
            <ScanLine className="text-primary w-12 h-12 mb-4" />
            <h2 className="text-xl font-semibold text-primary mb-4">Scan Documents</h2>
            <button onClick={() => setShowScanModal(true)} className="!bg-primary text-white px-4 py-2 rounded">Upload</button>
          </div>
          {showScanModal && <ModalScan onClose={() => setShowScanModal(false)} />}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
            <Pencil className="text-primary w-12 h-12 mb-4" />
            <h2 className="text-xl font-semibold text-primary mb-4">Manual Entry</h2>
            <button className="!bg-primary text-white px-6 py-2 rounded hover:bg-primary transition" onClick={() => setShowManualModal(true)}>Create</button>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <input type="text" placeholder="Search by name or keywords..." value={search} onChange={(e) => setSearch(e.target.value)} className="border border-gray-300 rounded px-4 py-2 w-full max-w-md text-black" />
          <div className="flex gap-2">
            {["approved", "declined"].map((status) => (
              <button key={status} onClick={() => setFilterStatus(status)} className={`px-4 py-2 rounded-md font-semibold ${filterStatus === status ? "!bg-blue-700 text-white" : "!bg-primary text-white border"}`}>
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
                {filterStatus === "declined" && <th className="p-4 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredDocs.length > 0 ? filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-100">
                  <td className="p-4 text-center text-black">{doc.department?.department_name}</td>
                  <td className="p-4 text-center text-black">{doc.title}</td>
                  <td className="p-4 text-center text-black">
                    <button onClick={() => handleView(doc)} className="!bg-primary !text-white underline hover:text-blue-800">View</button>
                  </td>
                  <td className="p-4 text-center text-black">{new Date(doc.upload_timestamp).toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${doc.status === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {doc.status}
                    </span>
                  </td>
                  {filterStatus === "declined" && (
                    <td className="p-4 text-center">
                      <button onClick={() => handleEdit(doc)} className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary/80">Edit</button>
                    </td>
                  )}
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">No {filterStatus} documents found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modals */}
      <ModalUploadDocument isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} onUpload={handleUpload} />
      <ModalManualEntry isOpen={showManualModal} onClose={() => setShowManualModal(false)} onSave={handleManualSave} />
      <ModalEditDocument isOpen={showEditModal} onClose={() => setShowEditModal(false)} document={editingDoc} onUpdate={handleUpdate} />
      <ContentModal isOpen={showContentModal} onClose={() => setShowContentModal(false)} title={contentModalData.title} content={contentModalData.content} />
    </div>
  );
}

export default AdminCreatorDocuments;