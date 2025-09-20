// src/components/auth/UserForgotPasswordModal.jsx
import Modal from "./Modal"; // adjust path if needed
import { useState, useCallback } from "react";
import { Mail } from "lucide-react";
import { resetPasswordRequest } from "../api/api";

export default function UserForgotPasswordModal({ onClose, primaryColor = "#2563eb" }) {
  const [email, setEmail] = useState("");

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }
    try {
      await resetPasswordRequest(email);
      alert(`Password reset instructions sent to: ${email}`);
      setEmail("");
      onClose?.();
    } catch (error) {
      console.error(error);
      alert(error?.message || "Failed to send password reset email");
    }
  }, [email, onClose]);

  return (
    <Modal
      title={
        <h2 className="text-2xl font-bold" style={{ color: primaryColor }}>
          Forgot password
        </h2>
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
          Enter your registered email address and we’ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field (mirrors LoginModal) */}
          <div className="space-y-2">
            <label htmlFor="forgot-email" className="block text-sm font-semibold text-neutral-800">
              Email address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-neutral-400 group-focus-within:text-neutral-600 transition-colors" />
              </div>
              <input
                id="forgot-email"
                type="email"
                placeholder="you@example.com"
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

          {/* Actions */}
          <div className="flex items-center justify-between">
            <span
              onClick={onClose}
              role="link"
              tabIndex={0}
              className="text-sm font-medium hover:underline cursor-pointer focus:outline-none focus:underline transition-all"
              style={{ color: primaryColor }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onClose?.();
              }}
            >
              Back to Login
            </span>

            <button
              type="submit"
              className="relative overflow-hidden rounded-xl px-6 py-3.5 text-white font-semibold shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
              style={{
                backgroundColor: primaryColor,
                "--tw-ring-color": `${primaryColor}40`,
              }}
            >
              <span className="relative z-10">Send reset link</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
