import { useState } from "react";
import ModalManageDocumentType from "./ModalManageDocumentType";

export default function ModalManualEntry({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState("");
  const [showTypeModal, setShowTypeModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!docType || !content) {
      alert("Please fill out all required fields.");
      return;
    }

    const manualDoc = {
      title,
      type: docType,
      content,
      notes,
    };

    onSave(manualDoc);
    onClose();

    // Reset form
    setTitle("");
    setDocType("");
    setContent("");
    setNotes("");
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
        <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl border">
          <h2 className="text-2xl font-bold mb-4 text-primary text-center">
            Manual Document Entry
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-primary">
            {/* Title 
            <div>
              <label className="block mb-1 font-medium">
                Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter document title"
                required
                className="w-full border border-primary rounded-md px-4 py-2"
              />
            </div>
            */}

            {/* Document Type */}
            <div>
              <label className="block mb-1 font-medium">
                Document Type <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  required
                  className="flex-1 border border-primary rounded-md px-4 py-2"
                >
                  <option value="">Select a type</option>
                  <option value="enrollment">Enrollment Process</option>
                  <option value="tuition">Tuition Fees</option>
                  <option value="scholarship">Scholarships</option>
                  <option value="calendar">Academic Calendar</option>
                  <option value="facilities">Campus Facilities</option>
                  <option value="others">Others</option>
                </select>
                <button
                  type="button"
                  onClick={() => setShowTypeModal(true)}
                  className="px-3 py-2 !bg-primary text-white rounded-md hover:bg-primary/90 transition whitespace-nowrap"
                >
                  Manage Types
                </button>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block mb-1 font-medium">
                Content <span className="text-red-600">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder="Enter the document content here..."
                required
                className="w-full border border-primary rounded-md px-4 py-2 resize-none"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block mb-1 font-medium">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Any extra remarks..."
                className="w-full border border-primary rounded-md px-4 py-2 resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 !bg-white text-primary border !border-primary rounded-md hover:bg-primary/10 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 !bg-primary text-white rounded-md hover:bg-primary/90 transition"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Manage Document Types Modal */}
      <ModalManageDocumentType
        isOpen={showTypeModal}
        onClose={() => setShowTypeModal(false)}
      />
    </>
  );
}
