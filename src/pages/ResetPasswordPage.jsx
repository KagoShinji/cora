import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { changePassword } from "../api/api";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // don't decode yet
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Redirect if token is missing
  useEffect(() => {
    if (!token) {
      alert("Invalid or missing reset token.");
      navigate("/", { replace: true }); // back to landing page
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

  // Do not render form if no token
  if (!token) return null;

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-lg mx-4 sm:mx-0">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Reset Your Password</h2>
        
        {message && <p className="text-green-600 mb-4 text-center">{message}</p>}
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        {!message && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full !bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-500 transition-colors"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
