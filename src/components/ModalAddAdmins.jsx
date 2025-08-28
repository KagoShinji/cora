import React, { useState,useEffect } from "react";
import ModalAddDepartment from "./ModalAddDepartment";
import { useAuthStore } from "../stores/userStores";

export default function ModalAddAdmins({ isOpen, onClose, onSave }) {
  const [firstName, setFirstName] = useState("");
  const [lastName,setLastName] = useState("")
  const [middleInitial,setMiddleInitial] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const departments = useAuthStore((state) => state.departments)
  const getDepartment = useAuthStore((state) => state.getDepartment)

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const userData = {
      name: `${firstName} ${lastName} ${middleInitial}`,
      email,
      password,
      role,
      department_id:department,
    };

    try {
      await onSave(userData);
      setFirstName("");
      setLastName("");
      setMiddleInitial("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRole("");
      setDepartment("");
      onClose();
    } catch (err) {
      console.error("Form submission failed in ModalAddAdmins:", err);
    }
  };

  useEffect(() => {
    getDepartment();
  }, []);

  const handleNewDepartment = async (newDept) => {
    await getDepartment();    
    setDepartment(newDept);  
    setIsDeptModalOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
        <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl border">
          <h2 className="text-2xl font-bold mb-4 text-primary text-center">Add Admin</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-primary">
            {/* Firstname */}
            <div>
              <label className="block mb-1 font-medium">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Firstname"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border border-primary rounded-md px-4 py-2 text-primary outline-none focus:ring-1 focus:!ring-primary"
                required
              />
            </div>

            {/* Lastname */}
            <div>
              <label className="block mb-1 font-medium">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Lastname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border border-primary rounded-md px-4 py-2 text-primary outline-none focus:ring-1 focus:!ring-primary"
                required
              />
            </div>

            {/* Middle Initial */}
            <div>
              <label className="block mb-1 font-medium">
                Middle Initial <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Middle Initial"
                value={middleInitial}
                onChange={(e) => setMiddleInitial(e.target.value)}
                className="w-full border border-primary rounded-md px-4 py-2 text-primary outline-none focus:ring-1 focus:!ring-primary"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-primary rounded-md px-4 py-2 text-primary outline-none focus:ring-1 focus:!ring-primary"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 font-medium">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-primary rounded-md px-4 py-2 text-primary outline-none focus:ring-1 focus:!ring-primary"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-1 font-medium">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-primary rounded-md px-4 py-2 text-primary outline-none focus:ring-1 focus:!ring-primary"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="block mb-1 font-medium">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-primary rounded-md px-4 py-2 text-primary outline-none focus:ring-1 focus:!ring-primary"
                required
              >
                <option value="">Select Role</option>
                <option value="admincreator">Creator</option>
                <option value="adminapprover">Approver</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block mb-1 font-medium">
                Department <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full border border-primary rounded-md px-4 py-2 text-primary outline-none focus:ring-1 focus:!ring-primary"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept)=>(
                    <option key={dept.id} value={dept.id}>
                      {dept.department_name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsDeptModalOpen(true)}
                  className="px-2 py-1 text-sl !bg-white border !border-primary rounded text-primary hover:!bg-primary hover:!text-white transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setFirstName("");
                  setLastName("");
                  setMiddleInitial("");
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                  setRole("");
                  setDepartment("");
                  onClose();
                }}
                className="px-4 py-2 !bg-white text-primary border !border-primary rounded-md hover:!bg-red-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 !bg-primary text-white rounded-md hover:!bg-primary transition"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>

      <ModalAddDepartment
        isOpen={isDeptModalOpen}
        onClose={() => setIsDeptModalOpen(false)}
        onSave={handleNewDepartment}
      />
    </>
  );
}
