// src/components/auth/RegisterModal.jsx
import Modal from "../Modal";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function RegisterModal({
  isOpen,
  onClose,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  middleInitial,
  setMiddleInitial,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  onSubmit,
  primaryColor, // theming
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    onSubmit(e);
  };

  return (
    <Modal
      // Use <span> to avoid nesting <h2> in Modal (prevents hydration error)
      title={
        <span className="text-2xl font-bold" style={{ color: primaryColor }}>
          Create an account
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

      <form onSubmit={handleSubmit} className="px-1 pt-8 space-y-6">
        {/* Grid wrapper: 2 columns on md+, 1 column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {/* First Name */}
          <div className="space-y-2">
            <label htmlFor="register-first-name" className="block text-sm font-semibold text-neutral-800">
              First Name <span className="text-red-600">*</span>
            </label>
            <input
              id="register-first-name"
              type="text"
              placeholder="Enter First Name"
              className="block w-full px-4 py-3.5 text-neutral-900 placeholder-neutral-400 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 focus:bg-white focus:border-transparent transition-all duration-200 hover:bg-white"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="given-name"
              style={{ "--tw-ring-color": `${primaryColor}40`, "--tw-ring-opacity": "0.4" }}
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label htmlFor="register-last-name" className="block text-sm font-semibold text-neutral-800">
              Last Name <span className="text-red-600">*</span>
            </label>
            <input
              id="register-last-name"
              type="text"
              placeholder="Enter Last Name"
              className="block w-full px-4 py-3.5 text-neutral-900 placeholder-neutral-400 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 focus:bg-white focus:border-transparent transition-all duration-200 hover:bg-white"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="family-name"
              style={{ "--tw-ring-color": `${primaryColor}40`, "--tw-ring-opacity": "0.4" }}
            />
          </div>

          {/* Middle Initial */}
          <div className="space-y-2">
            <label htmlFor="register-middle-initial" className="block text-sm font-semibold text-neutral-800">
              Middle Initial
            </label>
            <input
              id="register-middle-initial"
              type="text"
              placeholder="Enter Middle Initial"
              className="block w-full px-4 py-3.5 text-neutral-900 placeholder-neutral-400 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 focus:bg-white focus:border-transparent transition-all duration-200 hover:bg-white"
              value={middleInitial}
              onChange={(e) => setMiddleInitial(e.target.value)}
              maxLength={1}
              autoComplete="additional-name"
              style={{ "--tw-ring-color": `${primaryColor}40`, "--tw-ring-opacity": "0.4" }}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="register-email" className="block text-sm font-semibold text-neutral-800">
              Email <span className="text-red-600">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-neutral-400 group-focus-within:text-neutral-600 transition-colors" />
              </div>
              <input
                id="register-email"
                type="email"
                placeholder="Enter Email Address"
                className="block w-full pl-12 pr-4 py-3.5 text-neutral-900 placeholder-neutral-400 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 focus:bg-white focus:border-transparent transition-all duration-200 hover:bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                style={{ "--tw-ring-color": `${primaryColor}40`, "--tw-ring-opacity": "0.4" }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="register-password" className="block text-sm font-semibold text-neutral-800">
              Password <span className="text-red-600">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-neutral-400 group-focus-within:text-neutral-600 transition-colors" />
              </div>
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="block w-full pl-12 pr-12 py-3.5 text-neutral-900 placeholder-neutral-400 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 focus:bg-white focus:border-transparent transition-all duration-200 hover:bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                style={{ "--tw-ring-color": `${primaryColor}40`, "--tw-ring-opacity": "0.4" }}
              />
              {/* Eye icon (span, not a button) */}
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

          {/* Confirm Password */}
          <div className="space-y-2">
            <label htmlFor="register-confirm-password" className="block text-sm font-semibold text-neutral-800">
              Confirm Password <span className="text-red-600">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-neutral-400 group-focus-within:text-neutral-600 transition-colors" />
              </div>
              <input
                id="register-confirm-password"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                className="block w-full pl-12 pr-12 py-3.5 text-neutral-900 placeholder-neutral-400 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 focus:bg-white focus:border-transparent transition-all duration-200 hover:bg-white"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                style={{ "--tw-ring-color": `${primaryColor}40`, "--tw-ring-opacity": "0.4" }}
              />
              {/* Eye icon (span, not a button) */}
              <span
                onClick={() => setShowConfirm((v) => !v)}
                role="switch"
                aria-checked={showConfirm}
                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                tabIndex={0}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600 cursor-pointer focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setShowConfirm((v) => !v);
                }}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full relative overflow-hidden rounded-xl px-6 py-3.5 text-white font-semibold shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
          style={{ backgroundColor: primaryColor, "--tw-ring-color": `${primaryColor}40` }}
        >
          <span className="relative z-10">Register</span>
          {/* Shimmer (works without group wrapper) */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000" />
        </button>
      </form>
    </Modal>
  );
}
