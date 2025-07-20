import { useState } from "react";
import SidebarAdminApprover from "../../components/SidebarAdminApprover";

function AdminApproverDocuments() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");

  const documents = [
    {
      id: 1,
      user: "Juan Dela Cruz",
      department: "Engineering",
      description: "Enrollment form for 1st sem",
      file: "enrollment_form.pdf",
      timestamp: "July 15, 2025 09:10 AM",
      status: "pending",
    },
    {
      id: 2,
      user: "Maria Santos",
      department: "Business",
      description: "Graduation clearance",
      file: "clearance.pdf",
      timestamp: "July 14, 2025 02:45 PM",
      status: "completed",
    },
  ];

  const handleConfirm = (id) => {
    console.log("Confirmed:", id);
    // TODO: Update document status to 'completed'
  };

  const handleDecline = (id) => {
    console.log("Declined:", id);
    // TODO: Handle decline
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.user.toLowerCase().includes(search.toLowerCase()) ||
      doc.description.toLowerCase().includes(search.toLowerCase());

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
        <h1 className="text-3xl font-bold text-red-800 mb-6">Documents</h1>

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Search by user or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full max-w-md text-black"
          />

          {/* Filter buttons */}
          <div className="flex gap-2">
            {["all", "pending", "completed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-md font-semibold ${
                  filterStatus === status
                    ? "!bg-blue-700 text-white"
                    : "!bg-red-600 text-white border"
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
            <thead className="bg-red-800 text-white">
              <tr>
                <th className="p-4 text-center">Submitted by</th>
                <th className="p-4 text-center">Department</th>
                <th className="p-4 text-center">Description</th>
                <th className="p-4 text-center">File</th>
                <th className="p-4 text-center">Timestamp</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-100">
                    <td className="p-4 text-center text-black">{doc.user}</td>
                    <td className="p-4 text-center text-black">{doc.department}</td>
                    <td className="p-4 text-center text-black">{doc.description}</td>
                    <td className="p-4 text-center">
                      <a
                        href={`/${doc.file}`}
                        className="text-blue-600 underline"
                        download
                      >
                        {doc.file}
                      </a>
                    </td>
                    <td className="p-4 text-center text-black">{doc.timestamp}</td>
                    <td className="p-4 text-center">
                      {doc.status === "pending" ? (
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleConfirm(doc.id)}
                            className="!bg-green-600 !text-white px-4 py-2 rounded-md hover:!bg-green-700 transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleDecline(doc.id)}
                            className="!bg-red-800 !text-white px-4 py-2 rounded-md hover:!bg-red-900 transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        <span className="text-green-700 font-semibold">Completed</span>
                      )}
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
    </div>
  );
}

export default AdminApproverDocuments;