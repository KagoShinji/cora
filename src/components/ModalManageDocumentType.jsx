import { useState } from "react";

export default function ModalManageDocumentType({ isOpen, onClose }) {
  const [newType, setNewType] = useState("");
  const [types, setTypes] = useState([
    "Enrollment Process",
    "Tuition Fees",
    "Scholarships",
    "Academic Calendar",
    "Campus Facilities",
    "Others",
  ]);

  const handleAddType = () => {
    if (!newType.trim()) return;
    setTypes([...types, newType.trim()]);
    setNewType("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-xl border text-primary">
        <h2 className="text-xl font-bold mb-4 text-center">Manage Document Types</h2>

        {/* Type List */}
        <ul className="mb-4 max-h-40 overflow-y-auto space-y-1">
          {types.map((type, index) => (
            <li
              key={index}
              className="px-3 py-1 bg-gray-100 rounded text-sm border"
            >
              {type}
            </li>
          ))}
        </ul>

        {/* Add New Type */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            placeholder="New type"
            className="flex-1 border border-primary rounded-md px-3 py-2"
          />
          <button
            onClick={handleAddType}
            className="!bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Add
          </button>
        </div>

        {/* Close Button */}
        <div className="text-right">
          <button
            onClick={onClose}
            className="text-sm !bg-white !border-primary text-primary hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
