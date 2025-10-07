import { useState, useEffect, useMemo } from "react";
import SidebarAdminApprover from "../../components/SidebarAdminApprover";
import { useDocumentStore } from "../../stores/useDocumentStore";
import ApproveModal from "../../components/ApproveModal";
import DeclineModal from "../../components/DeclineModal";
import {
  approveDocument,
  declineDocument,
  viewDocument,
  updateDocument,
} from "../../api/api";
import ModalDocumentViewer from "../../components/ModalDocumentViewer";
import ArchiveModal from "../../components/ArchiveModal";
import { useAppSettingsStore } from "../../stores/useSettingsStore";
import toast from "react-hot-toast";

import {
  Search,
  Eye,
  FileText,
  Camera,
  Tags,
  CheckCircle2,
  XCircle,
  Archive as ArchiveIcon,
  FileSearch,
  Menu,
} from "lucide-react";

function AdminApproverDocuments() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Responsive breakpoint (md < 768px)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia("(max-width: 767.98px)");
    const handler = (e) => setIsMobile(!!e.matches);
    handler(mql); // initialize
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    } else if (typeof mql.addListener === "function") {
      mql.addListener(handler);
      return () => mql.removeListener(handler);
    }
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (!isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = sidebarOpen ? "hidden" : prev || "";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [isMobile, sidebarOpen]);

  // Close drawer on Escape (mobile only)
  useEffect(() => {
    if (!isMobile || !sidebarOpen) return;
    const onKey = (e) => e.key === "Escape" && setSidebarOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobile, sidebarOpen]);

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
  const primaryColor = useAppSettingsStore((s) => s.primary_color) || "#3b82f6";

  useEffect(() => {
    fetchDocuments(filterStatus === "all" ? "" : filterStatus);
  }, [filterStatus, fetchDocuments]);

  // Desktop offset: 17rem open / 5rem closed; Mobile: overlay (0 offset)
  const sidebarOffset = useMemo(
    () => (isMobile ? "0" : sidebarOpen ? "17rem" : "5rem"),
    [isMobile, sidebarOpen]
  );

  const handleDecline = async (docId, r) => {
  try {
    await declineDocument(docId, "declined", r);
    await fetchDocuments();
    setSelectedDoc(null);
    setShowDeclineModal(false);
    toast.error("❌ Document declined!");
  } catch (error) {
    console.error("Decline failed:", error);
    toast.error("❌ Failed to decline document.");
  }
};

const handleArchive = async (doc) => {
  try {
    await fetchDocuments();
    setShowArchiveModal(false);
    setSelectedDoc(null);

    toast.success(
      `${doc.archived ? "🗂️ Unarchived" : "📦 Archived"} document: ${doc.title}`
    );
  } catch (err) {
    console.error("Failed to toggle archive:", err);
    toast.error("❌ Failed to update archive state.");
  }
};

const handleViewPdf = async (docId) => {
  try {
    const blob = await viewDocument(docId);
    const blobUrl = URL.createObjectURL(blob);
    setPdfPreview({ id: docId, url: blobUrl });
    setHighlightedDocId(docId);
  } catch (error) {
    console.error("Error viewing PDF:", error);
    toast.error("❌ Failed to load PDF.");
  }
};

