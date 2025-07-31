import React, { useEffect, useState } from "react";
import ModalAddDepartment from "./ModalAddDepartment";
import { useAuthStore } from "../stores/userStores";

export default function ModalEditAdmins({ isOpen, onClose, onSave, user }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [localError, setLocalError] = useState("");

  const departments = useAuthStore((state) => state.departments);
  const getDepartment = useAuthStore((state) => state.getDepartment);

  useEffect(() => {
    if (!isOpen || !user) return;
    setUsername(user.name || "");
    setEmail(user.email || "");
    setRole((user.role || "").toLowerCase());
    setDepartmentId(user.department_id ? String(user.department_id) : "");
    setLocalError("");
  }, [isOpen, user]);

  useEffect(() => {
    if (!isOpen) return;
    getDepartment();
  }, [isOpen, getDepartment]);

  const handleNewDepartment = async (newDept) => {
    await getDepartment();
    const matchedDept = departments.find((dept) => dept.department_name === newDept);
    if (matchedDept) {
      setDepartmentId(String(matchedDept.id));
    }
    setIsDeptModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!user?.id) {
      setLocalError("Invalid user.");
      return;
    }

    const data = {
      name: username,
      email,
      role,
      department_id: departmentId ? parseInt(departmentId) : null,
    };

    try {
      await onSave(user.id, data);
      onClose();
    } catch (err) {
      setLocalError(err?.message || "Failed to update admin.");
      console.error("ModalEditAdmins onSave error:", err);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
        <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl border">
          <h2 className="text-2xl font-bold mb-4 text-primary text-center">Edit Admin</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-primary">
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                placeholder="Enter name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-primary rounded-md px-4 py-2 text-primary outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-primary rounded-md px-4 py-2 text-primary outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-primary rounded-md px-4 py-2 text-primary outline-none focus:ring-1 focus:ring-primary"
                required
              >
                <option value="">Select Role</option>
                <option value="admincreator">Creator</option>
                <option value="adminapprover">Approver</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Department</label>
              <div className="flex items-center gap-2">
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full border border-primary rounded-md px-4 py-2 text-primary outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.department_name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsDeptModalOpen(true)}
                  className="px-2 py-1 text-sl !bg-white border !border-primary rounded text-primary hover:bg-primary hover:text-white transition"
                >
                  +
                </button>
              </div>
            </div>

            {localError && (
              <p className="text-red-600 bg-red-100 border border-red-400 rounded p-2 text-sm text-center">
                {localError}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 !bg-white text-primary border !border-primary rounded-md hover:bg-primary/10 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 !bg-primary text-white rounded-md hover:bg-primary transition"
              >
                Save Changes
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
