import { useState,useEffect } from "react";
import ModalManageDocumentType from "./ModalManageDocumentType";
import { fetchDocumentInfo } from "../api/api";

export default function ModalManualEntry({ isOpen, onClose, onSave }) {
  const [content, setContent] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [docType, setDocType] = useState(""); // Added for Type of Information
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [typeOfInfo, setTypeOfInfo] = useState("");
  const [documentTypes, setDocumentTypes] = useState([]);

  const handleKeywordKeyDown = (e) => {
    if (e.key === "Enter" && keywordInput.trim()) {
      e.preventDefault();
      if (!keywords.includes(keywordInput.trim())) {
        setKeywords([...keywords, keywordInput.trim()]);
      }
      setKeywordInput("");
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!content.trim() || !typeOfInfo.trim()) {
    alert("Please select a Type of Information and fill out the content field.");
    return;
  }

  const payload = {
    title_id: typeOfInfo,  
    keywords: keywords,         
    content: content,              
  };

  try {
    await onSave(payload); 
    onClose();

    // Reset form
    setTypeOfInfo("");
    setContent("");
    setKeywords([]);
    setKeywordInput("");
  } catch (err) {
    console.error("Failed to save document:", err);
  }
};

    useEffect(() => {
        if (isOpen) {
          const loadTypes = async () => {
            try {
              const res = await fetchDocumentInfo();
              setDocumentTypes(res || []); 
            } catch (err) {
              console.error("Failed to fetch document types:", err);
            }
          };
          loadTypes();
        }
      }, [isOpen]);
    if (!isOpen) return null;

  if (!isOpen) return null;
     
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
        <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl border">
          <h2 className="text-2xl font-bold mb-4 text-primary text-center">
            Manual Document Entry
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-primary">
            {/* Type of Information */}
            <div>
              <label className="block mb-1 font-medium">
                Type of Information <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={typeOfInfo}
                  onChange={(e) => setTypeOfInfo(e.target.value)}
                  required
                  className="flex-1 border border-primary rounded-md px-4 py-2"
                >
                  <option value="">Select type</option>
                  {documentTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
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

            {/* Keywords */}
            <div>
              <label className="block mb-1 font-medium">Keywords</label>
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleKeywordKeyDown}
                placeholder="Type a keyword and press Enter"
                className="w-full border border-primary rounded-md px-4 py-2"
              />
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {keywords.map((tag, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-1 text-sm px-2 py-1 rounded bg-gray-200/60"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => setKeywords(keywords.filter((_, i) => i !== idx))}
                        className="text-gray-500 hover:text-red-500"
                        style={{ all: "unset", cursor: "pointer", color: "inherit" }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
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
                Proceed
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Document Type Modal */}
      <ModalManageDocumentType
        isOpen={showTypeModal}
        onClose={() => setShowTypeModal(false)}
      />
    </>
  );
}
