import { useState } from "react";
import { X } from "lucide-react";

export default function ModalDocumentViewer({ isOpen, onClose, doc, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(doc?.content || "");

  if (!isOpen || !doc) return null;

  const handleSave = () => {
    if (onSave) {
      onSave({ ...doc, content: editedContent }); // send updated doc
    }
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-2xl border relative">

        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-primary text-center">
          {doc.title}
        </h2>

        {/* Content */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Content
          </label>
          <textarea
            value={isEditing ? editedContent : doc.content || ""}
            onChange={(e) => setEditedContent(e.target.value)}
            readOnly={!isEditing}
            className={`w-full border rounded-md px-3 py-2 text-gray-700 ${
              isEditing
                ? "border-primary bg-white focus:ring-1 focus:ring-primary"
                : "border-gray-300 bg-gray-100 cursor-not-allowed"
            }`}
            rows={8}
          />
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end gap-3 pt-6">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
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

          {/* Always show Close */}
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
