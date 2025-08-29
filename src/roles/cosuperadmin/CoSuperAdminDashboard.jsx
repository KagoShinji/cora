import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/SidebarCoSuperAdmin";
import { useAuthStore } from "../../stores/userStores";

// NEW: Charts
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// NEW: modals
import ModalEditDepartment from "../../components/ModalEditDepartment";
import ModalConfirmDelete from "../../components/ModalConfirmDelete";
import ModalAdminUsers from "../../components/ModalAdminUsers"; // ⬅️ add this
import ModalDepartments from "../../components/ModalDepartments";

function CoSuperAdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const departments = useAuthStore((state) => state.departments);
  const fetchDepartment = useAuthStore((state) => state.getDepartment);

  // NEW: store actions
  const updateDepartment = useAuthStore((state) => state.updateDepartment);
  const deleteDepartment = useAuthStore((state) => state.deleteDepartment);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingDept, setDeletingDept] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");


  const [showDepartmentsModal, setShowDepartmentsModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showAdminsModal, setShowAdminsModal] = useState(false);
  const [selectedAdminRole, setSelectedAdminRole] = useState(null);

  const roleMap = {
  Creator: "admincreator",  
  Approver: "adminapprover",
  Guest: "guest",
};

const handleAdminSliceClick = (sliceName) => {
  setSelectedAdminRole(roleMap[sliceName] ?? null);
  setShowAdminsModal(true);
};

