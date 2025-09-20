// src/components/Modal.jsx
export default function Modal({ title, onClose, children, hideClose }) {
  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-bold mb-4 text-primary">{title}</h2>

        {/* Close icon, optional */}
        {!hideClose && (
          <span
            onClick={onClose}
            className="absolute top-3 right-4 text-neutral-500 hover:text-neutral-800 text-2xl leading-none cursor-pointer"
            aria-hidden="true"
          >
            ×
          </span>
        )}

        {children}
      </div>
    </div>
  );
}
