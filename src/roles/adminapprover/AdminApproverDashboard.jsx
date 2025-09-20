import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import SidebarAdminApprover from "../../components/SidebarAdminApprover";
import DocumentModal from "../../components/DocumentModal";
import { useDocumentStore } from "../../stores/useDocumentStore";
import { FileText, ClipboardList, ChevronRight, Eye, Menu } from "lucide-react";
import { useAppSettingsStore } from "../../stores/useSettingsStore";

function AdminApproverDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Responsive breakpoint (md < 768px)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia("(max-width: 767.98px)");
    const handler = (e) => setIsMobile(!!e.matches);
    handler(mql); // initialize now
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

  const { documents, fetchDocuments } = useDocumentStore();

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [remarks, setRemarks] = useState("");

  const handleView = (doc) => {
    setSelectedDoc(doc);
    setRemarks(doc.remarks || "");
  };

  const handleClose = () => {
    setSelectedDoc(null);
    setRemarks("");
  };

  // NOTE: These are placeholders — keep your real API/store actions wired in your modal.
  const handleApprove = async (id) => {
    handleClose();
  };

  const handleDisapprove = async (id, newRemarks) => {
    handleClose();
  };

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Theme color from settings
  const primaryColor =
    useAppSettingsStore((s) => s.primary_color) || "#3b82f6";

  // Desktop offset: 17rem open / 5rem closed; Mobile: overlay (0 offset)
  const sidebarOffset = useMemo(
    () => (isMobile ? "0" : sidebarOpen ? "17rem" : "5rem"),
    [isMobile, sidebarOpen]
  );

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
        <SidebarAdminApprover
          isOpen={sidebarOpen}
          setOpen={setSidebarOpen}
          isMobile={isMobile}
        />
      </div>

      {/* Main content (pushes on desktop, overlays on mobile) */}
      <main
        className="transition-all duration-300 p-6 overflow-y-auto bg-gray-50 w-full"
        style={{ marginLeft: sidebarOffset }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {/* Mobile: burger + title (same style as dashboard) */}
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
                Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                Approve or reject documents and track activity
              </p>
            </div>
          </div>

          {/* Desktop title */}
          <div className="hidden md:block">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: primaryColor }}
            >
              Dashboard
            </h1>
            <p className="text-gray-600">
              Approve or reject documents and track activity
            </p>
          </div>
        </div>

        {/* Modernized Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Documents Card */}
          <Link to="/adminapprover/documents" className="group">
            <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-blue-200 hover:-translate-y-1 overflow-hidden">

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg group-hover:shadow-blue-200 transition-all duration-300">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: primaryColor }}>
                      —
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      Quick Access
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Documents
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Review and approve pending submissions.
                </p>

                <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors">
                  <span>Open Documents</span>
                  <ChevronRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Logs Card */}
          <Link to="/adminapprover/logs" className="group">
            <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-emerald-200 hover:-translate-y-1 overflow-hidden">
              <div className="absolute top-6 right-4 w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-tr from-emerald-50 to-teal-50 rounded-full opacity-30"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg group-hover:shadow-emerald-200 transition-all duration-300">
                    <ClipboardList className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600">
                      Live
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      Status
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  Activity Logs
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Track document decisions and reviewer actions.
                </p>

                <div className="flex items-center text-emerald-600 font-medium text-sm group-hover:text-emerald-700 transition-colors">
                  <span>View Logs</span>
                  <ChevronRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Pending Documents</h3>
            <p className="text-sm text-gray-600 mt-1">
              Review and take action on submissions
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Submitted By
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {doc.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {doc.uploaded_by_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {doc.upload_timestamp ? new Date(doc.upload_timestamp).toLocaleString() : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
                          ${
                            doc.status === "pending"
                              ? "bg-blue-100 text-blue-700"
                              : doc.status === "completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                      >
                        {doc.status === "completed"
                          ? "Approved"
                          : doc.status?.charAt(0).toUpperCase() + doc.status?.slice(1)}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md !bg-blue-600 !text-white text-sm font-medium shadow hover:!bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                        onClick={() => handleView(doc)}
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {documents.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-6 text-center text-gray-500 text-sm"
                    >
                      No documents found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
