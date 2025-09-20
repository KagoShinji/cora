import { useEffect, useMemo, useState } from "react";
import { Menu } from "lucide-react";
import SidebarCoSuperAdmin from "../../components/SidebarCoSuperAdmin";
import { useAppSettingsStore } from "../../stores/useSettingsStore";

function CoSuperAdminLogs() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");

  // Theme color for headings/accents
  const primaryColor = useAppSettingsStore((s) => s.primary_color) || "#3b82f6";

  // Responsive breakpoint (md < 768px)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767.98px)");
    const handler = (e) => setIsMobile(e.matches);
    handler(mql);
    mql.addEventListener?.("change", handler);
    mql.addListener?.(handler); // Safari fallback
    return () => {
      mql.removeEventListener?.("change", handler);
      mql.removeListener?.(handler);
    };
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

  // Desktop offset: 17rem open / 5rem closed; Mobile: overlay (0 offset)
  const sidebarOffset = useMemo(
    () => (isMobile ? "0" : sidebarOpen ? "17rem" : "5rem"),
    [isMobile, sidebarOpen]
  );

  // Sample data (preserved content)
  const logs = useMemo(
    () => [
      { description: "Co-Super Admin updated a theme", timestamp: "March 27, 2025 10:20 AM" },
      { description: "Logo was changed by Alex Cruz", timestamp: "March 26, 2025 04:33 PM" },
      { description: "Theme color updated to red", timestamp: "March 25, 2025 11:45 AM" },
      { description: "Co-Super Admin logged in", timestamp: "March 25, 2025 08:30 AM" },
      { description: 'Updated system name to "Cora"', timestamp: "March 24, 2025 01:05 PM" },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return logs;
    return logs.filter(
      (row) =>
        row.description.toLowerCase().includes(q) ||
        row.timestamp.toLowerCase().includes(q)
    );
  }, [search, logs]);

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

      {/* Sidebar (mobile = drawer; desktop = collapsible) */}
      <div
        className={[
          "fixed top-0 left-0 h-screen z-50 transition-all duration-300",
          isMobile
            ? `w-64 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
            : `${sidebarOpen ? "w-64" : "w-16"}`
        ].join(" ")}
      >
        <SidebarCoSuperAdmin isOpen={sidebarOpen} setOpen={setSidebarOpen} isMobile={isMobile} />
      </div>

      {/* Main content (shifts on desktop, overlay on mobile) */}
      <main
        className="transition-all duration-300 p-6 md:p-8 overflow-y-auto w-full"
        style={{ marginLeft: sidebarOffset }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          {/* Mobile: burger + large title */}
          <div className="md:hidden flex items-center gap-3">
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
            <div className="flex-1">
              <h1
                className="text-2xl sm:text-3xl font-bold leading-tight"
                style={{ color: primaryColor }}
              >
                Logs
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                Recent Co-Super Admin activities
              </p>
            </div>
          </div>

          {/* Desktop title */}
          <div className="hidden md:block">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: primaryColor }}
            >
              Logs
            </h1>
            <p className="text-gray-600">
              Recent Co-Super Admin activities
            </p>
          </div>
        </div>

        {/* Logs Table — same modern style as AdminCreatorDashboard */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header row with search */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {filtered.length} record{filtered.length !== 1 ? "s" : ""} found
                </p>
              </div>

              <div className="w-full md:w-72">
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.length > 0 ? (
                  filtered.map((row, idx) => (
                    <tr key={`${row.description}-${idx}`} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.timestamp}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="px-6 py-8 text-center text-sm text-gray-500">
                      No logs found{search ? " for your search." : "."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CoSuperAdminLogs;
