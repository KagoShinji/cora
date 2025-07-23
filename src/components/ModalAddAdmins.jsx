import React, { useState } from "react";
import ModalAddDepartment from "./ModalAddDepartment";

export default function ModalAddAdmins({ isOpen, onClose, onSave }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // ✅ New state
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const userData = {
      name: username,
      email,
      password,
      role,
      department,
    };

    try {
      await onSave(userData);
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword(""); // ✅ Reset field
      setRole("");
      setDepartment("");
      onClose();
    } catch (err) {
      console.error("Form submission failed in ModalAddAdmins:", err);
    }
  };

  const handleNewDepartment = (newDept) => {
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
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                placeholder="Enter username"
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
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-primary rounded-md px-4 py-2 text-primary outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            {/* ✅ Confirm Password Field */}
            <div>
              <label className="block mb-1 font-medium">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full border border-primary rounded-md px-4 py-2 text-primary outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select Department</option>
                  <option value="IT">Information Technology</option>
                  <option value="BA">Business Administration</option>
                  <option value="Education">Education</option>
                  <option value="Engineering">Engineering</option>
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

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setUsername("");
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                  setRole("");
                  setDepartment("");
                  onClose();
                }}
                className="px-4 py-2 !bg-white text-primary border !border-primary rounded-md hover:bg-red-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 !bg-primary text-white rounded-md hover:bg-primary transition"
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
