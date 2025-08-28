import { useState } from "react";
import { createDocumentInfo } from "../api/api";

export default function ModalManageDocumentType({ isOpen, onClose }) {
  const [newType, setNewType] = useState("");

  const handleAddType = async () => {
    if (!newType.trim()) return;
    try {
      const payload = {name:newType}
      const response = await createDocumentInfo(payload)
      if(response){
        alert("Created successfully")
        onClose();
      }
      
    } catch (error) {
      console.error("Error adding document type:", error);
      alert(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-xl border text-primary">
        <h2 className="text-xl font-bold mb-4 text-center">Manage Types of Information</h2>

        {/* Type List */}
      

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
