import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ModalDocumentViewer({ isOpen, onClose, doc, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  // Update state when 'doc' prop changes
  useEffect(() => {
    if (doc) {
      setEditedContent(doc.content ?? ""); // Handles null or undefined
      setIsEditing(false); // Reset editing state on new doc
    }
  }, [doc]);

  if (!isOpen || !doc) return null;

  const handleSave = () => {
    if (!doc.id) {
      console.error("Cannot save: doc.id is missing");
      return;
    }

    if (onSave) {
      // Pass both id and content separately
      onSave(doc.id, editedContent);
    }
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-2xl border relative">
        <h2 className="text-2xl font-bold mb-6 text-primary text-center">
          {doc.title}
        </h2>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Content
          </label>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            readOnly={!isEditing}
            className={`w-full border rounded-md px-3 py-2 text-gray-700 ${
              isEditing
                ? "border-primary bg-white focus:ring-1 focus:ring-primary"
                : "border-gray-300 bg-gray-100 cursor-not-allowed"
            }`}
            rows={8}
            placeholder="No content yet"
          />
        </div>

        <div className="flex justify-end gap-3 pt-6">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedContent(doc.content ?? "");
                }}
                className="px-4 py-2 !bg-white !border-primary text-primary rounded-md hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 !bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 !bg-primary text-white rounded-md hover:bg-primary/90 transition"
            >
              Edit
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 !bg-primary text-white rounded-md hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
