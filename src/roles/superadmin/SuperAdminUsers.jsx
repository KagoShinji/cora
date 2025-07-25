import { useState } from "react";
import Sidebar from "../../components/SidebarSuperAdmin";
import ModalAddUser from "../../components/ModalAddUser";
import { useAuthStore } from "../../stores/userStores";

function SuperAdminUsers() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(""); // 👈 New role filter state
  const [showAddModal, setShowAddModal] = useState(false);

  const signup = useAuthStore((state) => state.signup);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const handleAddUser = async (userData) => {
    await signup(userData);
    const { error } = useAuthStore.getState();
    if (!error) {
      alert("Account created successfully!");
    } else {
      alert("Failed to create account: " + error);
    }
  };

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
          <h1 className="text-3xl font-bold text-primary">Users</h1>
          <button
            className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary transition-colors"
            onClick={() => setShowAddModal(true)}
          >
            Add User
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-primary !text-primary rounded px-4 py-2 w-full sm:max-w-sm"
          />

          {/* Role filter dropdown */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border !border-primary !text-primary rounded px-4 py-2 w-full sm:max-w-xs"
          >
            <option value="">All Roles</option>
            <option value="superadmin">Super Admin</option>
            <option value="co-superadmin">Co Super Admin</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-auto">
          <table className="min-w-full text-sm text-black">
            <thead className="bg-primary text-white">
  <tr>
    <th className="p-4 text-center">User</th>
    <th className="p-4 text-center">Email</th>
    <th className="p-4 text-center">School</th>
    <th className="p-4 text-center">Role</th>
    <th className="p-4 text-center">Timestamp</th>
    <th className="p-4 text-center">Actions</th>
  </tr>
</thead>
<tbody>
  {/* Example row - replace with dynamic content */}
  <tr className="hover:bg-gray-100 border-t border-gray-300">
    <td className="p-4 text-center">Coby</td>
    <td className="p-4 text-center">coby@gmail.com</td>
    <td className="p-4 text-center">Southwestern University PHINMA</td>
    <td className="p-4 text-center">Super Admin</td> {/* 👈 New Role Column */}
    <td className="p-4 text-center">March 23, 2025 10:42 AM</td>
    <td className="p-4">
      <div className="flex justify-center gap-3">
        <button className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary transition-colors">
          Edit
        </button>
        <button className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-primary transition-colors">
          Delete
        </button>
      </div>
    </td>
  </tr>
</tbody>
          </table>
        </div>

        {/* Add User Modal */}
        <ModalAddUser
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddUser}
        />
      </main>
    </div>
  );
}

export default SuperAdminUsers;
