import { useState, useRef, useEffect } from "react";
import ModalManageDocumentType from "./ModalManageDocumentType";
import { fetchDocumentInfo } from "../api/api";
import { Info, X, Camera, FileImage, Tag, Loader2 } from "lucide-react";
import { useDocumentStore } from "../stores/useDocumentStore";

export default function ModalScan({ onClose, onUpload, isOpen }) {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [docType, setDocType] = useState("");
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [zoomHint, setZoomHint] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [showError, setShowError] = useState(false);
  const { refreshTrigger } = useDocumentStore();

  // Clean up preview URLs
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

  // Start camera
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
          } catch {}
        }
        retries += 1;
        if (retries >= maxRetries) clearInterval(intervalId);
      }, 200);
    } catch (err) {
      console.error("Camera error:", err);
      alert(
        "Camera not available: " +
          (err && err.message ? err.message : "Unknown error")
      );
    }
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

  // Capture image
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

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) setImage(file);
    if (e.target) e.target.value = "";
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!docType || !image || keywords.length === 0) {
      setShowError(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const scannedDoc = { title_id: docType, keywords, image };
      if (onUpload) await onUpload(scannedDoc);
      onClose();

      setDocType("");
      setImage(null);
      setKeywords([]);
      setKeywordInput("");
      setShowError(false);
      stopCamera();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch document types
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
  }, [isOpen, refreshTrigger]);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Zoom hint logic
  useEffect(() => {
    if (!cameraActive || !videoRef.current) return;

    const interval = setInterval(() => {
      const video = videoRef.current;
      if (!video.videoWidth || !video.videoHeight) return;

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let brightness = 0;
      for (let i = 0; i < imgData.length; i += 4) brightness += imgData[i];
      brightness /= canvas.width * canvas.height;

      if (brightness < 40) setZoomHint("Too dark or too close");
      else if (brightness > 200) setZoomHint("Too far");
      else setZoomHint("Good distance");
    }, 1500);

    return () => clearInterval(interval);
  }, [cameraActive]);

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
                  Type of Information <span className="text-red-500">*</span>
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
                  <button
                    type="button"
                    onClick={() => setShowTypeModal(true)}
                    className="flex items-center justify-center w-10 h-10 text-lg font-bold !bg-white border !border-gray-300 rounded-xl text-gray-700 hover:!bg-gray-100 transition"
                    title="Manage Types"
                    aria-label="Manage Types"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Upload / Camera Section */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Upload or Capture Image <span className="text-red-500">*</span>
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />

                <div className="flex flex-col gap-3">
                  {!cameraActive && !image && (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl !bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                      >
                        <FileImage className="h-5 w-5" />
                        Choose File
                      </button>
                      <button
                        type="button"
                        onClick={startCamera}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl !bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                      >
                        <Camera className="h-5 w-5" />
                        Use Camera
                      </button>
                    </div>
                  )}

                  {cameraActive && (
                    <div className="flex flex-col gap-3">
                      <div className="relative w-full h-64 border border-gray-300 rounded-xl overflow-hidden">
                        <video
                          ref={videoRef}
                          className="absolute inset-0 w-full h-full object-cover bg-black"
                          autoPlay
                          playsInline
                          muted
                        />

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="relative w-4/5 h-3/5 border-4 border-white/80 rounded-lg shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>
                        </div>

                        <p className="absolute bottom-2 left-0 right-0 text-center text-white text-xs bg-black/40 py-1">
                          Align your document within the white frame
                        </p>
                      </div>

                      {zoomHint && (
                        <p className="text-center text-sm text-gray-600 mt-1">
                          {zoomHint}
                        </p>
                      )}

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={captureImage}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl !bg-green-500 text-white text-sm font-semibold shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                        >
                          <Camera className="h-5 w-5" />
                          Capture
                        </button>
                        <button
                          type="button"
                          onClick={stopCamera}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 !bg-red-600 text-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {image && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Selected Image:
                        </span>
                        <button
                          type="button"
                          onClick={() => setImage(null)}
                          className="text-sm font-medium text-white !bg-red-600 px-2 py-1 rounded"
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
                        setShowError(false);
                      }
                    }}
                    placeholder="Press Enter to add keyword"
                    className={`w-full pl-9 pr-3 py-3 border rounded-xl text-gray-900 placeholder-gray-400 shadow-sm outline-none transition ${
                      showError && keywords.length === 0
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-gray-400 focus:ring-4 focus:ring-gray-200"
                    }`}
                  />
                </div>

                {showError && keywords.length === 0 && (
                  <p className="mt-1 text-sm text-red-500">
                    Please add at least one keyword.
                  </p>
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
                          onClick={() =>
                            setKeywords(keywords.filter((_, i) => i !== idx))
                          }
                          className="text-gray-500 hover:text-red-500 cursor-pointer select-none"
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
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl !bg-green-500 text-white text-sm font-semibold shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                    </>
                  ) : (
                    "Proceed"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <ModalManageDocumentType
        isOpen={showTypeModal}
        onClose={() => setShowTypeModal(false)}
      />
    </>
  );
}
