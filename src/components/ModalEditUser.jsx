import { useEffect, useState } from "react";

export default function ModalEditUser({ isOpen, onClose, onSave, user }) {
  if (!isOpen || !user) return null;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [school, setSchool] = useState("");
  const [wantsPasswordChange, setWantsPasswordChange] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    setUsername(user.name || "");
    setEmail(user.email || "");
    setRole((user.role || "").toLowerCase());
    setSchool(user.school || "");
    setWantsPasswordChange(false);
    setPassword("");
    setConfirmPassword("");
    setLocalError("");
  }, [user, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (wantsPasswordChange) {
      if (!password || !confirmPassword) {
        setLocalError("Please enter and confirm the new password.");
        return;
      }
      if (password !== confirmPassword) {
        setLocalError("Passwords do not match.");
        return;
      }
    }

    const data = {
      name: username,
      email,
      role,
      ...(role === "co-superadmin" && { school }),
      ...(wantsPasswordChange && { password }),
    };

    try {
      await onSave(user.id, data);
    } catch (err) {
      setLocalError(err?.message || "Failed to update user.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="!bg-white rounded-xl w-full max-w-md p-6 shadow-2xl border">
        <h2 className="text-2xl font-bold mb-4 !text-primary text-center">
          Edit User
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 !text-primary">
          <div>
            <label className="block mb-1 font-medium">
              Username <span className="text-red-600">*</span>
            </label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Enter username"
              value={username}
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

          {/* Show school input only when Co-Super Admin is selected */}
          {role === "co-superadmin" && (
            <div>
              <label className="block mb-1 font-medium">
                School <span className="text-red-600">*</span>
              </label>
              <input
                onChange={(e) => setSchool(e.target.value)}
                type="text"
                placeholder="Enter school"
                value={school}
                className="w-full !border !border-primary !rounded-md !px-4 !py-2 !text-primary !outline-none focus:!ring-1 focus:!ring-primary"
                required
              />
            </div>
          )}

          {/* Optional password change */}
          <div className="flex items-center gap-2">
            <input
              id="toggle-pw"
              type="checkbox"
              checked={wantsPasswordChange}
              onChange={(e) => setWantsPasswordChange(e.target.checked)}
              className="h-4 w-4 !text-primary !border-primary !rounded"
            />
            <label htmlFor="toggle-pw" className="font-medium">Change password</label>
          </div>

          {wantsPasswordChange && (
            <>
              <div>
                <label className="block mb-1 font-medium">
                  New Password <span className="text-red-600">*</span>
                </label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  className="w-full !border !border-primary !rounded-md !px-4 !py-2 !text-primary !outline-none focus:!ring-1 focus:!ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  Confirm New Password <span className="text-red-600">*</span>
                </label>
                <input
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  className="w-full !border !border-primary !rounded-md !px-4 !py-2 !text-primary !outline-none focus:!ring-1 focus:!ring-primary"
                  required
                />
              </div>
            </>
          )}

          {localError && (
            <p className="text-red-600 bg-red-100 border border-red-400 rounded p-2 text-sm text-center">
              {localError}
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
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
