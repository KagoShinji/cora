import { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSettingsStore } from "../stores/useSettingsStore";
import { useAuthStore } from '../stores/userStores';
import { resetPasswordRequest } from "../api/api";
import { X, Mail, Info, Send } from "lucide-react";

const API_BASE_URL = process.env.API_BASE_URL;
const credentialsMap = {
  'superadmin@gmail.com': { password: "super123", role: "superadmin", path: "/superadmin" },
  'cosuperadmin@gmail.com': { password: "co123", role: "co-superadmin", path: "/cosuperadmin" },
  'admincreator@gmail.com': { password: "creator123", role: "admin-creator", path: "/admincreator" },
  'adminapprover@gmail.com': { password: "admin123", role: "admin-approver", path: "/adminapprover" },
};



function Login() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  
  const logoPath = useAppSettingsStore((state) => state.logo_path);
  const appName = useAppSettingsStore((state) => state.name);
  const primaryColor = useAppSettingsStore((s) => s.primary_color);
  const secondaryColor = useAppSettingsStore((s) => s.secondary_color);
  const getSettings = useAppSettingsStore((s) => s.getSettings);
  const navigate = useNavigate();
  const signin = useAuthStore((state) => state.signin);

  const handleLogin = async (e) => {
    e.preventDefault();
    const users = credentialsMap[email];

    if (users && users.password === password) {
      navigate(users.path);
      return;
    }

    const userData = { email, password };
    const login = await signin(userData);

    if (!login) {
      alert("Invalid credentials");
      return;
    } else {
      alert("Login successfully");
    }

    switch (login.user.role) {
      case 'superadmin':
        navigate('/superadmin');
        break;
      case 'co-superadmin':
        navigate('/cosuperadmin');
        break;
      case 'admincreator':
        navigate('/admincreator');
        break;
      case 'adminapprover':
        navigate('/adminapprover');
        break;
      case 'user':
        navigate('/users');
        break;
      default:
        alert('Unauthorized role or unknown user.');
    }
  };

  useEffect(() => {
    getSettings(); 
  }, [getSettings]);
  const handleForgotSubmit = async () => {
    if (!forgotEmail) {
      alert("Please enter your email.");
      return;
    }
    try {
      await resetPasswordRequest(forgotEmail);
      alert(`Password reset instructions sent to: ${forgotEmail}`);
      setForgotEmail("");
      setShowForgotModal(false);
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to send password reset email");
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background image + subtle glass overlay */}
      <div className="absolute inset-0">
        <img
          src="/bg-image.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-title"
          aria-describedby="forgot-desc"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

          {/* Modal card */}
          <div className="relative w-full max-w-lg mx-4 rounded-2xl bg-white shadow-2xl border border-gray-200 max-h-[calc(100vh-2rem)] overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-200">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-200">
                  <Mail className="h-5 w-5 text-gray-700" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h2 id="forgot-title" className="text-xl font-semibold text-gray-900">
                    Forgot Password
                  </h2>
                  <p
                    id="forgot-desc"
                    className="mt-1 flex items-center gap-1 text-sm text-gray-600"
                  >
                    <Info className="h-4 w-4 text-gray-400" aria-hidden="true" />
                    Enter your email to receive reset instructions.
                  </p>
                </div>
                <X
                  onClick={() => setShowForgotModal(false)}
                  role="button"
                  tabIndex={0}
                  aria-label="Close dialog"
                  className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700"
                  title="Close"
                />
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <label
                htmlFor="forgot-email"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="forgot-email"
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
              />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              {/* Send (primary) */}
              <button
                type="button"
                onClick={handleForgotSubmit}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl !bg-green-500 text-white text-sm font-semibold shadow-sm hover:shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                <Send className="h-4 w-4" />
                Send
              </button>
              {/* Cancel (danger) */}
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-medium text-white !bg-red-500 shadow-sm hover:shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Centered login card */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="bg-white/90 backdrop-blur-lg p-8 sm:p-10 rounded-2xl shadow-2xl max-w-md w-full text-black ring-1 ring-white/40">
          {/* School Logo / Branding */}
          <div className="mb-8 text-center">
            <img
              src={logoPath ? `${API_BASE_URL}${logoPath}` : "/school-logo.png"}
              alt="School Logo"
              className="w-28 h-28 sm:w-32 sm:h-32 mx-auto object-contain rounded-full border shadow-sm"
              style={{ borderColor: primaryColor || '#e5e7eb' }}
            />
            <h2
              style={{ color: primaryColor }}
              className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight"
            >
              {appName}
            </h2>
            <p
              style={{ color: secondaryColor }}
              className="text-sm sm:text-base mt-1"
            >
              Admin Portal
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-5 text-left">
            {/* Email */}
            <div>
              <label
                style={{ color: secondaryColor }}
                htmlFor="login-email"
                className="block text-sm font-medium mb-2"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                style={{ color: secondaryColor }}
                htmlFor="login-password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <div className="text-right mt-2">
                <p
                  onClick={() => setShowForgotModal(true)}
                  className="text-sm cursor-pointer hover:underline underline-offset-4"
                  style={{ color: secondaryColor }}
                >
                  Forgot Password?
                </p>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              style={{ backgroundColor: primaryColor }}
              className="w-full text-white py-3 rounded-xl font-semibold shadow-sm hover:shadow-md transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
