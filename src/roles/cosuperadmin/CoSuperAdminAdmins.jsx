import { useState } from "react";
import Sidebar from "../../components/SidebarCoSuperAdmin";
import ModalAddAdmins from "../../components/ModalAddAdmins";
import { useAuthStore } from "../../stores/userStores";

function CoSuperAdminAdmins() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  //authstore 
  const signup = useAuthStore((state) => state.signup);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  

  const [adminList, setAdminList] = useState([
    {
      name: "Marisse",
      timestamp: "March 23, 2025 10:42 AM",
      role: "Approver",
      department: "Nursing",
    },
  ]);

  const handleSaveAdmin = async(userData) =>{
    await signup(userData)
    const {error} = useAuthStore.getState();
    if(!error){
      alert("Account created successfully!");
    }else{
      alert("Failed to create account: " + error);
    }
  }

  const filteredAdmins = adminList.filter((admin) =>
    admin.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 h-screen fixed top-0 left-0 z-40 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <Sidebar isOpen={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 p-8 overflow-y-auto bg-gray-100 ${
          sidebarOpen ? "ml-64" : "ml-16"
        } w-full`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Admin Users</h1>
          <button
            className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary"
            onClick={() => setShowAddModal(true)}
          >
            Add Admin
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search admin users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full max-w-sm"
          />
        </div>

        {/* Admin Table */}
        <div className="bg-white shadow-md rounded-lg overflow-auto">
          <table className="min-w-full text-sm text-black">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-4 text-center">Name</th>
                <th className="p-4 text-center">Timestamp</th>
                <th className="p-4 text-center">Role</th>
                <th className="p-4 text-center">Department</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 border-t border-gray-300"
                >
                  <td className="p-4 text-center">{admin.name}</td>
                  <td className="p-4 text-center">{admin.timestamp}</td>
                  <td className="p-4 text-center">{admin.role}</td>
                  <td className="p-4 text-center">{admin.department}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary">
                        Edit
                      </button>
                      <button className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAdmins.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No admin found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Admin Modal */}
        <ModalAddAdmins
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveAdmin}
        />
      </main>
    </div>
  );
}

export default CoSuperAdminAdmins;