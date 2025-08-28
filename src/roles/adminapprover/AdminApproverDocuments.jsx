import { useState, useEffect } from "react";
import SidebarAdminApprover from "../../components/SidebarAdminApprover";
import { useDocumentStore } from "../../stores/useDocumentStore";
import ApproveModal from "../../components/ApproveModal";
import DeclineModal from "../../components/DeclineModal";
import { approveDocument, declineDocument, viewDocument, updateDocument } from "../../api/api";
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
  const [keywordFilter, setKeywordFilter] = useState(null);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docModalData, setDocModalData] = useState(null);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [keywordResults, setKeywordResults] = useState(null);
  const [highlightedDocId, setHighlightedDocId] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const { documents, fetchDocuments } = useDocumentStore();

  useEffect(() => {
    fetchDocuments(filterStatus === "all" ? "" : filterStatus);
  }, [filterStatus]);

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
      alert(`${doc.archived ? "Unarchived" : "Archived"} document: ${doc.title}`);
      await fetchDocuments();
      setShowArchiveModal(false);
      setSelectedDoc(null);
    } catch (err) {
      console.error("Failed to toggle archive:", err);
    }
  };

  const handleViewPdf = async (docId) => {
  try {
    const blob = await viewDocument(docId);
    const blobUrl = URL.createObjectURL(blob);

    setPdfPreview({ id: docId, url: blobUrl }); // store for preview
    setHighlightedDocId(docId);
  } catch (error) {
    console.error("Error viewing PDF:", error);
    alert("Failed to load PDF.");
  }
};

  const handleSaveEdit = async (id, content) => {
    try {
      if (!id) return;
      await updateDocument(id, { content });
      alert("Saved successfully");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to save entry");
    }
  };

  const handlePreview = (doc) => {
    try {
      setKeywordResults(null);
      setKeywordFilter(null);

      const relatedDocs = documents.filter(
        (d) => d.title?.toLowerCase() === doc.title?.toLowerCase()
      );

      const previewData = {
        type: doc.title,
        files: [],
        manualEntries: [],
        scannedDocuments: [],
        keywords: [],
      };

      const addedManualEntries = new Set();
      const addedScannedDocs = new Set();
      const addedKeywords = new Set();

      relatedDocs.forEach((d) => {
        let versionLabel = d.status === "approved"
          ? (d.is_latest ? "latest version" : `v${d.version}`)
          : "pending-approval";

        if (d.filename) {
          previewData.files.push({ id: d.id, name: d.filename, title: `${d.title} (${versionLabel})` });
        }

        if (d.content && !addedManualEntries.has(d.id)) {
          previewData.manualEntries.push({ id: d.id, title: `${d.title} (${versionLabel})`, content: d.content, });
          addedManualEntries.add(d.id);
        }

        if (d.scanned_content && !addedScannedDocs.has(d.id)) {
          previewData.scannedDocuments.push({ id: d.id, title: `${d.title} (${versionLabel})`, content: d.scanned_content,  });
          addedScannedDocs.add(d.id);
        }

        if (typeof d.keywords === "string" && d.keywords.length > 0) {
          d.keywords.split(",").map(tag => tag.trim()).forEach(tag => {
            if (!addedKeywords.has(tag)) {
              previewData.keywords.push(tag);
              addedKeywords.add(tag);
            }
          });
        }
      });

      setSelectedDoc(previewData);
    } catch (err) {
      console.error("Failed to preview documents:", err);
    }
  };

  const handleKeywordClick = (tag) => {
    const cleanedTag = tag.trim();

    const docsWithKeyword = documents.filter((doc) => {
      if (typeof doc.keywords === "string") {
        const docKeywords = doc.keywords.split(",").map(k => k.trim());
        return docKeywords.includes(cleanedTag);
      }
      return false;
    });

    const groupedDocs = docsWithKeyword.reduce((acc, doc) => {
      const title = doc.title || "Manual Entry";
      if (!acc[title]) acc[title] = [];
      acc[title].push(doc);
      return acc;
    }, {});

    const resultsData = { documents: [], manualEntries: [], scannedDocuments: [] };

    Object.keys(groupedDocs).forEach(title => {
      groupedDocs[title].forEach((doc) => {
        let versionLabel = doc.status === "approved"
          ? (doc.is_latest ? "latest version" : `v${doc.version}`)
          : "pending-approval";

        if (doc.filename) resultsData.documents.push({ id: doc.id, title: `${title} (${versionLabel})`, filename: doc.filename });
        if (doc.content) resultsData.manualEntries.push({ id: doc.id, title: `${title} (${versionLabel})`, content: doc.content,});
        if (doc.scanned_content) resultsData.scannedDocuments.push({ id: doc.id, title: `${title} (${versionLabel})`, content: doc.scanned_content });
      });
    });

    setKeywordResults(resultsData);
    setKeywordFilter(tag);
    setHighlightedDocId(null); // Reset highlight
  };

  const clearKeywordFilter = () => {
    setKeywordFilter(null);
    setKeywordResults(null);
    setHighlightedDocId(null);
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.uploaded_by_name?.toLowerCase().includes(search.toLowerCase()) ||
      doc.notes?.toLowerCase().includes(search.toLowerCase());

    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "archived") return doc.archived && matchesSearch;
    return doc.status === filterStatus && matchesSearch;
  });

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className={`transition-all duration-300 h-screen fixed top-0 left-0 z-40 ${sidebarOpen ? "w-64" : "w-16"}`}>
        <SidebarAdminApprover isOpen={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      <main className={`flex flex-col md:flex-row transition-all duration-300 bg-gray-100 ${sidebarOpen ? "ml-64" : "ml-16"} w-full`}>
        <div className="w-full md:w-[70%] p-8 overflow-y-auto border-r border-gray-300">
          <h1 className="text-3xl font-bold text-primary mb-6">Documents</h1>

          {/* Search & Filter */}
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
                    className={`px-4 py-2 rounded-md font-semibold ${filterStatus === status ? "!bg-blue-700 text-white" : "!bg-primary text-white border"}`}
                  >
                    {status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Document Table */}
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
                    <tr
                      key={doc.id}
                     
                    >
                      <td className="p-4 text-center text-black">{doc.uploaded_by_name}</td>
                      <td className="p-4 text-center text-black">{doc.title}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            handlePreview(doc);
                            setHighlightedDocId(doc.id);
                          }}
                          className="!bg-primary !text-white px-3 py-1 rounded hover:!bg-primary/80"
                        >
                          View
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          doc.status === "pending-approval" ? "bg-yellow-100 text-yellow-700" :
                          doc.status === "approved" ? "bg-green-100 text-green-700" :
                          doc.status === "declined" ? "bg-red-100 text-red-700" :
                          "bg-gray-200 text-gray-800"
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {(doc.status === "pending-approval" || doc.status === "declined") ? (
                          <div className="flex justify-center gap-2">
                            {doc.status === "pending-approval" && (
                              <>
                                <button onClick={() => { setSelectedDoc(doc); setShowApproveModal(true); }} className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary/80">Approve</button>
                                <button onClick={() => { setSelectedDoc(doc); setShowDeclineModal(true); }} className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary/80">Decline</button>
                              </>
                            )}
                            {doc.status !== "pending-approval" && (
                              <button onClick={() => { setSelectedDoc(doc); setShowArchiveModal(true); }} className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-red-900">{doc.archived ? "Unarchive" : "Archive"}</button>
                            )}
                          </div>
                        ) : doc.status === "approved" ? (
                          <div className="flex justify-center gap-2">
                            <button onClick={() => { setSelectedDoc(doc); setShowArchiveModal(true); }} className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-red-900">{doc.archived ? "Unarchive" : "Archive"}</button>
                          </div>
                        ) : (<span className="text-gray-500 italic"></span>)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-500">No {filterStatus} documents found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Preview */}
        <div className="w-full md:w-[30%] p-4 bg-white overflow-auto border-l border-gray-300">
          {selectedDoc ? (
            <div className="flex flex-col gap-6">
              {/* PDF Files */}
<div>
  <h2 className="text-lg font-bold text-primary mb-2">PDF Documents</h2>
  {selectedDoc.files?.length > 0 ? (
    <ul className="space-y-2">
      {selectedDoc.files.map((file, idx) => (
        <li
          key={idx}
          className={`p-1 rounded ${highlightedDocId === file.id ? "bg-yellow-100" : ""}`}
        >
          <span
            onClick={() => handleViewPdf(file.id)}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            {file.title}
          </span>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500">No PDF files found</p>
  )}

  {/* PDF Preview below */}
  {pdfPreview && highlightedDocId === pdfPreview.id && (
    <div className="mt-4 border rounded shadow">
      <iframe
        src={pdfPreview.url}
        className="w-full h-96"
        title="PDF Preview"
      />
    </div>
  )}
</div>

              {/* Manual Entries */}
              {selectedDoc.manualEntries?.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg font-bold text-primary mb-2">Manual Entries</h2>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedDoc.manualEntries.map((entry) => (
                      <li
                        key={entry.id}
                        className={`p-1 rounded ${highlightedDocId === entry.id ? "bg-yellow-100" : ""}`}
                      >
                        <span
                          onClick={() => {
                            setDocModalData({ id: entry.id, title: entry.title, content: entry.content });
                            setDocModalOpen(true);
                            setHighlightedDocId(entry.id);
                          }}
                          className="text-blue-600 cursor-pointer hover:underline"
                        >
                          {entry.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Scanned Documents */}
              {selectedDoc.scannedDocuments?.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg font-bold !text-primary mb-2">Scanned Documents</h2>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedDoc.scannedDocuments.map((scan) => (
                      <li
                        key={scan.id}
                        className={`p-1 rounded ${highlightedDocId === scan.id ? "bg-yellow-100" : ""}`}
                      >
                        <span
                          onClick={() => { setDocModalData({ title: scan.title, content: scan.content, id: scan.id }); setDocModalOpen(true); setHighlightedDocId(scan.id); }}
                          className="text-blue-600 cursor-pointer hover:underline"
                        >
                          {scan.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Keywords */}
              <div>
                <h2 className="text-lg font-bold text-primary mb-2">Keywords</h2>
                {Array.isArray(selectedDoc.keywords) && selectedDoc.keywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedDoc.keywords.map((tag, idx) => (
                      <span key={idx} className="flex items-center gap-1 text-sm !text-primary px-2 py-1 rounded bg-gray-200/60 cursor-pointer hover:bg-gray-300" onClick={() => handleKeywordClick(tag)}>{tag}</span>
                    ))}
                  </div>
                ) : <p className="text-gray-500">No keywords</p>}
              </div>
            </div>
          ) : <p className="text-gray-500 italic">Select a document to preview</p>}

          {/* Keyword Filter Results */}
          {keywordFilter && keywordResults && (
            <div className="mt-6 border-t border-gray-300 pt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-primary">Related to: "{keywordFilter}"</h2>
                <span onClick={clearKeywordFilter} className="text-sm text-gray-500 cursor-pointer hover:text-primary hover:underline">✕ Clear</span>
              </div>

              <h3 className="font-semibold !text-primary mt-4">Manual Entries</h3>
              <ul className="list-disc list-inside space-y-1">
                {keywordResults.manualEntries.length > 0 ? (
                  keywordResults.manualEntries.map((entry) => (
                    <li
                      key={entry.id}
                      className={`p-1 rounded ${highlightedDocId === entry.id ? "bg-yellow-100" : ""}`}
                    >
                      <span
                        onClick={() => { setDocModalData({ id: entry.id, title: entry.title, content: entry.content }); setDocModalOpen(true); setHighlightedDocId(entry.id); }}
                        className="text-blue-600 cursor-pointer hover:underline"
                      >
                        {entry.title}
                      </span>
                    </li>
                  ))
                ) : <p className="text-gray-500 italic">No Manual Entries found</p>}
              </ul>

              <h3 className="font-semibold !text-primary mt-4">Scanned Documents</h3>
              <ul className="list-disc list-inside space-y-1">
                {keywordResults.scannedDocuments.length > 0 ? (
                  keywordResults.scannedDocuments.map((scan) => (
                    <li
                      key={scan.id}
                      className={`p-1 rounded ${highlightedDocId === scan.id ? "bg-yellow-100" : ""}`}
                    >
                      <span
                        onClick={() => { setDocModalData({ title: scan.title, content: scan.content, id: scan.id }); setDocModalOpen(true); setHighlightedDocId(scan.id); }}
                        className="text-blue-600 cursor-pointer hover:underline"
                      >
                        {scan.title}
                      </span>
                    </li>
                  ))
                ) : <p className="text-gray-500 italic">No Scanned Documents found</p>}
              </ul>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <ApproveModal open={showApproveModal} onClose={() => setShowApproveModal(false)} onConfirm={() => handleApprove(selectedDoc?.id)} document={selectedDoc} />
      <DeclineModal open={showDeclineModal} onClose={() => setShowDeclineModal(false)} onConfirm={(remarks) => handleDecline(selectedDoc?.id, remarks)} document={selectedDoc} remarks={remarks} setRemarks={setRemarks} />
      <ModalDocumentViewer
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        doc={docModalData}
        onSave={handleSaveEdit}
      />
      <ArchiveModal open={showArchiveModal} onClose={() => setShowArchiveModal(false)} onConfirm={() => handleArchive(selectedDoc)} document={selectedDoc} />
    </div>
  );
}

export default AdminApproverDocuments;
