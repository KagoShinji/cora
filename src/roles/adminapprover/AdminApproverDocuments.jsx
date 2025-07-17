import { useState } from "react";
import SidebarAdminApprover from "../../components/SidebarAdminApprover";

function AdminApproverDocuments() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const documents = [
    {
      id: 1,
      user: "Juan Dela Cruz",
      description: "Enrollment form for 1st sem",
      file: "enrollment_form.pdf",
    },
    {
      id: 2,
      user: "Maria Santos",
      description: "Graduation clearance",
      file: "clearance.pdf",
    },
  ];

  const handleConfirm = (id) => {
    console.log("Confirmed:", id);
    // TODO: Confirm logic
  };

  const handleDecline = (id) => {
    console.log("Declined:", id);
    // TODO: Decline logic
  };

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

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-red-800 text-white">
              <tr>
                <th className="p-4 text-center align-middle">User</th>
                <th className="p-4 text-center align-middle">Description</th>
                <th className="p-4 text-center align-middle">File</th>
                <th className="p-4 text-center align-middle">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-100">
                  <td className="p-4 text-black text-center align-middle">{doc.user}</td>
                  <td className="p-4 text-black text-center align-middle">{doc.description}</td>
                  <td className="p-4 text-center align-middle">
                    <a
                      href={`/${doc.file}`}
                      className="text-blue-600 underline"
                      download
                    >
                      {doc.file}
                    </a>
                  </td>
                  <td className="p-4 text-center align-middle">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleConfirm(doc.id)}
                        className="!bg-red-800 !text-white px-4 py-2 rounded-md hover:!bg-red-700 transition-colors"
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
                  </td>
                </tr>
              ))}
              {documents.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No documents to review.
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