import { useState } from "react";

export default function ModalAddUser({ isOpen, onClose, onSave, isLoading, error }) {
  if (!isOpen) return null;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [school, setSchool] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    const userData = {
      name: `${firstName} ${lastName}`,
      email,
      password,
      role,
      ...(role === "co-superadmin" && { school }),
    };

    try {
      await onSave(userData);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRole("");
      setSchool("");
      setLocalError("");
      onClose();
    } catch (err) {
      console.error("Form submission failed in ModalAddUser:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="!bg-white rounded-xl w-full max-w-md p-6 shadow-2xl border">
        <h2 className="text-2xl font-bold mb-4 !text-primary text-center">
          Add New Admin
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 !text-primary">
          <div>
            <label className="block mb-1 font-medium">
              First Name <span className="text-red-600">*</span>
            </label>
            <input
              onChange={(e) => setFirstName(e.target.value)}
              type="text"
              placeholder="Enter First Name"
              value={firstName}
              className="w-full !border !border-primary !rounded-md !px-4 !py-2 !text-primary !outline-none focus:!ring-1 focus:!ring-primary"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Last Name <span className="text-red-600">*</span>
            </label>
            <input
              onChange={(e) => setLastName(e.target.value)}
              type="text"
              placeholder="Enter Last Name"
              value={lastName}
              className="w-full !border !border-primary !rounded-md !px-4 !py-2 !text-primary !outline-none focus:!ring-1 focus:!ring-primary"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter email"
              value={email}
              className="w-full !border !border-primary !rounded-md !px-4 !py-2 !text-primary !outline-none focus:!ring-1 focus:!ring-primary"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Password <span className="text-red-600">*</span>
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter password"
              value={password}
              className="w-full !border !border-primary !rounded-md !px-4 !py-2 !text-primary !outline-none focus:!ring-1 focus:!ring-primary"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Confirm Password <span className="text-red-600">*</span>
            </label>
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              className="w-full !border !border-primary !rounded-md !px-4 !py-2 !text-primary !outline-none focus:!ring-1 focus:!ring-primary"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Role <span className="text-red-600">*</span>
            </label>
            <select
              className="w-full !border !border-primary !rounded-md !px-4 !py-2 !text-primary !outline-none focus:!ring-1 focus:!ring-primary"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select Role</option>
              <option value="superadmin">Super Admin</option>
              <option value="co-superadmin">Co-Super Admin</option>
            </select>
          </div>

          {(localError || error) && (
            <p className="text-red-600 bg-red-100 border border-red-400 rounded p-2 text-sm text-center">
              {localError || error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="!px-4 !py-2 !bg-white !text-primary !border !border-primary !rounded-md hover:!bg-primary/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="!px-4 !py-2 !bg-primary !text-white !rounded-md hover:!bg-primary/90 transition"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}