const handleDepartmentBarClick = () => {
  setShowDepartmentsModal(true);
};



  useEffect(() => {
    fetchDepartment();
  }, []);

  // Sample data (replace with real backend later)
  const adminData = [
    { name: "Creator", value: 8 },
    { name: "Approver", value: 5 },
    { name: "Guest", value: 3 },
  ];
  const departmentData = [
    { name: "IT", count: 10 },
    { name: "HR", count: 7 },
    { name: "Finance", count: 5 },
    { name: "Marketing", count: 6 },
  ];

  const COLORS = ["#E53E3E", "#3182CE", "#38A169"];

  // Edit handler
  const handleEditClick = (dept) => {
    setEditingDept(dept);
    setShowEditModal(true);
  };

  // Save edit
  const handleUpdateDepartment = async (id, data) => {
    await updateDepartment(id, data);
    const { error } = useAuthStore.getState();
    if (!error) {
      alert("Department updated successfully!");
      await fetchDepartment();
      setShowEditModal(false);
      setEditingDept(null);
    } else {
      alert("Failed to update department: " + error);
      throw new Error(error);
    }
  };

  // Delete handler
  const handleDeleteClick = (dept) => {
    setDeletingDept(dept);
    setDeleteError("");
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingDept) return;
    try {
      setIsDeleting(true);
      setDeleteError("");
      await deleteDepartment(deletingDept.id);
      const { error } = useAuthStore.getState();
      if (error) throw new Error(error);

      await fetchDepartment();
      setShowDeleteModal(false);
      setDeletingDept(null);
      alert("Department deleted successfully!");
    } catch (err) {
      setDeleteError(err?.message || "Failed to delete department.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <Sidebar isOpen={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 flex-1 p-8 overflow-y-auto bg-gray-100 ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <h1 className="text-3xl font-bold text-primary mb-6">Dashboard</h1>

        {/* White Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Admins with Pie Chart + Labels beside */}
            <div className="bg-gray-50 shadow rounded-lg p-6 hover:shadow-lg transition">
              <h2 className="text-lg font-semibold text-primary mb-4 text-center">
                Admins
              </h2>

              <div className="flex items-center gap-6">
                {/* Pie Chart */}
                <div className="w-2/3">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={adminData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        label={({ name, value }) => `${name} (${value})`} // 👈 show label inside slice
                        labelLine={false} // optional: hide the connector line
                        onClick={() => setShowAdminsModal(true)} // 👈 trigger modal when clicked
                      >
                        {adminData.map((entry, index) => (
                    <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    onClick={() => handleAdminSliceClick(entry.name)} // ⬅️ important
                    style={{ cursor: "pointer" }}
                    />
                      ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {showAdminsModal && (
  <ModalAdminUsers
    isOpen={showAdminsModal}
    onClose={() => setShowAdminsModal(false)}
    roleFilter={selectedAdminRole} // ⬅️ optional; filters by clicked slice
  />
)}
                {/* Labels */}
                <ul className="space-y-2 w-1/3">
                  {adminData.map((entry, index) => (
                    <li
                      key={index}
                      className="flex items-center text-gray-600 justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></span>
                        <span className="font-medium">{entry.name}</span>
                      </div>
                      <span className="text-gray-600">{entry.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Departments with Bar Chart + Labels beside */}
<div className="bg-gray-50 shadow rounded-lg p-6 hover:shadow-lg transition">
  <h2 className="text-lg font-semibold text-primary mb-4 text-center">
    Departments
  </h2>

  <div className="flex items-center gap-6">
    {/* Bar Chart */}
    <div className="w-2/3">
<ResponsiveContainer width="100%" height={200}>
  <BarChart data={departmentData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Bar
      dataKey="count"
      cursor="pointer"
      onClick={handleDepartmentBarClick} // just open modal
    >
      {departmentData.map((dept, index) => (
        <Cell key={index} fill={COLORS[index % COLORS.length]} />
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>
    </div>  

  {/* Modal for clicked department */}
{showDepartmentsModal && (
  <ModalDepartments
    isOpen={showDepartmentsModal}
    onClose={() => setShowDepartmentsModal(false)}
    department={null} // null because you want full table
  />
)}
                    {/* Labels */}
    <ul className="space-y-2 w-1/3">
      {departmentData.map((entry, index) => (
        <li
          key={index}
          className="flex items-center text-gray-600 justify-between text-sm"
        >
          <span className="font-medium">{entry.name}</span>
          <span className="text-gray-600">{entry.count}</span>
        </li>
      ))}
    </ul>
  </div>
            </div>
          </div>

          {/* New Analytics Cards (Uploaded Files & Manual Entries) */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
  {/* Uploaded Files (Pie Chart + Labels beside) */}
  <div className="bg-gray-50 shadow rounded-lg p-6 hover:shadow-lg transition">
    <h2 className="text-lg font-semibold text-primary mb-4 text-center">
      Uploaded Files
    </h2>

    <div className="flex items-center gap-6">
      {/* Pie Chart */}
      <div className="w-2/3">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={[
                { name: "Scholarship", value: 12 },
                { name: "Student Life", value: 7 },
                { name: "IT", value: 5 },
              ]}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}
              label={({ name, value }) => `${name} (${value})`} // 👈 show label inside slice
              labelLine={false} // optional: hide the connector line 
            >
              {["#3182CE", "#38A169", "#E53E3E"].map((color, index) => (
                <Cell key={index} fill={color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Labels */}
      <ul className="space-y-2 w-1/3">
        {["Scholarship", "Student Life", "IT"].map((name, i) => (
          <li
            key={i}
            className="flex items-center text-gray-600 justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ["#3182CE", "#38A169", "#E53E3E"][i],
                }}
              ></span>
              <span className="font-medium">{name}</span>
            </div>
            <span className="text-gray-600">
              {[12, 7, 5][i]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>

  {/* Manual Entries (Bar Chart + Labels beside) */}
  <div className="bg-gray-50 shadow rounded-lg p-6 hover:shadow-lg transition">
    <h2 className="text-lg font-semibold text-primary mb-4 text-center">
      Manual Entries
    </h2>

    <div className="flex items-center gap-6">
      {/* Bar Chart */}
      <div className="w-2/3">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={[
              { name: "Form A", count: 15 },
              { name: "Form B", count: 9 },
              { name: "Form C", count: 6 },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#65171D" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Labels */}
      <ul className="space-y-2 w-1/3">
        {[
          { name: "Form A", count: 15 },
          { name: "Form B", count: 9 },
          { name: "Form C", count: 6 },
        ].map((entry, i) => (
          <li
            key={i}
            className="flex items-center text-gray-600 justify-between text-sm"
          >
            <span className="font-medium">{entry.name}</span>
            <span className="text-gray-600">{entry.count}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>

          {/* Table */}
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="p-4 text-center align-middle">Department</th>
                  <th className="p-4 text-center align-middle">Timestamp</th>
                  <th className="p-4 text-center align-middle">Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-gray-100">
                    <td className="p-4 text-black text-center align-middle">
                      {dept.department_name}
                    </td>
                    <td className="p-4 text-black text-center align-middle">
                      March 23, 2025 10:42 AM
                    </td>
                    <td className="p-4 text-center align-middle">
                      <div className="flex justify-center gap-3">
                        <button
                          className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-red-700 transition-colors"
                          onClick={() => handleEditClick(dept)}
                        >
                          Edit
                        </button>
                        <button
                          className="!bg-primary !text-white px-4 py-2 rounded-md hover:!bg-red-700 transition-colors"
                          onClick={() => handleDeleteClick(dept)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <ModalEditDepartment
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingDept(null);
        }}
        onSave={handleUpdateDepartment}
        department={editingDept}
      />

      {/* Delete Confirmation Modal */}
      <ModalConfirmDelete
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingDept(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        error={deleteError}
      />
    </div>
  );
}

export default CoSuperAdminDashboard;