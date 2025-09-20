import { useEffect, useState } from "react";
import { X, Eye, EyeOff, Save, User, Info } from "lucide-react";

/**
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - onSave: (id, data) => Promise<void> | void
 * - user: { id, name, email, role, school }
 */
export default function ModalEditUser({ isOpen, onClose, onSave, user }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [school, setSchool] = useState("");
  const [wantsPasswordChange, setWantsPasswordChange] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form when opened
  useEffect(() => {
    if (!isOpen || !user) return;
    setUsername(user.name || "");
    setEmail(user.email || "");
    setRole((user.role || "").toLowerCase());
    setSchool(user.school || "");
    setWantsPasswordChange(false);
    setPassword("");
    setConfirmPassword("");
    setLocalError("");
  }, [isOpen, user]);

  // Handle Escape key and body overflow
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (wantsPasswordChange) {
      if (!password.trim() || !confirmPassword.trim()) {
        setLocalError("Please enter and confirm the new password.");
        return;
      }
      if (password !== confirmPassword) {
        setLocalError("Passwords do not match.");
        return;
      }
    }

    const data = {
      name: username.trim(),
      email: email.trim(),
      role,
      ...(role === "co-superadmin" && { school: school.trim() }),
      ...(wantsPasswordChange && { password }),
    };

    try {
      setIsSaving(true);
      await onSave(user.id, data);
      onClose();
    } catch (err) {
      setLocalError(err?.message || "Failed to update user.");
      console.error("ModalEditUser onSave error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-user-title"
      aria-describedby="edit-user-desc"
      onMouseDown={handleBackdrop}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg mx-4 rounded-2xl bg-white shadow-2xl border border-gray-200 max-h-[calc(100vh-2rem)] overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header (matches Department modal) */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-200">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-200">
              <User className="h-5 w-5 text-gray-700" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h2
                id="edit-user-title"
                className="text-xl font-semibold text-gray-900"
              >
                Edit User
              </h2>
              <p
                id="edit-user-desc"
                className="mt-1 flex items-center gap-1 text-sm text-gray-600"
              >
                <Info className="h-4 w-4" aria-hidden="true" />
                Update user details and save your changes.
              </p>
            </div>
            <X
              onClick={onClose}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onClose();
              }}
              role="button"
              tabIndex={0}
              aria-label="Close dialog"
              className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700"
              title="Close"
            />
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
              />
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white shadow-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
              >
                <option value="">Select Role</option>
                <option value="superadmin">Super Admin</option>
                <option value="co-superadmin">Co-Super Admin</option>
              </select>
            </div>

            {/* Toggle Password Change */}
            <div className="flex items-center gap-2">
              <input
                id="toggle-pw"
                type="checkbox"
                checked={wantsPasswordChange}
                onChange={(e) => setWantsPasswordChange(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="toggle-pw" className="text-gray-700 font-medium">
                Change password
              </label>
            </div>

            {/* Password Fields */}
            {wantsPasswordChange && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* New Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-800 mb-2"
                  >
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </span>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-800 mb-2"
                  >
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
                    />
                    <span
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
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
                className="px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-medium text-white !bg-red-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl !bg-green-500 text-white text-sm font-semibold shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
