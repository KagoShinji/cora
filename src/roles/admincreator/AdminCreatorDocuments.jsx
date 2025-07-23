import { useState } from "react";
import SidebarAdminCreator from "../../components/SidebarAdminCreator";
import ModalUploadDocument from "../../components/ModalUploadDocument";
import ModalManualEntry from "../../components/ModalManualEntry"; // ✅ Manual Entry Modal
import { Upload, ScanLine, Pencil } from "lucide-react";

function AdminCreatorDocuments() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  const handleUpload = (formData) => {
    console.log("Uploading to AI:", {
      file: formData.get("file"),
      documentType: formData.get("documentType"),
    });
    alert("Document uploaded successfully!");
    setShowUploadModal(false);
  };

  const handleManualSave = (manualDoc) => {
    console.log("Manual Entry Saved:", manualDoc);
    alert("Manual entry saved successfully!");
    setShowManualModal(false);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 h-screen fixed top-0 left-0 z-40 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <SidebarAdminCreator isOpen={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main content */}
      <main
        className={`transition-all duration-300 p-8 overflow-y-auto bg-gray-100 ${
          sidebarOpen ? "ml-64" : "ml-16"
        } w-full`}
      >
        <h1 className="text-3xl font-bold text-primary mb-6">Documents</h1>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Upload Documents */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-between">
            <Upload className="text-primary w-12 h-12 mb-4" />
            <h2 className="text-xl font-semibold text-primary mb-4">Upload Documents</h2>
            <button
              className="!bg-primary text-white px-6 py-2 rounded hover:bg-primary transition"
              onClick={() => setShowUploadModal(true)}
            >
              Upload
            </button>
          </div>

          {/* Scan Documents */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-between">
            <ScanLine className="text-primary w-12 h-12 mb-4" />
            <h2 className="text-xl font-semibold text-primary mb-4">Scan Documents</h2>
            <button className="!bg-primary text-white px-6 py-2 rounded hover:bg-primary transition">
              Upload
            </button>
          </div>

          {/* Manual Entry */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-between">
            <Pencil className="text-primary w-12 h-12 mb-4" />
            <h2 className="text-xl font-semibold text-primary mb-4">Manual Entry</h2>
            <button
              className="!bg-primary text-white px-6 py-2 rounded hover:bg-primary transition"
              onClick={() => setShowManualModal(true)}
            >
              Create
            </button>
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      <ModalUploadDocument
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />

      {/* Manual Entry Modal */}
      <ModalManualEntry
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        onSave={handleManualSave}
      />
    </div>
  );
}

export default AdminCreatorDocuments;