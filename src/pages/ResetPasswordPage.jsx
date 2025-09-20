import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { changePassword } from "../api/api";
import { Lock, Save, Info } from "lucide-react";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = decodeURIComponent(searchParams.get("token"));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await changePassword({ token, password });
      setMessage(res.message);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100 px-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-200">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-200">
              <Lock className="h-5 w-5 text-gray-700" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">
                Reset Password
              </h2>
              <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                <Info className="h-4 w-4 text-gray-400" aria-hidden="true" />
                Enter your new password below.
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {message && (
            <p className="text-green-600 mb-4 text-sm font-medium">{message}</p>
          )}
          {error && (
            <p className="text-red-600 mb-4 text-sm font-medium">{error}</p>
          )}

          {!message && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-gray-800 mb-2"
                >
                  New Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-800 mb-2"
                >
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl !bg-green-500 text-white text-sm font-semibold shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
