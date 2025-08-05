import { useState } from "react";

function ChangeNameModal({ isOpen, onClose, onSave }) {
  const [newName, setNewName] = useState("");

  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-primary">Change Name</h2>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter new name"
          className="w-full px-4 py-2 border rounded-md mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() => {
              setNewName("");
              onClose();
            }}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-primary rounded hover:bg-primary-dark"
            onClick={() => {
              if (newName.trim()) {
                onSave(newName.trim());
                setNewName("");
              }
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangeNameModal;