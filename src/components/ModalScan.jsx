import { useState, useRef,useEffect } from "react";
import ModalManageDocumentType from "./ModalManageDocumentType";
import { fetchDocumentInfo } from "../api/api";

export default function ModalScan({ onClose, onUpload,isOpen }) {
  const [image, setImage] = useState(null);
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [docType, setDocType] = useState("");
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [documentTypes, setDocumentTypes] = useState([]);
  

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setCameraActive(true);
    } catch (err) {
      alert("Camera not available: " + err.message);
    }
  };

  // Capture image from camera
  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      setImage(new File([blob], "captured.png", { type: "image/png" }));
    });
    stopCamera();
  };

  // Stop camera
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setCameraActive(false);
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  // Submit
  const handleSubmit = () => {
    if (!docType || !image || keywords.length === 0) {
      alert("Select a type, upload or capture an image, and add at least one keyword.");
      return;
    }

    const scannedDoc = { title_id: docType, keywords, image };
    if (onUpload) onUpload(scannedDoc);
    onClose();

    // Reset
    setDocType("");
    setImage(null);
    setKeywords([]);
    setKeywordInput("");
  };
  useEffect(() => {
    if (isOpen) {
      const loadTypes = async () => {
        try {
          const types = await fetchDocumentInfo();
          setDocumentTypes(types || []);
        } catch (err) {
          console.error("Failed to fetch document types:", err);
        }
      };
      loadTypes();
    }
  }, [isOpen]);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
        <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl border border-primary/20">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary">Scan Document</h2>
            <button onClick={onClose} className="text-2xl font-bold">&times;</button>
          </div>

          <div className="mb-4 flex gap-2 items-center">
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="flex-1 !text-primary border border-primary rounded-md px-4 py-2"
            >
              <option value="">Select a type</option>
              {documentTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            <button
              onClick={() => setShowTypeModal(true)}
              className="px-3 py-2 !bg-primary text-white rounded-md"
            >
              Manage Types
            </button>
          </div>

          {/* Upload or Camera */}
          <div className="mb-4 flex flex-col gap-2">
            <input type="file" accept="image/*" onChange={handleFileUpload} className="border !border-primary rounded-md px-3 py-2" />
            {!cameraActive && <button onClick={startCamera} className="!bg-primary text-white px-4 py-2 rounded">Use Camera</button>}
            {cameraActive && (
              <div className="flex flex-col gap-2">
                <video ref={videoRef} className="border border-primary rounded-md w-full h-64 object-cover" />
                <button onClick={captureImage} className="bg-green-600 text-white px-4 py-2 rounded">Capture</button>
                <button onClick={stopCamera} className="bg-red-600 text-white px-4 py-2 rounded">Cancel</button>
              </div>
            )}
            {image && (
              <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-64 object-contain border border-gray-300 rounded-md" />
            )}
          </div>

          <div className="mb-4">
  {/* Keyword Input */}
  <input
    type="text"
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
    className="w-full border !border-primary rounded-md px-3 py-2"
  />

  {/* Keywords List */}
  {keywords.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-2">
      {keywords.map((tag, idx) => (
        <span
          key={idx}
          className="flex items-center gap-1 text-sm px-2 py-1 rounded !text-primary bg-gray-200/60"
        >
          {tag}
          <button
            type="button"
            onClick={() => setKeywords(keywords.filter((_, i) => i !== idx))}
            className="!text-primary hover:text-red-500"
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
            <button onClick={onClose} className="px-4 py-2 border !border-primary rounded-md">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 !bg-primary text-white rounded-md">Proceed</button>
          </div>
        </div>
      </div>

      {/* Hidden canvas for capturing camera */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Document Type Modal */}
      <ModalManageDocumentType isOpen={showTypeModal} onClose={() => setShowTypeModal(false)} />
    </>
  );
}
