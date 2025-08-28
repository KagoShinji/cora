import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { fetchDocumentInfo } from "../api/api"; // Import the API function

const ModalEditDocument = ({ isOpen, onClose, document, onUpdate }) => {
  // Initialize titleId as a string to match select option values
  const [titleId, setTitleId] = useState("");
  const [content, setContent] = useState(""); 
  const [file, setFile] = useState(null); 
  const [documentTypes, setDocumentTypes] = useState([]); 

  useEffect(() => {
    if (document) {
      // Set titleId to the document's title_id, ensuring it's a string for the select element
      setTitleId(document.title_id || ""); 
      setContent(document.content || ""); 
      setFile(null); 
    } else {
      // Clear states if no document is being edited
      setTitleId(""); 
      setContent("");
      setFile(null);
    }
  }, [document]);

  useEffect(() => {
    if (isOpen) {
      const getDocumentTypes = async () => {
        try {
          const types = await fetchDocumentInfo();
          setDocumentTypes(types);
        } catch (error) {
          console.error("Failed to fetch document types:", error);
          // Optionally, show an error message to the user
        }
      };
      getDocumentTypes();
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToUpdate = {
      id: document.id,
      // Ensure title_id is parsed back to an integer for the API
      title_id: parseInt(titleId, 10), 
    };

    if (file) {
      dataToUpdate.file = file;
    } else if (document.content !== undefined) {
      dataToUpdate.content = content;
    }
    
    onUpdate(dataToUpdate);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="w-6 h-6 !bg-primary !text-white hover:text-gray-800" />
        </button>

        <h2 className="text-xl font-bold text-primary mb-4">Edit Document</h2>

        {document?.remarks && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md" role="alert">
            <p className="font-bold">Remarks from Approver</p>
            <p>{document.remarks}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="titleId" className="block text-sm font-medium text-gray-700">
              Type of Information
            </label>
            <select
              id="titleId"
              value={titleId}
              onChange={(e) => setTitleId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="">Select a type</option>
              {documentTypes.map((type) => (
                <option key={type.id} value={String(type.id)}> {/* Ensure option value is a string */}
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {document?.filename ? ( 
            <div>
              <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700">
                Change File (Optional)
              </label>
              <input 
                type="file"
                id="fileUpload"
                onChange={(e) => setFile(e.target.files[0])}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              />
              {document.filename && <p className="text-xs text-gray-500 mt-1">Current file: {document.filename}</p>}
            </div>
          ) : document?.content !== undefined ? ( 
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="5"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              ></textarea>
            </div>
          ) : null}

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 !text-primary border !bg-white !border-primary rounded-md hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 !bg-primary text-white rounded-md hover:bg-blue-700 transition"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditDocument;
