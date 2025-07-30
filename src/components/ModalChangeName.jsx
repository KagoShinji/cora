import { useEffect, useState } from "react";

/**
 * Props:
 * - isOpen: boolean
 * - currentName?: string
 * - onClose: () => void
 * - onSave: (newName: string) => Promise<void> | void
 */
export default function ModalChangeName({ isOpen, currentName = "", onClose, onSave }) {
  const [name, setName] = useState(currentName);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(currentName || "");
      setLocalError("");
    }
  }, [isOpen, currentName]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    const trimmed = name.trim();
    if (!trimmed) {
      setLocalError("Name is required.");
      return;
    }

    try {
      await onSave(trimmed);
    } catch (err) {
      setLocalError(err?.message || "Failed to save name.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl border">
        <h2 className="text-2xl font-bold mb-4 text-primary text-center">Change Name</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-primary">
          <div>
            <label className="block mb-1 font-medium">
              System Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter system name"
              required
              className="w-full border border-primary rounded-md px-4 py-2 text-primary outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {localError && (
            <p className="text-red-600 bg-red-100 border border-red-400 rounded p-2 text-sm text-center">
              {localError}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white text-primary border border-primary rounded-md hover:bg-primary/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
