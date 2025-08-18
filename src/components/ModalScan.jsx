import { useState } from "react";
import ModalManageDocumentType from "./ModalManageDocumentType";

export default function ModalScan({ onClose }) {
  const [image, setImage] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [docType, setDocType] = useState(""); // Type of Information
  const [showTypeModal, setShowTypeModal] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setLoading(true);
      simulateOCR(file);
    }
  };

  const simulateOCR = (file) => {
    // Replace this with real OCR logic later
    setTimeout(() => {
      setTextContent("Sample extracted text from image...");
      setLoading(false);
    }, 1000);
  };

  const handleSubmit = () => {
    if (!docType.trim() || !textContent.trim()) {
      alert("Please select a Type of Information and fill in the extracted content.");
      return;
    }

    const scannedDoc = {
      type: docType,
      content: textContent,
      keywords,
      image,
    };

    console.log("Scanned Document:", scannedDoc);
    onClose();

    // Reset
    setDocType("");
    setTextContent("");
    setImage(null);
    setKeywords([]);
    setKeywordInput("");
  };

  if (!onClose) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
        <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl border border-primary/20">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary">Scan Document</h2>
          </div>

          {/* Type of Information */}
          <div className="mb-4">
            <label className="block mb-1 !text-primary font-medium">
              Type of Information <span className="!text-primary">*</span>
            </label>
            <div className="flex gap-2">
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                required
                className="flex-1 !text-primary border border-primary rounded-md px-4 py-2"
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

          {/* Step 1: Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-primary mb-1">
              Use Camera or Upload Photo (Image to Text)
            </label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="w-full border border-primary rounded-md px-3 py-2 text-sm text-gray-700 outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Step 2: Extracted Text */}
          {image && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-primary mb-1">
                Extracted Content
              </label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={4}
                className="w-full border border-primary rounded-md px-3 py-2 text-gray-700 outline-none focus:ring-1 focus:ring-primary"
                placeholder={loading ? "Processing image..." : "Edit extracted text"}
                disabled={loading}
              />
            </div>
          )}

          {/* Step 3: Keywords */}
          <div className="mb-4">
            <label htmlFor="keywords" className="text-sm font-medium text-primary mb-1">
              Keywords
            </label>
            <input
              id="keywords"
              type="text"
              className="w-full border border-primary rounded-md px-3 py-2 text-gray-700 outline-none focus:ring-1 focus:ring-primary"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && keywordInput.trim()) {
                  e.preventDefault();
                  if (!keywords.includes(keywordInput.trim())) {
                    setKeywords([...keywords, keywordInput.trim()]);
                  }
                  setKeywordInput("");
                }
              }}
              placeholder="Press Enter to add keyword"
            />

            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {keywords.map((tag, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1 text-sm !text-primary px-2 py-1 rounded bg-gray-200/60"
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

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 !bg-white text-primary border !border-primary rounded-md hover:bg-primary/10 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 !bg-primary text-white rounded-md hover:bg-primary/80 transition"
            >
              Proceed
            </button>
          </div>
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
