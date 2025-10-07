import { X, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

function ModalReuploadFile({ open, onClose, file, onReupload }) {
  const [newFile, setNewFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!open || !file) return null;

  const handleConfirm = async () => {
    if (!newFile) {
      toast.error("⚠️ Please select a file to reupload.", { position: "bottom-right" });
      return;
    }

    try {
      setIsUploading(true);
      await onReupload(file, newFile);
      toast.success("✅ File reuploaded successfully!", { position: "bottom-right" });
      setNewFile(null);
      onClose();
    } catch (error) {
      console.error("Reupload failed:", error);
      toast.error("❌ Failed to reupload file.", { position: "bottom-right" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-lg font-bold text-primary">Reupload File</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isUploading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1">
          <p className="text-gray-700 mb-4 text-center">
            You are replacing{" "}
            <span className="font-semibold">{file.title}</span>{" "}
            (<span className="text-gray-600">{file.name}</span>)
          </p>

          <div className="flex flex-col items-center">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setNewFile(e.target.files[0])}
              disabled={isUploading}
              className="block w-full text-sm text-gray-700 
                         border border-gray-300 rounded-md cursor-pointer 
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:text-sm file:font-semibold
                         file:bg-primary file:text-white
                         hover:file:bg-primary/90 disabled:opacity-50"
            />
            {newFile && (
              <p className="mt-2 text-sm text-green-600">
                Selected: {newFile.name}
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-center gap-3 border-t px-6 py-4">
          <button
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-2 !bg-white !text-primary !border !border-primary rounded-md hover:bg-gray-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isUploading}
            className="px-4 py-2 !bg-primary text-white rounded-md hover:!bg-primary/90 transition inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Reupload"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalReuploadFile;