const handleSaveEdit = async (id, content) => {
  try {
    if (!id) return;
    await updateDocument(id, { content });
    toast.success("💾 Document saved successfully!");
    window.location.reload();
  } catch (err) {
    console.error(err);
    toast.error("❌ Failed to save entry");
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
        const versionLabel =
          d.status === "approved"
            ? d.is_latest
              ? "latest version"
              : `v${d.version}`
            : "pending-approval";

        if (d.filename) {
          previewData.files.push({
            id: d.id,
            name: d.filename,
            title: `${d.title} (${versionLabel})`,
          });
        }

        if (d.content && !addedManualEntries.has(d.id)) {
          previewData.manualEntries.push({
            id: d.id,
            title: `${d.title} (${versionLabel})`,
            content: d.content,
          });
          addedManualEntries.add(d.id);
        }

        if (d.scanned_content && !addedScannedDocs.has(d.id)) {
          previewData.scannedDocuments.push({
            id: d.id,
            title: `${d.title} (${versionLabel})`,
            content: d.scanned_content,
          });
          addedScannedDocs.add(d.id);
        }

        if (typeof d.keywords === "string" && d.keywords.length > 0) {
          d.keywords
            .split(",")
            .map((tag) => tag.trim())
            .forEach((tag) => {
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
        const docKeywords = doc.keywords.split(",").map((k) => k.trim());
        return docKeywords.includes(cleanedTag);
      }
      return false;
    });

    const grouped = docsWithKeyword.reduce((acc, d) => {
      const t = d.title || "Manual Entry";
      if (!acc[t]) acc[t] = [];
      acc[t].push(d);
      return acc;
    }, {});

    const resultsData = { documents: [], manualEntries: [], scannedDocuments: [] };

    Object.keys(grouped).forEach((title) => {
      grouped[title].forEach((d) => {
        const versionLabel =
          d.status === "approved"
            ? d.is_latest
              ? "latest version"
              : `v${d.version}`
            : "pending-approval";

        if (d.filename)
          resultsData.documents.push({
            id: d.id,
            title: `${title} (${versionLabel})`,
            filename: d.filename,
          });
        if (d.content)
          resultsData.manualEntries.push({
            id: d.id,
            title: `${title} (${versionLabel})`,
            content: d.content,
          });
        if (d.scanned_content)
          resultsData.scannedDocuments.push({
            id: d.id,
            title: `${title} (${versionLabel})`,
            content: d.scanned_content,
          });
      });
    });

    setKeywordResults(resultsData);
    setKeywordFilter(tag);
    setHighlightedDocId(null);
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
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      {/* Mobile backdrop (tap to close) */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar (mobile drawer / desktop collapsible) */}
      <div
        id="approver-sidebar"
        className={[
          "fixed top-0 left-0 h-screen z-50 transition-all duration-300",
          isMobile
            ? `w-64 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
            : `${sidebarOpen ? "w-64" : "w-16"}`,
        ].join(" ")}
      >
        <SidebarAdminApprover isOpen={sidebarOpen} setOpen={setSidebarOpen} isMobile={isMobile} />
      </div>

      {/* Main (pushes on desktop, overlays on mobile) */}
      <main
        className="flex flex-col md:flex-row transition-all duration-300 w-full"
        style={{ marginLeft: sidebarOffset }}
      >
        {/* Left: Documents */}
        <div className="w-full md:w-[70%] p-6 overflow-y-auto border-r border-gray-200 bg-gray-50">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            {/* Mobile: burger + title (same as dashboard) */}
            <div className="md:hidden flex items-center gap-3 w-full">
              <Menu
                onClick={() => setSidebarOpen(true)}
                role="button"
                tabIndex={0}
                aria-label="Open menu"
                className="h-6 w-6 cursor-pointer"
                style={{ color: primaryColor }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSidebarOpen(true);
                }}
                aria-pressed={sidebarOpen}
              />
              <div className="flex-1 min-w-0">
                <h1
                  className="text-2xl sm:text-3xl font-bold leading-tight truncate"
                  style={{ color: primaryColor }}
                >
                  Documents
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  Review and take action on submissions
                </p>
              </div>
            </div>

            {/* Desktop title */}
            <div className="hidden md:block">
              <h1
                className="text-3xl font-bold mb-2"
                style={{ color: primaryColor }}
              >
                Documents
              </h1>
              <p className="text-gray-600">Review and take action on submissions</p>
            </div>
          </div>

          {/* Search + Filters Card */}
          <div className="!bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: primaryColor }}
                />
                <input
                  type="text"
                  placeholder="Search by name or notes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none"
                  style={{ border: `2px solid ${primaryColor}`, backgroundColor: "#fff" }}
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-all
                    ${
                      filterStatus === "all"
                        ? "!bg-gray-900 !text-white"
                        : "!bg-gray-100 !text-gray-700 hover:!bg-gray-200 !border !border-gray-300"
                    }`}
                >
                  All
                </button>

                <button
                  onClick={() => setFilterStatus("pending-approval")}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-all
                    ${
                      filterStatus === "pending-approval"
                        ? "!bg-blue-600 !text-white"
                        : "!bg-blue-50 !text-blue-700 hover:!bg-blue-100 !border !border-blue-200"
                    }`}
                >
                  Pending
                </button>

                <button
                  onClick={() => setFilterStatus("approved")}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-all
                    ${
                      filterStatus === "approved"
                        ? "!bg-green-600 !text-white"
                        : "!bg-green-50 !text-green-700 hover:!bg-green-100 !border !border-green-200"
                    }`}
                >
                  Approved
                </button>

                <button
                  onClick={() => setFilterStatus("declined")}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-all
                    ${
                      filterStatus === "declined"
                        ? "!bg-red-600 !text-white"
                        : "!bg-red-50 !text-red-700 hover:!bg-red-100 !border !border-red-200"
                    }`}
                >
                  Declined
                </button>

                <button
                  onClick={() => setFilterStatus("archived")}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-all
                    ${
                      filterStatus === "archived"
                        ? "!bg-slate-700 !text-white"
                        : "!bg-slate-50 !text-slate-700 hover:!bg-slate-100 !border !border-slate-200"
                    }`}
                >
                  Archived
                </button>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Document List</h3>
              <p className="text-sm text-gray-600 mt-1">{filteredDocs.length} documents found</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Created by
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Type of Information
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      File
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocs.length > 0 ? (
                    filteredDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-center text-gray-900">{doc.uploaded_by_name}</td>
                        <td className="px-6 py-4 text-center text-gray-900">{doc.title}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => {
                              handlePreview(doc);
                              setHighlightedDocId(doc.id);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-md !bg-blue-600 !text-white text-sm font-medium shadow hover:!bg-blue-700 transition"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
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
                        <td className="px-6 py-4 text-center">
                          {(doc.status === "pending-approval" || doc.status === "declined") ? (
                            <div className="flex justify-center gap-2">
                              {doc.status === "pending-approval" && (
                                <>
                                  <button
                                    onClick={() => {
                                      setSelectedDoc(doc);
                                      setShowApproveModal(true);
                                    }}
                                    className="inline-flex items-center gap-1 px-4 py-2 rounded-md !bg-green-600 !text-white text-sm font-medium hover:!bg-green-700 transition"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedDoc(doc);
                                      setShowDeclineModal(true);
                                    }}
                                    className="inline-flex items-center gap-1 px-4 py-2 rounded-md !bg-red-600 !text-white text-sm font-medium hover:!bg-red-700 transition"
                                  >
                                    <XCircle className="w-4 h-4" />
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
                                  className="inline-flex items-center gap-1 px-4 py-2 rounded-md !bg-slate-700 !text-white text-sm font-medium hover:!bg-slate-800 transition"
                                >
                                  <ArchiveIcon className="w-4 h-4" />
                                  {doc.archived ? "Unarchive" : "Archive"}
                                </button>
                              )}
                            </div>
                          ) : doc.status === "approved" ? (
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedDoc(doc);
                                  setShowArchiveModal(true);
                                }}
                                className="inline-flex items-center gap-1 px-4 py-2 rounded-md !bg-slate-700 !text-white text-sm font-medium hover:!bg-slate-800 transition"
                              >
                                <ArchiveIcon className="w-4 h-4" />
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
                      <td colSpan="5" className="text-center py-6 text-gray-500">
                        No {filterStatus} documents found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Preview (modern CMS-styled cards with icons) */}
        <div className="w-full md:w-[30%] p-6 bg-white overflow-y-auto border-l border-gray-200">
          {selectedDoc ? (
            <div className="flex flex-col gap-6">
              {/* PDFs */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg !bg-blue-50">
                    <FileSearch className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-900">PDF Documents</h2>
                </div>
                <div className="p-4">
                  {selectedDoc.files?.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedDoc.files.map((file, idx) => (
                        <li
                          key={idx}
                          className={`px-3 py-2 rounded-md border text-sm cursor-pointer flex items-center justify-between ${
                            highlightedDocId === file.id
                              ? "bg-yellow-50 border-yellow-200"
                              : "bg-white border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <span
                            onClick={() => handleViewPdf(file.id)}
                            className="text-blue-700 hover:underline"
                          >
                            {file.title}
                          </span>
                          <Eye className="w-4 h-4 text-blue-600" />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">No PDF files found</p>
                  )}

                  {pdfPreview && highlightedDocId === pdfPreview.id && (
                    <div className="mt-4 border rounded-lg shadow-sm overflow-hidden">
                      <iframe src={pdfPreview.url} className="w-full h-96" title="PDF Preview" />
                    </div>
                  )}
                </div>
              </div>

              {/* Manual Entries */}
              {selectedDoc.manualEntries?.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg !bg-emerald-50">
                      <FileText className="w-4 h-4 text-emerald-600" />
                    </div>
                    <h2 className="text-sm font-semibold text-gray-900">Manual Entries</h2>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-2">
                      {selectedDoc.manualEntries.map((entry) => (
                        <li
                          key={entry.id}
                          className={`px-3 py-2 rounded-md border text-sm cursor-pointer flex items-center justify-between ${
                            highlightedDocId === entry.id
                              ? "bg-yellow-50 border-yellow-200"
                              : "bg-white border-gray-200 hover:bg-gray-50"
                          }`}
                          onClick={() => {
                            setDocModalData({
                              id: entry.id,
                              title: entry.title,
                              content: entry.content,
                            });
                            setDocModalOpen(true);
                            setHighlightedDocId(entry.id);
                          }}
                        >
                          <span className="text-emerald-700">{entry.title}</span>
                          <Eye className="w-4 h-4 text-emerald-600" />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Scanned Documents */}
              {selectedDoc.scannedDocuments?.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg !bg-orange-50">
                      <Camera className="w-4 h-4 text-orange-600" />
                    </div>
                    <h2 className="text-sm font-semibold text-gray-900">Scanned Documents</h2>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-2">
                      {selectedDoc.scannedDocuments.map((scan) => (
                        <li
                          key={scan.id}
                          className={`px-3 py-2 rounded-md border text-sm cursor-pointer flex items-center justify-between ${
                            highlightedDocId === scan.id
                              ? "bg-yellow-50 border-yellow-200"
                              : "bg-white border-gray-200 hover:bg-gray-50"
                          }`}
                          onClick={() => {
                            setDocModalData({
                              title: scan.title,
                              content: scan.content,
                              id: scan.id,
                            });
                            setDocModalOpen(true);
                            setHighlightedDocId(scan.id);
                          }}
                        >
                          <span className="text-orange-700">{scan.title}</span>
                          <Eye className="w-4 h-4 text-orange-600" />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Keywords */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg !bg-indigo-50">
                    <Tags className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-900">Keywords</h2>
                </div>
                <div className="p-4">
                  {Array.isArray(selectedDoc.keywords) && selectedDoc.keywords.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDoc.keywords.map((tag, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleKeywordClick(tag)}
                          className="px-2 py-0.5 rounded-full border text-xs font-medium !bg-blue-50 !text-blue-700 border-blue-200 hover:!bg-blue-100 transition"
                          title={`Filter by "${tag}"`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No keywords</p>
                  )}
                </div>
              </div>

              {keywordFilter && keywordResults && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg !bg-indigo-50">
                        <Tags className="w-4 h-4 text-indigo-600" />
                      </div>
                      <h2 className="text-sm font-semibold text-gray-900">
                        Related to: <span className="text-blue-700">"{keywordFilter}"</span>
                      </h2>
                    </div>
                    {/* Inline Clear link (no button) */}
                    <span
                      onClick={clearKeywordFilter}
                      role="button"
                      tabIndex={0}
                      className="text-sm text-gray-600 cursor-pointer hover:text-blue-700 hover:underline"
                    >
                      ✕ Clear
                    </span>
                  </div>

                  <div className="p-4 space-y-5">
                    {/* PDF Documents bucket */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-md !bg-blue-50">
                          <FileSearch className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">PDF Documents</h3>
                      </div>
                      {keywordResults.documents.length > 0 ? (
                        <ul className="space-y-2">
                          {keywordResults.documents.map((file) => (
                            <li
                              key={file.id}
                              className={`px-3 py-2 rounded-md border text-sm cursor-pointer flex items-center justify-between ${
                                highlightedDocId === file.id
                                  ? "bg-yellow-50 border-yellow-200"
                                  : "bg-white border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              <span
                                onClick={() => {
                                  handleViewPdf(file.id);
                                  setHighlightedDocId(file.id);
                                }}
                                className="text-blue-700 hover:underline"
                                title={file.filename || file.title}
                              >
                                {file.title}
                              </span>
                              <Eye className="w-4 h-4 text-blue-600" />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 italic text-sm">No PDF files found</p>
                      )}
                    </div>

                    {/* Manual Entries bucket */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-md !bg-emerald-50">
                          <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">Manual Entries</h3>
                      </div>
                      {keywordResults.manualEntries.length > 0 ? (
                        <ul className="space-y-2">
                          {keywordResults.manualEntries.map((entry) => (
                            <li
                              key={entry.id}
                              className={`px-3 py-2 rounded-md border text-sm cursor-pointer flex items-center justify-between ${
                                highlightedDocId === entry.id
                                  ? "bg-yellow-50 border-yellow-200"
                                  : "bg-white border-gray-200 hover:bg-gray-50"
                              }`}
                              onClick={() => {
                                setDocModalData({ id: entry.id, title: entry.title, content: entry.content });
                                setDocModalOpen(true);
                                setHighlightedDocId(entry.id);
                              }}
                            >
                              <span className="text-emerald-700">{entry.title}</span>
                              <Eye className="w-4 h-4 text-emerald-600" />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 italic text-sm">No Manual Entries found</p>
                      )}
                    </div>

                    {/* Scanned Documents bucket */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-md !bg-orange-50">
                          <Camera className="w-3.5 h-3.5 text-orange-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">Scanned Documents</h3>
                      </div>
                      {keywordResults.scannedDocuments.length > 0 ? (
                        <ul className="space-y-2">
                          {keywordResults.scannedDocuments.map((scan) => (
                            <li
                              key={scan.id}
                              className={`px-3 py-2 rounded-md border text-sm cursor-pointer flex items-center justify-between ${
                                highlightedDocId === scan.id
                                  ? "bg-yellow-50 border-yellow-200"
                                  : "bg-white border-gray-200 hover:bg-gray-50"
                              }`}
                              onClick={() => {
                                setDocModalData({ title: scan.title, content: scan.content, id: scan.id });
                                setDocModalOpen(true);
                                setHighlightedDocId(scan.id);
                              }}
                            >
                              <span className="text-orange-700">{scan.title}</span>
                              <Eye className="w-4 h-4 text-orange-600" />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 italic text-sm">No Scanned Documents found</p>
                      )}
                    </div>
                  </div>
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
        onConfirm={() => handleApprove(selectedDoc?.id)}
        document={selectedDoc}
      />
      <DeclineModal
        open={showDeclineModal}
        onClose={() => setShowDeclineModal(false)}
        onConfirm={(r) => handleDecline(selectedDoc?.id, r)}
        document={selectedDoc}
        remarks={remarks}
        setRemarks={setRemarks}
      />
      <ModalDocumentViewer
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        doc={docModalData}
        onSave={handleSaveEdit}
      />
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
