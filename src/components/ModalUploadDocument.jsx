import { useState } from "react";
import ModalManageDocumentType from "./ModalManageDocumentType";

export default function ModalUploadDocument({ isOpen, onClose, onUpload }) {
  const [typeOfInfo, setTypeOfInfo] = useState(""); // Type of Information
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [files, setFiles] = useState([]);
  const [showTypeModal, setShowTypeModal] = useState(false);

  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    if (newFile && newFile.type === "application/pdf") {
      setFiles((prev) => [...prev, newFile]);
    }
    e.target.value = "";
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!typeOfInfo || files.length === 0) {
      alert("Please select a Type of Information and upload at least one PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("typeOfInfo", typeOfInfo);
    formData.append("keywords", keywords.join(","));
    files.forEach((file) => formData.append("files", file));

    await onUpload(formData);
    onClose();

    setTypeOfInfo("");
    setKeywords([]);
    setFiles([]);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
        <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl border">
          <h2 className="text-2xl font-bold mb-4 text-primary text-center">
            Upload PDF Document
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

            {/* Keywords Input */}
            <div className="flex flex-col gap-1">
              <label htmlFor="keywords" className="text-sm font-medium text-primary">
                Keywords
              </label>
              <input
                id="keywords"
                type="text"
                className="border rounded p-2"
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

              {/* Keywords List */}
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
                        onClick={() =>
                          setKeywords(keywords.filter((_, i) => i !== idx))
                        }
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

            {/* File Upload */}
            <div>
              <label className="block mb-1 font-medium">
                Choose PDF File <span className="text-red-600">*</span>
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full border border-primary rounded-md px-4 py-2"
              />
            </div>

            {/* Uploaded Files List */}
            {files.length > 0 && (
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center border border-gray-300 rounded-md px-3 py-2"
                  >
                    <span className="truncate text-gray-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="text-gray-500 hover:text-red-500 bg-transparent border-none p-0 m-0"
                      style={{ all: "unset", cursor: "pointer", color: "inherit" }}
                    >
                      X
                    </button>
                  </li>
                ))}
              </ul>
            )}

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

      {/* Modal for Managing Types */}
      <ModalManageDocumentType
        isOpen={showTypeModal}
        onClose={() => setShowTypeModal(false)}
      />
    </>
  );
}
