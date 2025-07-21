import React, { useState } from "react";

export default function ModalAddAdmins({ isOpen, onClose, onSave }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ username, email, password, department, role });
    onClose();
    setUsername("");
    setEmail("");
    setPassword("");
    setDepartment("");
    setRole("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="!bg-white rounded-xl w-full max-w-md p-6 shadow-2xl border">
        <h2 className="text-2xl font-bold mb-4 !text-primary text-center">Add Admin</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 !text-primary">
          <div>
            <label className="block mb-1 font-medium">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full !border !border-primary !rounded-md !px-4 !py-2 !text-primary !outline-none focus:!ring-1 focus:!ring-primary"
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
              className="w-full !border !border-primary !rounded-md !px-4 !py-2 !text-primary !outline-none focus:!ring-1 focus:!ring-primary"
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
              className="w-full !border !border-primary !rounded-md !px-4 !py-2 !text-primary !outline-none focus:!ring-1 focus:!ring-primary"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full !border !border-primary !rounded-md !px-4 !py-2 !text-primary !outline-none focus:!ring-1 focus:!ring-primary"
              required
            >
              <option value="">Select Role</option>
              <option value="creator">Creator</option>
              <option value="approver">Approver</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full !border !border-primary !rounded-md !px-4 !py-2 !text-primary !outline-none focus:!ring-1 focus:!ring-red-700"
              required
            >
              <option value="">Select Department</option>
              <option value="cs">Information Technology</option>
              <option value="ba">Business Administration</option>
              <option value="ed">Education</option>
              <option value="eng">Engineering</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="!px-4 !py-2 !bg-white !text-primary !border !border-primary !rounded-md hover:!bg-red-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="!px-4 !py-2 !bg-primary !text-white !rounded-md hover:!bg-primary transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
