import { useState, useRef, useEffect } from "react";
import ModalManageDocumentType from "./ModalManageDocumentType";
import { fetchDocumentInfo } from "../api/api";
import { Info, X, Camera, FileImage, Tag } from "lucide-react";

export default function ModalScan({ onClose, onUpload, isOpen }) {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [docType, setDocType] = useState("");
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [showError, setShowError] = useState(false);

  // Keep preview URL in sync with selected image (avoid memory leaks)
  useEffect(() => {
    if (!image) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      return;
    }
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  // Start camera with retry logic
  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Camera not available on this device/browser.");
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      });

      setStream(mediaStream);
      setCameraActive(true);

      let retries = 0;
      const maxRetries = 10;
      const intervalId = setInterval(() => {
        if (videoRef.current && mediaStream) {
          try {
            videoRef.current.srcObject = mediaStream;
            const playPromise = videoRef.current.play();
            if (playPromise && typeof playPromise.then === "function") {
              playPromise.then(() => clearInterval(intervalId)).catch(() => {});
            } else {
              clearInterval(intervalId);
            }
          } catch {
            // try again until retries exhausted
          }
        }
        retries += 1;
        if (retries >= maxRetries) clearInterval(intervalId);
      }, 200);
    } catch (err) {
      console.error("Camera error:", err);
      alert("Camera not available: " + (err && err.message ? err.message : "Unknown error"));
    }
  };

  // Capture image from camera
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) {
      alert("Camera not ready. Please try again.");
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!video.videoWidth || !video.videoHeight) {
      alert("Video not ready. Please wait a moment and try again.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      alert("Canvas not ready. Please try again.");
      return;
    }
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          setImage(new File([blob], "captured.png", { type: "image/png" }));
          stopCamera();
        } else {
          alert("Failed to capture image. Please try again.");
        }
      },
      "image/png",
      0.95
    );
  };

  // Stop camera
  const stopCamera = () => {
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    } finally {
      setCameraActive(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) setImage(file);
    // allow re-selecting the same file
    if (e.target) e.target.value = "";
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleKeywordKeyDown = (e) => {
    if (e.key === "Enter" && keywordInput.trim()) {
      e.preventDefault();
      const val = keywordInput.trim();
      if (!keywords.includes(val)) {
        setKeywords((prev) => [...prev, val]);
      }
      setKeywordInput("");
    }
  };

const handleSubmit = (e) => {
  e.preventDefault();

  if (!docType || !image || keywords.length === 0) {
    setShowError(true);
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
  setShowError(false);
  stopCamera();
};

  useEffect(() => {
    if (isOpen) {
      (async () => {
        try {
          const types = await fetchDocumentInfo();
          setDocumentTypes(types || []);
        } catch (err) {
          console.error("Failed to fetch document types:", err);
        }
      })();
    }
  }, [isOpen]);

  useEffect(() => {
    // cleanup on unmount
    return () => {
      stopCamera();
    };
  }, []);

  if (!isOpen) return null;

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) {
      stopCamera();
      onClose();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="scan-doc-title"
        aria-describedby="scan-doc-desc"
        onMouseDown={handleBackdrop}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

        {/* Modal Card */}
        <div
          className="relative w-full max-w-lg mx-4 rounded-2xl bg-white shadow-2xl border border-gray-200 max-h-[calc(100vh-2rem)] overflow-hidden"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-200">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-200">
                <Camera className="h-5 w-5 text-gray-700" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2 id="scan-doc-title" className="text-xl font-semibold text-gray-900">
                  Scan Document
                </h2>
                <p
                  id="scan-doc-desc"
                  className="mt-1 flex items-center gap-1 text-sm text-gray-600"
                >
                  <Info className="h-4 w-4" aria-hidden="true" />
                  Upload or capture an image; add keywords and type.
                </p>
              </div>

              {/* Clickable X icon (no button wrapper) */}
              <X
                onClick={() => {
                  stopCamera();
                  onClose();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    stopCamera();
                    onClose();
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Close dialog"
                className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700"
                title="Close"
              />
            </div>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Document Type */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Document Type <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white shadow-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
                  >
                    <option value="">Select type</option>
                    {documentTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>

                  {/* Manage Types button */}
                  <button
                    type="button"
                    onClick={() => setShowTypeModal(true)}
                    className="px-3 py-2 text-sm font-medium !bg-white border !border-gray-300 rounded-xl text-gray-700 hover:!bg-gray-100 transition whitespace-nowrap"
                    title="Manage document types"
                  >
                    Manage Types
                  </button>
                </div>
              </div>

              {/* Upload or Capture */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Upload or Capture Image <span className="text-red-500">*</span>
                </label>

                {/* Hidden input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />

                <div className="flex flex-col gap-3">
                  {!cameraActive && (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl !bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                        aria-label="Choose image file"
                        title="Choose image file"
                      >
                        <FileImage className="h-5 w-5" />
                        Choose File
                      </button>
                      <button
                        type="button"
                        onClick={startCamera}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl !bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                        aria-label="Use camera"
                        title="Use camera"
                      >
                        <Camera className="h-5 w-5" />
                        Use Camera
                      </button>
                    </div>
                  )}

                  {cameraActive && (
                    <div className="flex flex-col gap-3">
                      <video
                        ref={videoRef}
                        className="border border-gray-300 rounded-xl w-full h-64 object-cover bg-black"
                        autoPlay
                        playsInline
                        muted
                        aria-label="Camera preview"
                      />
                      {!stream && (
                        <p className="text-sm text-red-500 text-center mt-2" role="alert">
                          🚫 Camera stream not available.
                        </p>
                      )}
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={captureImage}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl !bg-green-500 text-white text-sm font-semibold shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                          aria-label="Capture image"
                          title="Capture image"
                        >
                          <Camera className="h-5 w-5" />
                          Capture
                        </button>
                        <button
                          type="button"
                          onClick={stopCamera}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 !bg-red-600 text-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                          aria-label="Cancel camera"
                          title="Cancel"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {image && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Selected Image:</span>
                        <button
                          type="button"
                          onClick={() => setImage(null)}
                          className="text-sm font-medium text-white !bg-red-600 hover:text-red-500"
                          aria-label="Remove selected image"
                          title="Remove"
                        >
                          Remove
                        </button>
                      </div>
                      <img
                        src={previewUrl || ""}
                        alt="Preview"
                        className="w-full h-48 object-contain rounded-xl border border-gray-200 bg-white"
                      />
                    </div>
                  )}
                </div>
              </div>

{/* Keywords */}
<div>
  <label className="block text-sm font-medium text-gray-800 mb-2">
    Keywords <span className="text-red-500">*</span>
  </label>
  <div className="relative">
    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
    <input
      type="text"
      value={keywordInput}
      onChange={(e) => setKeywordInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && keywordInput.trim()) {
          e.preventDefault();
          const val = keywordInput.trim();
          if (!keywords.includes(val)) {
            setKeywords([...keywords, val]);
          }
          setKeywordInput("");
          setShowError(false); // clear error once keyword is added
        }
      }}
      placeholder="Press Enter to add keyword"
      className={`w-full pl-9 pr-3 py-3 border rounded-xl text-gray-900 placeholder-gray-400 shadow-sm outline-none transition ${
        showError && keywords.length === 0
          ? "border-red-500 focus:ring-red-200"
          : "border-gray-300 focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
      }`}
      aria-label="Keyword input"
    />
  </div>

  {/* Inline error */}
  {showError && keywords.length === 0 && (
    <p className="mt-1 text-sm text-red-500">Please add at least one keyword.</p>
  )}

  {keywords.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-2">
      {keywords.map((tag, idx) => (
        <span
          key={`${tag}-${idx}`}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200"
        >
          {tag}
          <span
            onClick={() => setKeywords(keywords.filter((_, i) => i !== idx))}
            role="button"
            tabIndex={0}
            className="text-gray-500 hover:text-red-500 cursor-pointer select-none"
            aria-label={`Remove ${tag}`}
          >
            ×
          </span>
        </span>
      ))}
    </div>
  )}
</div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    onClose();
                  }}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 !bg-red-500 text-white text-sm font-medium shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl !bg-green-500 text-white text-sm font-semibold shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                >
                  Proceed
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Manage Types Modal */}
      <ModalManageDocumentType
        isOpen={showTypeModal}
        onClose={() => setShowTypeModal(false)}
      />
    </>
  );
}
