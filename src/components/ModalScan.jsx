import { useState, useRef, useEffect } from "react";
import ModalManageDocumentType from "./ModalManageDocumentType";
import { fetchDocumentInfo } from "../api/api";

export default function ModalScan({ onClose, onUpload, isOpen }) {
  const [image, setImage] = useState(null);
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

  // Start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 } 
        } 
      });
      
      setStream(mediaStream);
      setCameraActive(true);
      
      // Wait for the video element to be available
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(console.error);
        }
      }, 100);
      
    } catch (err) {
      console.error("Camera error:", err);
      alert("Camera not available: " + err.message);
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
    
    // Make sure video has loaded
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      alert("Video not ready. Please wait a moment and try again.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        setImage(new File([blob], "captured.png", { type: "image/png" }));
        stopCamera();
      }
    }, "image/png");
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle keyword input
  const handleKeywordKeyDown = (e) => {
    if (e.key === "Enter" && keywordInput.trim()) {
      e.preventDefault();
      if (!keywords.includes(keywordInput.trim())) {
        setKeywords([...keywords, keywordInput.trim()]);
      }
      setKeywordInput("");
    }
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

  // Clean up camera when modal closes
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
    }
  }, [isOpen]);

  // Load document types when modal opens
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

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
        <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl border border-primary/20 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold !text-primary">Scan Document</h2>
            <button 
              onClick={() => {
                stopCamera();
                onClose();
              }} 
              className="text-2xl font-bold !bg-primary text-white hover:text-red-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              ×
            </button>
          </div>

          {/* Document Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
            <div className="flex gap-2 items-center">
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="flex-1 text-gray-800 bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="" className="text-gray-500">Select a document type</option>
                {documentTypes.map((type) => (
                  <option key={type.id} value={type.id} className="text-gray-800">{type.name}</option>
                ))}
              </select>
              <button
                onClick={() => setShowTypeModal(true)}
                className="px-4 py-2.5 !bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap font-medium"
              >
                Manage Types
              </button>
            </div>
          </div>

          {/* Image Upload/Capture Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Upload or Capture Image</label>
            
            {/* Hidden file input */}
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="hidden"
            />
            
            {/* Upload/Camera buttons */}
            <div className="flex flex-col gap-3">
              {!cameraActive && (
                <div className="flex gap-3">
                  <button 
                    onClick={triggerFileInput}
                    className="flex-1 !bg-primary border-2 border-dashed border-gray-300 rounded-lg py-4 px-4 hover:bg-gray-100 hover:border-gray-400 transition-all text-white font-medium flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                    Choose File
                  </button>
                  <button 
                    onClick={startCamera} 
                    className="flex-1 !bg-primary text-white py-4 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    Use Camera
                  </button>
                </div>
              )}
              
              {cameraActive && (
                <div className="flex flex-col gap-3">
                  <video 
                    ref={videoRef} 
                    className="border-2 border-blue-300 rounded-lg w-full h-64 object-cover bg-black"
                    autoPlay
                    playsInline
                    muted
                  />
                  <div className="flex gap-3">
                    <button 
                      onClick={captureImage} 
                      className="flex-1 !bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.5 12.75l6 6 9-13.5"/>
                      </svg>
                      Capture
                    </button>
                    <button 
                      onClick={stopCamera} 
                      className="flex-1 !bg-white border !border-primary !text-primary  py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              {image && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Selected Image:</span>
                    <button 
                      onClick={() => setImage(null)}
                      className="!bg-white !text-primary !border-primary hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                  <img 
                    src={URL.createObjectURL(image)} 
                    alt="Preview" 
                    className="w-full h-48 object-contain border border-gray-200 rounded-md bg-white" 
                  />
                </div>
              )}
            </div>
          </div>

          {/* Keywords Section - Updated to match ModalManualEntry */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleKeywordKeyDown}
              placeholder="Type a keyword and press Enter"
              className="w-full border text-gray-700 border-primary rounded-md px-4 py-2"
            />
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {keywords.map((tag, idx) => (
                  <span
                    key={idx}
                    className="flex items-center !text-primary gap-1 text-sm px-2 py-1 rounded bg-gray-200/60"
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
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button 
              onClick={() => {
                stopCamera();
                onClose();
              }} 
              className="px-6 py-2.5 border !bg-white !border-primary !text-primary rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit} 
              className="px-6 py-2.5 !bg-primary text-white rounded-lg hover:!bg-primary/90 transition-colors font-medium"
            >
              Proceed
            </button>
          </div>
        </div>
      </div>

      {/* Hidden canvas for capturing camera */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Document Type Modal */}
      <ModalManageDocumentType 
        isOpen={showTypeModal} 
        onClose={() => setShowTypeModal(false)} 
      />
    </>
  );
}