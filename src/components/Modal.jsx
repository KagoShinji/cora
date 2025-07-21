// src/components/Modal.jsx
export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-bold mb-4 text-primary">{title}</h2>
        <button
          onClick={onClose}
          className="absolute top-2 right-4 !bg-primary text-white text-lg hover:text-primary"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
