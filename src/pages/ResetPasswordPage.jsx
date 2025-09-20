import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { changePassword } from "../api/api";
import { Info, Save } from "lucide-react"; // ✅ make sure to install/import

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

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
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-lg mx-4 sm:mx-0">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Reset Your Password
        </h2>

        {message && <p className="text-green-600 mb-4 text-center">{message}</p>}
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

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
  );
}
