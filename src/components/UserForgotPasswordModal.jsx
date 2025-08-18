import Modal from "./Modal"; // adjust path if your Modal component is elsewhere
import { useState } from "react";

export default function UserForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add API call for user password reset
    console.log("Reset link sent to:", email);
    onClose(); // close after submit
  };

  return (
    <Modal title="Forgot Password" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-sm text-gray-600">
          Enter your registered email address and we'll send you a link to reset your password.
        </p>

        <div className="flex flex-col gap-1">
          <label htmlFor="forgot-email" className="text-sm font-medium text-primary">
            Email Address
          </label>
          <input
            id="forgot-email"
            type="email"
            className="border rounded p-2"
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <button
          type="submit"
          className="!bg-primary text-white py-2 rounded"
        >
          Send Reset Link
        </button>

        <p
          onClick={onClose}
          className="text-sm text-gray-500 cursor-pointer hover:underline w-fit"
        >
          Back to Login
        </p>
      </form>
    </Modal>
  );
}
