export default function ForgotPasswordModal({ isOpen, onClose, email, setEmail, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl border">
        <h2 className="text-2xl font-bold mb-4 text-primary text-center">Forgot Password</h2>

        <p className="text-sm text-gray-600 mb-4 text-center">
          Enter your email address and we’ll send you instructions to reset your password.
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full border border-primary rounded-md px-4 py-2 text-primary outline-none focus:ring-1 focus:ring-primary mb-4"
          required
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-primary border border-primary rounded-md hover:bg-primary/10 transition"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
