  import { useState, useEffect } from "react";
  import SidebarAdminApprover from "../../components/SidebarAdminApprover";
  import { useDocumentStore } from "../../stores/useDocumentStore";
  import ApproveModal from "../../components/ApproveModal";
  import DeclineModal from "../../components/DeclineModal";
  import { approveDocument, declineDocument } from "../../api/api";
  import ModalDocumentViewer from "../../components/ModalDocumentViewer";
  import ArchiveModal from "../../components/ArchiveModal";


  function AdminApproverDocuments() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("pending-approval");
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [remarks, setRemarks] = useState("");
    const [previewURL, setPreviewURL] = useState(null);
    const [keywordFilter, setKeywordFilter] = useState(null); // ✅ Stores clicked keyword
    const [isEditing, setIsEditing] = useState(false);
    const [docModalOpen, setDocModalOpen] = useState(false);
    const [docModalData, setDocModalData] = useState(null);
    const { documents, fetchDocuments } = useDocumentStore();
    const [showArchiveModal, setShowArchiveModal] = useState(false);


    useEffect(() => {
      fetchDocuments(filterStatus === "all" ? "" : filterStatus);
    }, [filterStatus]);

    const handleKeywordClick = (tag) => {
      setKeywordFilter(tag);
    };

    const clearKeywordFilter = () => {
      setKeywordFilter(null);
    };

    const handleApprove = async (docId) => {
      try {
        await approveDocument(docId, "approved");
        await fetchDocuments();
        setSelectedDoc(null);
        setShowApproveModal(false);
        alert("Approved Successfully");
      } catch (error) {
        console.error("Approval failed:", error);
      }
    };

    const handleDecline = async (docId, remarks) => {
      try {
        await declineDocument(docId, "declined", remarks);
        await fetchDocuments();
        setSelectedDoc(null);
        setShowDeclineModal(false);
        alert("Declined successfully");
      } catch (error) {
        console.error("Decline failed:", error);
      }
    };

    const handleArchive = async (doc) => {
  try {
    // Call your API to toggle archive/unarchive
    // await toggleArchive(doc.id);
    alert(`${doc.archived ? "Unarchived" : "Archived"} document: ${doc.title}`);
    await fetchDocuments();
    setShowArchiveModal(false);
    setSelectedDoc(null);
  } catch (err) {
    console.error("Failed to toggle archive:", err);
  }
};

  const handlePreview = async (doc) => {
  try {
    // Static test document with files, manualEntry, scannedDocuments, and keywords
    const testDoc = {
      ...doc,
      keywords: ["Student Life", "Scholarship", "School"], // static clickable keywords

      // ✅ PDF files
      files: [
        { title: "Finance Report 2025", name: "SampleFile1.pdf" },
        { title: "School Guidelines", name: "SampleFile2.pdf" },
      ],

      // ✅ Manual Entry
      manualEntry: {
        title: "HK Scholarship",
        content: "This is a sample manual entry for testing purposes.",
      },

// ✅ Scanned Documents
scannedDocuments: [
  { title: "Student ID Front" },
  { title: "Student ID Back" },
],

      // Main Title
      title: doc.title || "Sample Document",
    };

    setSelectedDoc(testDoc);
    setKeywordFilter(null); // reset keyword filter

    if (doc.id) {
      const blob = await useDocumentStore.getState().previewDocument(doc.id);
      const url = window.URL.createObjectURL(blob);
      setPreviewURL(url);
    }
  } catch (err) {
    console.error("Failed to preview document:", err);
  }
};

    const filteredDocs = documents.filter((doc) => {
  const matchesSearch =
    doc.uploaded_by_name?.toLowerCase().includes(search.toLowerCase()) ||
    doc.notes?.toLowerCase().includes(search.toLowerCase());

  if (filterStatus === "all") return matchesSearch;
  if (filterStatus === "archived") return doc.archived && matchesSearch; // ✅ archived filter
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

        {/* Main Split Layout */}
        <main
          className={`flex flex-col md:flex-row transition-all duration-300 bg-gray-100 ${
            sidebarOpen ? "ml-64" : "ml-16"
          } w-full`}
        >
          {/* Left Table Section */}
          <div className="w-full md:w-[70%] p-8 overflow-y-auto border-r border-gray-300">
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
                {["all", "pending-approval", "approved", "declined", "archived"].map(
  (status) => (
    <button
      key={status}
      onClick={() => setFilterStatus(status)}
      className={`px-4 py-2 rounded-md font-semibold ${
        filterStatus === status
          ? "!bg-blue-700 text-white"
          : "!bg-primary text-white border"
      }`}
    >
      {status.replace("-", " ").replace(/\b\w/g, (l) =>
        l.toUpperCase()
      )}
    </button>
  )
)}
              </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow-md rounded-lg overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="p-4 text-center">Created by</th>
                    <th className="p-4 text-center">Type of Information</th>
                    <th className="p-4 text-center">File</th>
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
                        <td className="p-4 text-center text-black">{doc.title}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handlePreview(doc)}
                            className="!bg-primary !text-white px-3 py-1 rounded hover:!bg-primary/80"
                          >
                            View
                          </button>
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
  {(doc.status === "pending-approval" || doc.status === "declined") ? (
    <div className="flex justify-center gap-2">
      <button
        onClick={() => handlePreview(doc)}
        className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary/80"
      >
        Edit
      </button>
      {doc.status === "pending-approval" && (
        <>
          <button
            onClick={() => {
              setSelectedDoc(doc);
              setShowApproveModal(true);
            }}
            className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary/80"
          >
            Approve
          </button>
          <button
            onClick={() => {
              setSelectedDoc(doc);
              setShowDeclineModal(true);
            }}
            className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary/80"
          >
            Decline
          </button>
        </>
      )}
      {doc.status !== "pending-approval" && (
        <button
          onClick={() => {
            setSelectedDoc(doc);
            setShowArchiveModal(true);
          }}
          className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-red-900"
        >
          {doc.archived ? "Unarchive" : "Archive"}
        </button>
      )}
    </div>
  ) : doc.status === "approved" ? (
    <div className="flex justify-center gap-2">
      <button
        onClick={() => handlePreview(doc)}
        className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary/80"
      >
        Edit
      </button>
      <button
        onClick={() => {
          setSelectedDoc(doc);
          setShowArchiveModal(true);
        }}
        className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-red-900"
      >
        {doc.archived ? "Unarchive" : "Archive"}
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
          </div>

          {/* Right Preview Section */}
  <div className="w-full md:w-[30%] p-4 bg-white overflow-auto border-l border-gray-300">
    {selectedDoc ? (
      <div className="flex flex-col gap-6">
        {/* PDF Files */}
<div>
  <h2 className="text-lg font-bold text-primary mb-2">PDF Documents</h2>

  {selectedDoc.files && selectedDoc.files.length > 0 ? (
    <ul className="space-y-2">
      {selectedDoc.files.map((file, idx) => {
        // Generate a URL only for real File objects
        const fileURL = file.file instanceof File 
          ? URL.createObjectURL(file.file) 
          : `/pdfs/${file.name}`; // fallback for existing PDFs

        return (
          <li key={idx} className="flex items-center justify-between gap-2">
            {/* Clickable PDF title */}
            <a
              href={fileURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {file.title} ({file.name})
            </a>

            {/* Show X only when editing */}
            {isEditing && (
              <span
                onClick={() => {
                  const newFiles = selectedDoc.files.filter((_, i) => i !== idx);
                  setSelectedDoc({ ...selectedDoc, files: newFiles });
                }}
                className="!text-primary font-bold cursor-pointer hover:text-primary"
              >
                ✕
              </span>
            )}
          </li>
        );
      })}
    </ul>
  ) : (
    <p className="text-gray-500">No PDF files found</p>
  )}

  {/* Add new PDF */}
  {isEditing && (
    <div className="mt-2">
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => {
          if (e.target.files.length > 0) {
            const newFile = {
              title: e.target.files[0].name.replace(/\.[^/.]+$/, ""),
              name: e.target.files[0].name,
              file: e.target.files[0],
            };
            setSelectedDoc({
              ...selectedDoc,
              files: [...selectedDoc.files, newFile],
            });
          }
        }}
        className="border border-primary text-primary rounded px-2 py-1"
      />
    </div>
  )}

  {/* Edit / Save buttons */}
  <div className="mt-2 flex gap-2">
    {!isEditing ? (
      <button
        onClick={() => setIsEditing(true)}
        className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary/80"
      >
        Edit
      </button>
    ) : (
      <button
        onClick={() => setIsEditing(false)}
        className="!bg-green-600 !text-white px-4 py-2 rounded-md hover:!bg-green-700"
      >
        Update
      </button>
    )}
  </div>
</div>

      {/* 3. Manual Entry */}
<div>
  <h2 className="text-lg font-bold text-primary mb-2">Manual Entry</h2>
  {selectedDoc.manualEntry && selectedDoc.manualEntry.content?.trim() ? (
    <div className="flex flex-col gap-2">
      {/* ✅ Manual Entry Title */}
      <h3 className="text-md font-semibold text-primary">
        {selectedDoc.manualEntry.title}
      </h3>

      <textarea
        value={selectedDoc.manualEntry.content}
        onChange={(e) =>
          setSelectedDoc({
            ...selectedDoc,
            manualEntry: {
              ...selectedDoc.manualEntry,
              content: e.target.value,
            },
          })
        }
        disabled={!isEditing}
        className={`w-full border border-primary rounded-md px-3 py-2 text-gray-700 outline-none focus:ring-1 focus:ring-primary ${
          !isEditing && "bg-gray-100 cursor-not-allowed"
        }`}
      />

      <div className="flex gap-2">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary/80"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={() => {
              // TODO: send updated manualEntry to API if needed
              setIsEditing(false);
            }}
            className="!bg-green-600 !text-white px-4 py-2 rounded-md hover:!bg-green-700"
          >
            Update
          </button>
        )}
      </div>
    </div>
  ) : (
    <p className="text-gray-500 italic">No Manual Text found</p>
  )}
</div> 

    {/* 4. Scanned Documents */}
{selectedDoc.scannedDocuments?.length > 0 && (
  <div className="mt-6">
    <h2 className="text-lg font-bold !text-primary mb-2">Scanned Documents</h2>
    <ul className="list-disc list-inside space-y-1">
      {selectedDoc.scannedDocuments.map((scan, idx) => (
        <li key={idx}>
          <span
            onClick={() => {
              setDocModalData({
                title: scan.title,
                content: `Preview of scanned document: ${scan.title}`, // or real extracted text later
              });
              setDocModalOpen(true);
            }}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            {scan.title}
          </span>
        </li>
      ))}
    </ul>
  </div>
)}

 {/* 2. Keywords */}
        <div>
          <h2 className="text-lg font-bold text-primary mb-2">Keywords</h2>
          {selectedDoc.keywords && selectedDoc.keywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedDoc.keywords.map((tag, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 text-sm !text-primary px-2 py-1 rounded bg-gray-200/60 cursor-pointer hover:bg-gray-300"
                  onClick={() => setKeywordFilter(tag)} // just sets filter, doesn’t replace container
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No keywords</p>
          )}
        </div>

        {/* 4. Keyword Results (only shows below, never replaces content) */}
  {keywordFilter && ( //this is the results for the keywords section
    <div className="mt-6 border-t border-gray-300 pt-4">
      <div className="flex justify-between items- center mb-4">
        <h2 className="text-lg font-bold text-primary">
          Related to: "{keywordFilter}"
        </h2>
        <span
          onClick={clearKeywordFilter}
          className="text-sm text-gray-500 cursor-pointer hover:text-primary hover:underline"
        >
          ✕ Clear
        </span>
      </div>

      {/* 🔎 Search + Dropdown */}
      <div className="flex flex-col md:flex-row items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search results..."
          className="border border-gray-300 rounded px-3 py-2 w-full md:w-2/3 text-black"
        />
        <select
          className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/3 text-black"
        >
          <option value="documents">Documents</option>
          <option value="manual">Manual Entries</option>
          <option value="scanned">Scanned Documents</option>
        </select>
      </div>

      {/* Example Results */}
<div className="mb-4">
  <h3 className="text-md font-semibold text-primary mb-2">Documents</h3>
  <ul className="list-disc list-inside space-y-1">
    {[
      { title: "Finance 2025", file: "finance_2025.pdf" },
      { title: "Student Life Guidelines", file: "Student Life_guidelines.pdf" },
      { title: "School Policy", file: "school_policy.pdf" },
    ].map((doc, idx) => (
      <li key={idx}>
        <a
          href={`/pdfs/${doc.file}`} // adjust path where PDFs are actually served
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {doc.title} ({doc.file})
        </a>
      </li>
    ))}
  </ul>
</div>

    {/* Example Manual Entries */}
    <h3 className="font-semibold !text-primary mt-4">Manual Entries</h3>
    <ul className="list-disc list-inside space-y-1">
      {[{ title: "Finance Guidelines" }, { title: "Scholarship" }].map(
        (entry, idx) => (
          <li key={idx}>
            <span
              onClick={() => {
                setDocModalData({
                  title: entry.title,
                  content: `Preview of manual entry: ${entry.title}`,
                });
                setDocModalOpen(true);
              }}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              {entry.title}
            </span>
          </li>
        )
      )}
    </ul>

    {/* Example Scanned Documents */}
    <h3 className="font-semibold !text-primary mt-4">Scanned Documents</h3>
    <ul className="list-disc list-inside space-y-1">
      {[{ title: "Student Life Guide Lines" }, { title: "School Requirements" }].map(
        (scan, idx) => (
          <li key={idx}>
            <span
              onClick={() => {
                setDocModalData({
                  title: scan.title,
                  content: `Preview of scanned document: ${scan.title}`,
                });
                setDocModalOpen(true);
              }}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              {scan.title}
            </span>
          </li>
        )
      )}
    </ul>
  </div>
)}
      </div>
    ) : (
      <p className="text-gray-500 italic">Select a document to preview</p>
    )}
  </div>

        </main>

        {/* Modals */}
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
        <ModalDocumentViewer
  isOpen={docModalOpen}
  onClose={() => setDocModalOpen(false)}
  doc={docModalData}
/>
{/* Archive Modal */}
<ArchiveModal
  open={showArchiveModal}
  onClose={() => setShowArchiveModal(false)}
  onConfirm={() => handleArchive(selectedDoc)}
  document={selectedDoc}
/>

      </div>
    );
  }

  export default AdminApproverDocuments;  
