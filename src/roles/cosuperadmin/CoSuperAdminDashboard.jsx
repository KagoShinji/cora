// Updated component with new top analytics bar graphs
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/SidebarCoSuperAdmin";
import { useAuthStore } from "../../stores/userStores";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ModalEditDepartment from "../../components/ModalEditDepartment";
import ModalConfirmDelete from "../../components/ModalConfirmDelete";
import ModalAdminUsers from "../../components/ModalAdminUsers";
import ModalDepartments from "../../components/ModalDepartments";
import { getUser,mostSearchData} from "../../api/api";


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

  const [searchStartDate, setSearchStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [searchEndDate, setSearchEndDate] = useState(new Date());
  const [ratingStartDate, setRatingStartDate] = useState(null);
  const [ratingEndDate, setRatingEndDate] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading,setLoading] = useState()
  

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

  // Sample data for new top analytics
  const searchedDataClassification = [
    { name: "Scholarship", count: 45, category: "Academic" },
    { name: "Student Services", count: 38, category: "Services" },
    { name: "IT Support", count: 32, category: "Technical" },
    { name: "Academic Records", count: 28, category: "Academic" },
    { name: "Financial Aid", count: 24, category: "Financial" },
    { name: "Campus Events", count: 19, category: "Social" },
  ];

  const userExperienceRatings = [
    { name: "Excellent", count: 42, rating: 5 },
    { name: "Good", count: 35, rating: 4 },
    { name: "Average", count: 18, rating: 3 },
    { name: "Poor", count: 8, rating: 2 },
    { name: "Very Poor", count: 3, rating: 1 },
  ];


  const COLORS = ["#E53E3E", "#3182CE", "#38A169"];
  const SEARCH_COLORS = ["#2D3748", "#4A5568", "#718096", "#A0AEC0", "#CBD5E0", "#E2E8F0"];
  const RATING_COLORS = ["#48BB78", "#68D391", "#FBD38D", "#FC8181", "#F56565"];
  
  // Added missing color arrays for file analytics
  const FILE_COLORS = ["#8B5CF6", "#06B6D4", "#F59E0B"];
  const MANUAL_COLORS = ["#EF4444", "#10B981", "#3B82F6"];

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
  
 useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUser();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(()=>{
    
  })

  const userChart = users.reduce((acc, user) => {
    const role = user.role || "Unknown";

    // skip superadmin + co-superadmin
    if (role === "superadmin" || role === "co-superadmin") return acc;

    const found = acc.find((item) => item.name === role);
    if (found) {
      found.value += 1;
    } else {
      acc.push({ name: role, value: 1 });
    }
    return acc;
  }, []);

  const deptChart = users.reduce((acc, user) => {
  const department = user.department || "Unknown"
   
  if(department === "Unknown") return acc;
  const found = acc.find((item) => item.name === department);
  if (found) {
    found.count += 1; 
  } else {
    acc.push({ name: department, count: 1 }); // add new
  }

  return acc;
}, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen transition-all duration-300 z-10 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <Sidebar isOpen={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main Content - Added relative z-0 to create stacking context */}
      <main
        className={`transition-all duration-300 flex-1 p-8 overflow-y-auto bg-gray-100 relative z-0 ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <h1 className="text-3xl font-bold text-primary mb-6">Dashboard</h1>

        {/* White Card */}
        <div className="bg-white shadow-md rounded-lg p-6 relative z-0">
          {/* NEW: Top Analytics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* Classification of Most Searched Data */}
<div className="bg-gray-50 shadow rounded-lg p-6 hover:shadow-lg transition relative z-0">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-semibold text-blue-700">
      Classification of Most Searched Data
    </h2>
    {/* Date Range Picker */}
    <div className="flex items-center space-x-2">
      <DatePicker
        selected={searchStartDate}
        onChange={(date) => setSearchStartDate(date)}
        selectsStart
        startDate={searchStartDate}
        endDate={searchEndDate}
        className="text-black border border-gray-300 rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <span className="text-gray-500">to</span>
      <DatePicker
        selected={searchEndDate}
        onChange={(date) => setSearchEndDate(date)}
        selectsEnd
        startDate={searchStartDate}
        endDate={searchEndDate}
        minDate={searchStartDate}
        className="text-black border border-gray-300 rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  </div>

  <p className="text-xs text-gray-500 text-center mb-4">
    Basis: {searchStartDate?.toLocaleDateString()} – {searchEndDate?.toLocaleDateString()}
  </p>

              <div className="flex items-center gap-6">
                {/* Bar Chart */}
                <div className="w-2/3 relative z-0">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={searchedDataClassification}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        height={80}
                        fontSize={11}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [`${value} searches`, 'Count']}
                        labelFormatter={(label) => `Category: ${label}`}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {searchedDataClassification.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={SEARCH_COLORS[index % SEARCH_COLORS.length]} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Labels */}
                <ul className="space-y-2 w-1/3">
                  {searchedDataClassification.map((entry, index) => (
                    <li
                      key={index}
                      className="flex items-center text-gray-600 justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-sm"
                          style={{ backgroundColor: SEARCH_COLORS[index % SEARCH_COLORS.length] }}
                        ></span>
                        <span className="font-medium text-xs">{entry.name}</span>
                      </div>
                      <span className="text-gray-600 font-bold">{entry.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* User Experience Rating */}
<div className="bg-gray-50 shadow rounded-lg p-6 hover:shadow-lg transition relative z-0">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-semibold text-blue-700">
      User Experience Rating
    </h2>
    {/* Date Range Picker */}
    <div className="flex items-center space-x-2">
      <DatePicker
        selected={ratingStartDate}
        onChange={(date) => setRatingStartDate(date)}
        selectsStart
        startDate={ratingStartDate}
        endDate={ratingEndDate}
        className="text-black border border-gray-300 rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <span className="text-gray-500">to</span>
      <DatePicker
        selected={ratingEndDate}
        onChange={(date) => setRatingEndDate(date)}
        selectsEnd
        startDate={ratingStartDate}
        endDate={ratingEndDate}
        minDate={ratingStartDate}
        className="text-black border border-gray-300 rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>

  <p className="text-xs text-gray-500 text-center mb-4">
    Basis: {ratingStartDate?.toLocaleDateString()} – {ratingEndDate?.toLocaleDateString()}
  </p>

              <div className="flex items-center gap-6">
                {/* Bar Chart */}
                <div className="w-2/3 relative z-0">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={userExperienceRatings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        height={80}
                        fontSize={11}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [`${value} responses`, 'Count']}
                        labelFormatter={(label) => `Rating: ${label}`}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {userExperienceRatings.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={RATING_COLORS[index % RATING_COLORS.length]} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Labels */}
                <ul className="space-y-2 w-1/3">
                  {userExperienceRatings.map((entry, index) => (
                    <li
                      key={index}
                      className="flex items-center text-gray-600 justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: RATING_COLORS[index % RATING_COLORS.length] }}
                        ></span>
                        <div className="flex flex-col">
                          <span className="font-medium text-xs">{entry.name}</span>
                          <span className="text-gray-400 text-xs">
                            {'★'.repeat(entry.rating)}{'☆'.repeat(5-entry.rating)}
                          </span>
                        </div>
                      </div>
                      <span className="text-gray-600 font-bold">{entry.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Enhanced Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Enhanced Admins with Pie Chart + Labels beside */}
            <div className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 relative z-0" onClick={() => handleAdminSliceClick("Users")}>
              <div className="flex items-center justify-center mb-4">
                <div className="bg-primary/10 rounded-full p-2 mr-2">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-800">
                  Users
                </h2>
              </div>

              <div className="flex items-center gap-6">
                {/* Enhanced Pie Chart */}
                <div className="w-2/3 relative z-0">
                   <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={userChart}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                      paddingAngle={3}
                    >
                      {userChart.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          style={{
                            cursor: "pointer",
                            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                          }}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} users`, name]}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                  {/* Center text */}
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {userChart.reduce((sum, item) => sum + item.value, 0)}
                    </div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                </div>
              </div>

                {/* Enhanced Labels */}
                <ul className="space-y-3 w-1/3">
                  {userChart.map((entry, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/50 hover:bg-white/80 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-4 h-4 rounded-full shadow-sm"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></span>
                        <span className="font-medium text-gray-700 text-sm">{entry.name}</span>
                      </div>
                      <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-bold text-gray-700">
                        {entry.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Enhanced Departments with Bar Chart + Labels beside */}
            <div className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 relative z-0">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-primary/10 rounded-full p-2 mr-2">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-800">
                  Departments
                </h2>
              </div>

              <div className="flex items-center gap-6">
                {/* Enhanced Bar Chart */}
                <div className="w-2/3 relative z-0">
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={deptChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                      />
                      <Tooltip 
                        formatter={(value, name) => [`${value} users`, 'Count']}
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar
                        dataKey="count"
                        cursor="pointer"
                        
                        radius={[4, 4, 0, 0]}
                      >
                        {deptChart.map((dept, index) => (
                          <Cell 
                            key={index} 
                            fill={COLORS[index % COLORS.length]}
                            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Enhanced Labels */}
                <ul className="space-y-3 w-1/3">
                  {deptChart.map((entry, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/50 hover:bg-white/80 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-4 h-4 rounded-sm shadow-sm"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></span>
                        <span className="font-medium text-gray-700 text-sm">{entry.name}</span>
                      </div>
                      <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-bold text-gray-700">
                        {entry.count}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Enhanced File Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Uploaded Files with Enhanced Pie Chart */}
            <div className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 relative z-0">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-primary/10 rounded-full p-2 mr-2">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-800">
                  File Uploads
                </h2>
              </div>

              <div className="flex items-center gap-6">
                {/* Enhanced Pie Chart */}
                <div className="w-2/3 relative z-0">
                  <ResponsiveContainer width="100%" height={220}>
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
                        outerRadius={80}
                        innerRadius={45}
                        paddingAngle={3}
                      >
                        {FILE_COLORS.map((color, index) => (
                          <Cell 
                            key={index} 
                            fill={color}
                            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [`${value} files`, name]}
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center text */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">24</div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Labels */}
                <ul className="space-y-3 w-1/3">
                  {["Scholarship", "Student Life", "IT"].map((name, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/50 hover:bg-white/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-4 h-4 rounded-full shadow-sm"
                          style={{ backgroundColor: FILE_COLORS[i] }}
                        ></span>
                        <span className="font-medium text-gray-700 text-sm">{name}</span>
                      </div>
                      <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-bold text-gray-700">
                        {[12, 7, 5][i]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
        
            {/* Manual Entries with Enhanced Bar Chart 
            <div className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 relative z-0">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-primary/10 rounded-full p-2 mr-2">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-800">
                  Manual Entries
                </h2>
              </div>

              <div className="flex items-center gap-6">
              
                <div className="w-2/3 relative z-0">
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={[
                        { name: "Form A", count: 15 },
                        { name: "Form B", count: 9 },
                        { name: "Form C", count: 6 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                      />
                      <Tooltip 
                        formatter={(value, name) => [`${value} entries`, 'Count']}
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar 
                        dataKey="count" 
                        radius={[4, 4, 0, 0]}
                      >
                        {MANUAL_COLORS.map((color, index) => (
                          <Cell 
                            key={index} 
                            fill={color}
                            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <ul className="space-y-3 w-1/3">
                  {[
                    { name: "Form A", count: 15 },
                    { name: "Form B", count: 9 },
                    { name: "Form C", count: 6 },
                  ].map((entry, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/50 hover:bg-white/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-4 h-4 rounded-sm shadow-sm"
                          style={{ backgroundColor: MANUAL_COLORS[i] }}
                        ></span>
                        <span className="font-medium text-gray-700 text-sm">{entry.name}</span>
                      </div>
                      <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-bold text-gray-700">
                        {entry.count}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          */}
          </div>
        </div>
      </main>

      {/* Modals with proper z-index */}
      {showAdminsModal && (
        <ModalAdminUsers
          isOpen={showAdminsModal}
          onClose={() => setShowAdminsModal(false)}
          roleFilter={selectedAdminRole}
        />
      )}

      {showDepartmentsModal && (
        <ModalDepartments
          isOpen={showDepartmentsModal}
          onClose={() => setShowDepartmentsModal(false)}
          department={null}
        />
      )}

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