import { useState } from "react";
import SidebarCoSuperAdmin from "../../components/SidebarCoSuperAdmin";
import ModalAddDepartment from "../../components/ModalAddDepartment"; // <-- Import modal

function CoSuperAdminDepartments() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departments, setDepartments] = useState([]);

  const handleSaveDepartment = (name) => {
    const timestamp = new Date().toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    setDepartments((prev) => [
      { name, timestamp },
      ...prev,
    ]);
  };

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div className={`transition-all duration-300 h-screen fixed top-0 left-0 z-40 ${sidebarOpen ? "w-64" : "w-16"}`}>
        <SidebarCoSuperAdmin isOpen={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main content */}
      <main className={`transition-all duration-300 p-8 overflow-y-auto bg-gray-100 ${sidebarOpen ? "ml-64" : "ml-16"} w-full`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Departments</h1>
          <button
            className="!bg-primary text-white px-4 py-2 rounded-md hover:bg-primary transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            Add Department
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full max-w-sm text-black"
          />
        </div>

        {/* Department Table */}
        <div className="bg-white shadow-md rounded-lg overflow-auto">
          <table className="min-w-full text-sm text-black">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-4 text-center">Department</th>
                <th className="p-4 text-center">Timestamp</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((dept, index) => (
                  <tr key={index} className="hover:bg-gray-100 border-t border-gray-300">
                    <td className="p-4 text-center">{dept.name}</td>
                    <td className="p-4 text-center">{dept.timestamp}</td>
                    <td className="p-4 flex justify-center gap-2">
                      <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary transition-colors">Edit</button>
                      <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary transition-colors">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500">
                    No departments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Add Department Modal */}
      <ModalAddDepartment
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(name) => handleSaveDepartment(name)}
      />
    </div>
  );
}

export default CoSuperAdminDepartments;
