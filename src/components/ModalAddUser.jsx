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
  const [position, setPosition] = useState(""); // ✅ Position field
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!position || !firstName || !lastName || !email || !password || !confirmPassword || !role) {
      setLocalError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    const userData = {
      name: `${firstName} ${lastName}`,
      email,
      password,
      role,
      position, // ✅ Include position in submission
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
      setPosition(""); // ✅ Reset position
      setLocalError("");
      onClose();
    } catch (err) {
      console.error("Form submission failed in ModalAddUser:", err);
      setLocalError("Failed to save user. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
  <div className="!bg-white rounded-xl w-full max-w-md p-6 shadow-2xl border
                  max-h-[calc(100vh-2rem)] overflow-y-auto">
    <h2 className="text-2xl font-bold mb-4 !text-primary text-center">
      Add New Admin
    </h2>

    <form onSubmit={handleSubmit} className="flex flex-col gap-4 !text-primary">
          {/* First Name */}
          <div>
            <label className="block mb-1 font-medium">
              First Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full !border !border-primary !rounded-md !px-4 !py-2 !text-primary !outline-none focus:!ring-1 focus:!ring-primary"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block mb-1 font-medium">
              Last Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full !border !border-primary !rounded-md !px-4 !py-2 !text-primary !outline-none focus:!ring-1 focus:!ring-primary"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full !border !border-primary !rounded-md !px-4 !py-2 !text-primary !outline-none focus:!ring-1 focus:!ring-primary"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium">
              Password <span className="text-red-600">*</span>
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full !border !border-primary !rounded-md !px-4 !py-2 !text-primary !outline-none focus:!ring-1 focus:!ring-primary"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 font-medium">
              Confirm Password <span className="text-red-600">*</span>
            </label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full !border !border-primary !rounded-md !px-4 !py-2 !text-primary !outline-none focus:!ring-1 focus:!ring-primary"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block mb-1 font-medium">
              Role <span className="text-red-600">*</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full !border !border-primary !rounded-md !px-4 !py-2 !text-primary !outline-none focus:!ring-1 focus:!ring-primary"
              required
            >
              <option value="">Select Role</option>
              <option value="superadmin">Super Admin</option>
              <option value="co-superadmin">Co-Super Admin</option>
            </select>
          </div>

          {/* Position */}
          <div>
            <label className="block mb-1 font-medium">
              Position <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full !border !border-primary !rounded-md !px-4 !py-2 !text-primary !outline-none focus:!ring-1 focus:!ring-primary"
              required
            />
          </div>

          {/* School (conditionally for Co-Super Admin) */}
          {role === "co-superadmin" && (
            <div>
              <label className="block mb-1 font-medium">
                School <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter school"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full !border !border-primary !rounded-md !px-4 !py-2 !text-primary !outline-none focus:!ring-1 focus:!ring-primary"
                required
              />
            </div>
          )}

          {/* Errors */}
          {(localError || error) && (
            <p className="text-red-600 bg-red-100 border border-red-400 rounded p-2 text-sm text-center">
              {localError || error}
            </p>
          )}

          {/* Buttons */}
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
