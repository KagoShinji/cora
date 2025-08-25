import { useEffect, useRef, useState } from "react";
import { Mic, Image as ImageIcon } from "lucide-react";
import SidebarUser from "../../components/SidebarUser";
import { useAuthStore } from "../../stores/userStores";
import { useAppSettingsStore } from "../../stores/useSettingsStore";
import { generateAnswer } from "../../api/api";

export default function UserChat() {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [listening, setListening] = useState(false);

  const name = useAppSettingsStore((state) => state.name);
  const currentUser = useAuthStore((s) => s.currentUser);

  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // --- Web Speech API ---
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => setListening(true);
      recognition.onend = () => setListening(false);

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setQuery(transcript);
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("Speech Recognition not supported in this browser.");
    }
  }, []);

  const handleMicClick = () => {
    if (!recognitionRef.current) return;
    if (listening) recognitionRef.current.stop();
    else recognitionRef.current.start();
  };

  // --- Paste Handler ---
  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    const files = [];

    for (let item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) files.push(file);
      }
    }

    if (files.length > 0) {
      setSelectedImages((prev) => [...prev, ...files]);
    }
  };

  // --- Handlers ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if ((!trimmed && selectedImages.length === 0) || isTyping) return;

    appendMessage({
      role: "user",
      text: trimmed,
      images: selectedImages.map((file) => URL.createObjectURL(file)),
    });

    setQuery("");
    setSelectedImages([]);
    setSubmitted(true);

    const accessToken = useAuthStore.getState().access_token;
    let streamedAnswer = "";

    try {
      setIsTyping(true);
      setChatHistory((prev) => [...prev, { role: "assistant", text: "" }]);

      await generateAnswer(trimmed, accessToken, (chunk) => {
        streamedAnswer += chunk;
        setChatHistory((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === "assistant") last.text = streamedAnswer;
          return [...updated.slice(0, -1), last];
        });
      }, selectedImages);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          text: "Sorry, something went wrong while generating a response.",
        },
      ]);
      console.error("Streaming error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  const appendMessage = (msg) => setChatHistory((prev) => [...prev, msg]);

  const handleNewChat = () => {
    setQuery("");
    setChatHistory([]);
    setSubmitted(false);
    setIsTyping(false);
    setSelectedImages([]);
    inputRef.current?.focus();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...files]);
  };

  const removeImage = (idx) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") setQuery("");
  };

  // --- Scroll & Focus ---
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatHistory, isTyping]);

  // --- UI ---
  return (
    <div className="flex h-screen w-screen bg-white text-gray-900 overflow-hidden">
      <SidebarUser
        isOpen={sidebarOpen}
        setOpen={setSidebarOpen}
        onNewChat={handleNewChat}
      />

      {/* Logo */}
      <div
        className="fixed top-4 z-50 transition-all duration-300 text-primary font-bold text-xl select-none"
        style={{ left: sidebarOpen ? "17rem" : "5rem", pointerEvents: "none" }}
      >
        {name.toUpperCase()}
      </div>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4">
          {currentUser && (
            <div className="flex items-center gap-3">
              <div className="text-right leading-tight">
                <div className="text-sm font-semibold text-primary">
                  {currentUser.name || currentUser.email || "User"}
                </div>
                {currentUser.email && (
                  <div className="text-xs text-primary/70">
                    {currentUser.email}
                  </div>
                )}
              </div>
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">
                {(currentUser.name || currentUser.email || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>
            </div>
          )}
        </header>

        {/* Chat Area */}
        <div
          ref={scrollRef}
          id="chat-scroll"
          className="flex-grow overflow-y-auto px-4 py-6"
        >
          {!submitted && chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-1">
                Hello!
              </h1>
              <p className="text-sm text-primary mb-6">
                What can I help you with?
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-w-2xl mx-auto">
              {chatHistory.map((chat, idx) => {
                const isCoraTyping =
                  chat.role === "assistant" && isTyping && chat.text === "";
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg text-sm ${
                      chat.role === "user"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-primary/10 text-primary"
                    } ${isCoraTyping ? "animate-pulse" : ""}`}
                  >
                    <span className="font-semibold">
                      {chat.role === "user" ? "You" : "CORA"}:
                    </span>{" "}
                    {chat.text?.trim() || "Cora is generating"}
                    {chat.images?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {chat.images.map((src, i) => (
                          <img
                            key={i}
                            src={src}
                            alt="uploaded"
                            className="w-24 h-24 object-cover rounded-lg border"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Input Box */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl px-4 py-2 flex flex-col gap-2 border border-primary rounded-lg bg-gray-100 text-primary mx-auto mb-4"
        >
          {/* Image Preview */}
          {selectedImages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedImages.map((file, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute -top-2 -right-2 rounded-full flex items-center justify-center w-4 h-4"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Row */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="p-2 rounded-lg hover:bg-primary/20"
            >
              <ImageIcon size={18} />
            </button>
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            <input
              ref={inputRef}
              className="flex-grow bg-transparent outline-none placeholder:text-primary/50 disabled:opacity-60"
              placeholder="Ask Cora"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              onPaste={handlePaste} // ✅ Paste images directly
              disabled={isTyping}
            />

            <button
              type="button"
              onClick={handleMicClick}
              className={`p-2 rounded-lg ${
                listening ? "bg-red-100 text-red-600" : "hover:bg-primary/20"
              }`}
            >
              <Mic size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
