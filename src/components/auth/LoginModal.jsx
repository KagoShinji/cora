// src/components/auth/LoginModal.jsx
import Modal from "../Modal";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginModal({
  isOpen,
  onClose,
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  onForgotPassword,
  primaryColor,
}) {
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("Please enter both email and password.");
      return;
    }
    onSubmit(e);
  };

  return (
    <Modal
      // ❗ Use <span> so we don’t nest <h2> inside Modal’s own <h2>
      title={
        <span
          className="text-2xl font-bold"
          style={{ color: primaryColor }}
        >
          Welcome back
        </span>
      }
      onClose={onClose}
    >
      {/* Local X close icon (pure icon, no button semantics) */}
      <span
        onClick={onClose}
        className="select-none absolute right-4 top-4 text-neutral-500 hover:text-neutral-800 text-xl leading-none cursor-pointer"
        aria-hidden="true"
      >
        ×
      </span>

      <div className="px-1 pt-8">
        <p className="text-neutral-600 text-sm mb-8 leading-relaxed">
          Sign in to your account to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="login-email"
              className="block text-sm font-semibold text-neutral-800"
            >
              Email address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-neutral-400 group-focus-within:text-neutral-600 transition-colors" />
              </div>
              <input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                className="block w-full pl-12 pr-4 py-3.5 text-neutral-900 placeholder-neutral-400 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 focus:bg-white focus:border-transparent transition-all duration-200 hover:bg-white"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                autoComplete="email"
                required
                style={{
                  "--tw-ring-color": `${primaryColor}40`,
                  "--tw-ring-opacity": "0.4",
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="login-password"
              className="block text-sm font-semibold text-neutral-800"
            >
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-neutral-400 group-focus-within:text-neutral-600 transition-colors" />
              </div>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="block w-full pl-12 pr-12 py-3.5 text-neutral-900 placeholder-neutral-400 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 focus:bg-white focus:border-transparent transition-all duration-200 hover:bg-white"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                autoComplete="current-password"
                required
                style={{
                  "--tw-ring-color": `${primaryColor}40`,
                  "--tw-ring-opacity": "0.4",
                }}
              />
              {/* Eye icon as a clickable span (not a <button>) */}
              <span
                onClick={() => setShowPassword((v) => !v)}
                role="switch"
                aria-checked={showPassword}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={0}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600 cursor-pointer focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setShowPassword((v) => !v);
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {/* Forgot Password clickable text (not a <button>) */}
          <div className="flex justify-end">
            <span
              onClick={onForgotPassword}
              role="link"
              tabIndex={0}
              className="text-sm font-medium hover:underline cursor-pointer focus:outline-none focus:underline transition-all"
              style={{ color: primaryColor }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onForgotPassword?.();
              }}
            >
              Forgot your password?
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full relative overflow-hidden rounded-xl px-6 py-3.5 text-white font-semibold shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
            style={{
              backgroundColor: primaryColor,
              "--tw-ring-color": `${primaryColor}40`,
            }}
          >
            <span className="relative z-10">Sign in</span>
            <div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000"
            />
          </button>
        </form>
      </div>
    </Modal>
  );
}
