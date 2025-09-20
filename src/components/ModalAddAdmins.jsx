import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff, Save, UserPlus } from "lucide-react";
import ModalAddDepartment from "./ModalAddDepartment";
import { useAuthStore } from "../stores/userStores";

export default function ModalAddAdmins({ isOpen, onClose, onSave }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [localError, setLocalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const departments = useAuthStore((state) => state.departments);
  const getDepartment = useAuthStore((state) => state.getDepartment);

  useEffect(() => {
    getDepartment();
  }, [getDepartment]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !firstName ||
      !lastName ||
      !middleInitial ||
      !email ||
      !password ||
      !confirmPassword ||
      !role ||
      !department
    ) {
      setLocalError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    const userData = {
      name: `${firstName} ${lastName} ${middleInitial}`,
      email,
      password,
      role,
      department_id: department,
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
      setLocalError("");
      onClose();
    } catch (err) {
      console.error("Form submission failed in ModalAddAdmins:", err);
      setLocalError("Failed to save user. Please try again.");
    }
  };

  const handleNewDepartment = async (newDept) => {
    await getDepartment();
    setDepartment(newDept);
    setIsDeptModalOpen(false);
  };

  if (!isOpen) return null;

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-admin-title"
        aria-describedby="add-admin-desc"
        onMouseDown={handleBackdrop}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

        {/* Modal */}
        <div
          className="relative bg-white rounded-2xl w-full max-w-lg mx-4 shadow-2xl border border-gray-200 max-h-[calc(100vh-2rem)] overflow-hidden"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header (updated icon) */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-200 flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-200">
              <UserPlus className="h-5 w-5 text-gray-700" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h2 id="add-admin-title" className="text-xl font-semibold text-gray-900">
                Add Admin
              </h2>
              <p id="add-admin-desc" className="mt-1 text-sm text-gray-600">
                Fill in the form below to create a new administrator.
              </p>
            </div>
            <X
              onClick={onClose}
              role="button"
              tabIndex={0}
              aria-label="Close dialog"
              className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700"
              title="Close"
            />
          </div>

          {/* Form */}
          <div className="p-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* First & Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
                    required
                  />
                </div>
              </div>

              {/* Middle Initial */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Middle Initial <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="M.I."
                  value={middleInitial}
                  onChange={(e) => setMiddleInitial(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
                  required
                />
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
                      required
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
                      required
                    />
                    <span
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </span>
                  </div>
                </div>
              </div>

              {/* Role & Department */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white shadow-sm outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="admincreator">Creator</option>
                    <option value="adminapprover">Approver</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white shadow-sm outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.department_name}
                        </option>
                      ))}
                    </select>
                    <div
                      onClick={() => setIsDeptModalOpen(true)}
                      role="button"
                      tabIndex={0}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-xl text-gray-800 bg-white shadow-sm hover:bg-gray-50 cursor-pointer"
                      title="Add Department"
                    >
                      +
                    </div>
                  </div>
                </div>
              </div>

              {localError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
                  {localError}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 !bg-red-500 text-sm font-medium text-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl !bg-green-500 text-white text-sm font-semibold shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  Save Admin
                </button>
              </div>
            </form>
          </div>
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