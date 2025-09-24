// src/pages/LandingPage.jsx
import { useState, useEffect, useMemo,useRef } from "react";
import { Mic, Image as ImageIcon, Menu,Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useAuthStore } from "../stores/userStores";
import { useAppSettingsStore } from "../stores/useSettingsStore";
import { useNavigate } from "react-router-dom";
import UserForgotPasswordModal from "../components/UserForgotPasswordModal";
import LoginModal from "../components/auth/LoginModal";
import { RegisterModal } from "../components/auth/RegisterModal";
import { generateAnswer } from "../api/api";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


export default function LandingPage() {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [modal, setModal] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [middleInitial,setMiddleInitial] = useState("")
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);





  const closeModal = () => setModal(null);

  const signup = useAuthStore((state) => state.signup);
  const signin = useAuthStore((state) => state.signin);
  const error = useAuthStore((state) => state.error);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const getSettings = useAppSettingsStore((state) => state.getSettings);
  const appendMessage = (msg) => setChatHistory((prev) => [...prev, msg]);


  const name = useAppSettingsStore((state) => state.name);
  const primaryColor = useAppSettingsStore((state) => state.primary_color);

  const navigate = useNavigate();


  
  // === Responsive: track mobile breakpoint (md < 768px) ===
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767.98px)");
    const handler = (e) => setIsMobile(e.matches);
    handler(mql);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Optional: prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (!isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = sidebarOpen ? "hidden" : prev || "";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [isMobile, sidebarOpen]);

  useEffect(() => {
  if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
    console.warn("Speech Recognition not supported in this browser.");
    return;
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => setListening(true);
  recognition.onend = () => setListening(false);
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setQuery((prev) => prev + " " + transcript);
  };

  recognitionRef.current = recognition;

  return () => recognition.stop();
}, []);

  // Desktop: 17rem/5rem; Mobile: overlay => 0
  const sidebarOffset = useMemo(
    () => (isMobile ? "0" : sidebarOpen ? "17rem" : "5rem"),
    [isMobile, sidebarOpen]
  );

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };
  const tint20 = useMemo(
    () => (primaryColor?.startsWith?.("#") ? `${primaryColor}20` : primaryColor),
    [primaryColor]
  );
  const tint15 = useMemo(
    () => (primaryColor?.startsWith?.("#") ? `${primaryColor}15` : primaryColor),
    [primaryColor]
  );
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
 
       await generateAnswer(
         trimmed,
         accessToken,
         (chunk) => {
           streamedAnswer += chunk;
           setChatHistory((prev) => {
             const updated = [...prev];
             const last = updated[updated.length - 1];
             if (last.role === "assistant") last.text = streamedAnswer;
             return [...updated.slice(0, -1), last];
           });
         },
         selectedImages
       );
       if (voiceMode && streamedAnswer.trim()) {
         speak(streamedAnswer);
         setVoiceMode(false);
       }
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
const removeImage = (idx) => {
  setSelectedImages((prev) => prev.filter((_, i) => i !== idx));
};
  const onKeyDown = (e) => {
    if (e.key === "Escape") setQuery("");
  };

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
   const handleMicClick = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setVoiceMode(true);
    }
  };


  const handleNewChat = async () => {
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

  const handleLogin = async (e) => {
    e.preventDefault();
    const userData = {
      name: firstName + " " + lastName,
      email,
      password,
    };

    try {
      const login = await signin(userData);
      if (!login) {
        alert("Invalid credentials");
        return;
      } else {
        alert("Login successfully");
      }
      switch (login.user.role) {
        case "user":
          navigate("/user/chat");
          break;
        default:
          alert("Unauthorized role or unknown user.");
      }
    } catch (error) {}
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const userData = {
      name: `${firstName} ${lastName} ${middleInitial}`,
      email,
      password,
    };
    try {
      const response = await signup(userData);
      if (!response.ok) {
        console.log("Something went wrong please try again", error);
      }
      alert("Created account successfully");
      window.location.reload();
    } catch (err) {
      throw Error("Something went wrong please try again:", err);
    }
  };

  useEffect(() => {
    const el = document.getElementById("chat-scroll");
    if (el) el.scrollTop = el.scrollHeight;
  }, [chatHistory]);

  useEffect(() => {
  const fetchSettings = async () => {
    try {
      await getSettings();
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchSettings();
}, []);
if (loading) {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-white text-gray-900">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );
}
  return (
      
    <div className="flex h-screen w-screen bg-white text-gray-900 overflow-hidden">
      {/* Sidebar (mobile = drawer, desktop = collapsible) */}
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        onNewChat={handleNewChat}
        isMobile={isMobile}
      />

      {/* Desktop fixed logo (hidden on mobile) */}
      <div
        className="hidden md:block fixed top-4 z-50 transition-all duration-300 font-bold text-xl select-none"
        style={{
          left: sidebarOffset,
          pointerEvents: "none",
          color: primaryColor,
        }}
      >
        {name.toUpperCase()}
      </div>

      {/* Main Content shifts with sidebar (0 on mobile) */}
      <div
        className="flex-1 relative flex flex-col"
        style={{ marginLeft: sidebarOffset, transition: "margin-left 300ms ease" }}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4">
          {/* Mobile: burger + logo inline */}
          <div className="md:hidden flex items-center gap-3">
            <Menu
              onClick={() => setSidebarOpen(true)}
              role="button"
              tabIndex={0}
              aria-label="Open menu"
              className="h-5 w-5 cursor-pointer"
              style={{ color: primaryColor }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setSidebarOpen(true);
              }}
              aria-pressed={sidebarOpen}
            />
            <span className="font-bold text-lg select-none" style={{ color: primaryColor }}>
              {name.toUpperCase()}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 md:gap-4 ml-auto">
            <button
              style={{ backgroundColor: primaryColor }}
              className="px-3 md:px-4 py-1 text-xs md:text-sm text-white rounded-full"
              onClick={() => setModal("login")}
            >
              Login
            </button>
            <button
              className="px-3 md:px-4 py-1 text-xs md:text-sm rounded-full border"
              style={{ borderColor: primaryColor, color: primaryColor, backgroundColor: "#fff" }}
              onClick={() => setModal("register")}
            >
              Sign up
            </button>
          </div>
        </header>

        {/* Chat Area */}
       <div ref={scrollRef} id="chat-scroll" className="flex-grow overflow-y-auto px-4 py-6">
                 {!submitted && chatHistory.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-center px-4">
                     <h1 className="text-3xl sm:text-4xl font-bold mb-1" style={{ color: primaryColor }}>
                       Hello!
                     </h1>
                     <p className="text-sm mb-6" style={{ color: primaryColor }}>
                       What can I help you with?
                     </p>
                   </div>
                 ) : (
                   <div className="flex flex-col gap-3 max-w-2xl mx-auto">
                     {chatHistory.map((chat, idx) => {
                       const isCoraTyping = chat.role === "assistant" && isTyping && chat.text === "";
                       const isUser = chat.role === "user";
                       return (
                         <div
                           key={idx}
                           className={`p-3 rounded-lg text-sm ${isCoraTyping ? "animate-pulse" : ""}`}
                           style={
                             isUser
                               ? { backgroundColor: "#f3f4f6", color: "#1f2937" }
                               : { backgroundColor: tint15, color: primaryColor }
                           }
                         >
                           <span className="font-semibold">{isUser ? "You" : "CORA"}:</span>{" "}
                           <div className="whitespace-pre-wrap break-words">
                             <ReactMarkdown remarkPlugins={[remarkGfm]}>
                               {chat.text?.trim() || "Cora is generating"}
                             </ReactMarkdown>
                           </div>
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
               <form
  onSubmit={handleSubmit}
  className="
    sticky bottom-0    /* stay visible above content */
    w-full
    px-3 md:px-4 py-2
    bg-white/80 backdrop-blur
  "
  style={{
    borderColor: primaryColor,
    // iOS/Android safe area: keeps the composer above home indicator
    paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.5rem)",
  }}
>
  <div
    className="
      mx-auto
      w-full
      max-w-full
      sm:max-w-xl
      md:max-w-2xl
      lg:max-w-2xl
      rounded-xl
      bg-gray-100
      border
      flex flex-col gap-2
      p-2 md:p-3
    "
    style={{ borderColor: primaryColor, color: primaryColor }}
  >
    {/* Image Preview (wraps on small screens, scrolls if many) */}
    {selectedImages.length > 0 && (
      <div className="flex flex-row flex-wrap gap-2 overflow-x-auto">
        {selectedImages.map((file, idx) => (
          <div key={idx} className="relative shrink-0">
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg border"
            />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute -top-2 -right-2 rounded-full flex items-center justify-center w-5 h-5 md:w-4 md:h-4 text-white text-xs"
              style={{ backgroundColor: primaryColor }}
              aria-label="Remove image"
              title="Remove image"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    )}

    {/* Input Row */}
    <div className="flex items-center gap-2">
      {/* Attach */}
      <div
        className="
          shrink-0
          rounded-lg
          p-2 md:p-2
          bg-gray-100 hover:bg-gray-200
          transition
        "
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = tint20)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
        role="button"
        tabIndex={0}
        aria-label="Attach images"
        title="Attach images"
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileInputRef.current?.click()}
      >
        <ImageIcon
          size={20}
          className="md:h-[18px] md:w-[18px]"
          style={{ color: primaryColor }}
        />
      </div>
      <input
        type="file"
        accept="image/*"
        multiple
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* Text input: grows, wraps long text nicely */}
      <input
        ref={inputRef}
        className="
          min-w-0 flex-grow
          bg-transparent outline-none disabled:opacity-60
          text-sm md:text-base
          placeholder:text-xs md:placeholder:text-sm
          py-2
        "
        placeholder="Ask Cora"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        onPaste={handlePaste}
        disabled={isTyping}
        style={{ color: primaryColor }}
      />

      {/* Mic */}
      <div
        className="shrink-0 rounded-lg p-2 bg-gray-100 transition cursor-pointer"
        style={{
          backgroundColor: listening ? "#fee2e2" : "#f3f4f6",
          color: listening ? "#dc2626" : undefined,
        }}
        onMouseEnter={(e) => {
          if (!listening) e.currentTarget.style.backgroundColor = tint20;
        }}
        onMouseLeave={(e) => {
          if (!listening) e.currentTarget.style.backgroundColor = "#f3f4f6";
        }}
        onClick={handleMicClick}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleMicClick()}
        role="button"
        tabIndex={0}
        aria-pressed={listening}
        aria-label="Voice input"
        title="Voice input"
      >
        <Mic
          size={20}
          className="md:h-[18px] md:w-[18px]"
          style={{ color: listening ? undefined : primaryColor }}
        />
      </div>

      {/* Submit (icon-only on mobile, keep form submit behavior) */}
<button
  type="submit"
  className="
    hidden sm:inline-flex
    items-center justify-center
    rounded-full        /* full round edges */
    px-5 py-2           /* enough horizontal padding to stretch it */
    text-sm font-medium
    text-white
    transition
  "
  style={{ backgroundColor: primaryColor }}
  disabled={isTyping || (!query.trim() && selectedImages.length === 0)}
>
  Send
</button>
    </div>
  </div>
</form>
      </div>

      {/* AUTH MODALS */}
      <LoginModal
        isOpen={modal === "login"}
        onClose={() => setModal(null)}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        onSubmit={handleLogin}
        onForgotPassword={() => setModal("user-forgot-password")}
        primaryColor={primaryColor}
      />

      <RegisterModal
        isOpen={modal === "register"}
        onClose={() => setModal(null)}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        middleInitial={middleInitial}
        setMiddleInitial={setMiddleInitial}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        onSubmit={handleRegister}
        primaryColor={primaryColor}
      />

      {modal === "user-forgot-password" && (
        <UserForgotPasswordModal
          onClose={() => setModal("login")}
          primaryColor={primaryColor}
        />
      )}
    </div>
  );
}
