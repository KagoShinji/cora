// src/components/Modal.jsx
export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-bold mb-4 text-red-800">{title}</h2>
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-500 text-lg hover:text-red-600"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
