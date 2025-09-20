// src/pages/LandingPage.jsx
import { useState, useEffect, useMemo } from "react";
import { Mic, Plus, Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useAuthStore } from "../stores/userStores";
import { useAppSettingsStore } from "../stores/useSettingsStore";
import { useNavigate } from "react-router-dom";
import UserForgotPasswordModal from "../components/UserForgotPasswordModal";
import LoginModal from "../components/auth/LoginModal";
import { RegisterModal } from "../components/auth/RegisterModal";

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [modal, setModal] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [middleInitial,setMiddleInitial] = useState("")
  const [loading, setLoading] = useState(true);



  const closeModal = () => setModal(null);

  const signup = useAuthStore((state) => state.signup);
  const signin = useAuthStore((state) => state.signin);
  const error = useAuthStore((state) => state.error);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const getSettings = useAppSettingsStore((state) => state.getSettings);


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

  // Desktop: 17rem/5rem; Mobile: overlay => 0
  const sidebarOffset = useMemo(
    () => (isMobile ? "0" : sidebarOpen ? "17rem" : "5rem"),
    [isMobile, sidebarOpen]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() === "") return;
    setChatHistory([...chatHistory, { role: "user", text: query }]);
    setQuery("");
    setSubmitted(true);
  };

  const handleNewChat = () => {
    setQuery("");
    setChatHistory([]);
    setSubmitted(false);
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
        <main id="chat-scroll" className="flex-grow overflow-y-auto relative">
          {!submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <h1
                className="text-3xl sm:text-4xl font-bold mb-1"
                style={{ color: primaryColor }}
              >
                Hello!
              </h1>
              <p className="text-sm mb-6" style={{ color: primaryColor }}>
                What can I help you with?
              </p>

              {/* Intro input: responsive full-width on phones, capped on larger */}
              <form
                onSubmit={handleSubmit}
                className="
                  w-full
                  max-w-full sm:max-w-md
                  flex items-center gap-2
                  rounded-full
                  px-3 py-1.5
                  bg-gray-100
                  border
                "
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                <Plus size={18} className="shrink-0" style={{ color: primaryColor }} />
                <input
                  className="flex-grow min-w-0 bg-transparent outline-none text-sm md:text-base py-1"
                  placeholder={`Ask ${name}`}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ color: primaryColor }}
                />
                <Mic size={18} className="shrink-0" style={{ color: primaryColor }} />
              </form>
            </div>
          ) : (
            <>
              {/* Messages get extra bottom padding so fixed composer won't overlap */}
              <div className="flex flex-col gap-4 max-w-2xl mx-auto px-4 py-6 pb-36">
                {chatHistory.map((chat, index) => (
                  <div
                    key={index}
                    className="text-left p-3 rounded-lg text-sm"
                    style={{ backgroundColor: `${primaryColor}15`, color: "#333" }}
                  >
                    <span className="font-semibold" style={{ color: primaryColor }}>
                      You:
                    </span>{" "}
                    {chat.text}
                  </div>
                ))}
              </div>

              {/* Fixed composer pinned to bottom */}
              <form
                onSubmit={handleSubmit}
                className="
                  fixed left-0 right-0 bottom-0 z-50
                  w-full
                  px-3 md:px-4 py-2
                "
                style={{
                  // sit above mobile home indicator (safe-area)
                  paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.5rem)",
                }}
              >
                <div
                  className="
                    mx-auto
                    w-full
                    max-w-full sm:max-w-xl md:max-w-2xl
                    rounded-full
                    bg-gray-100
                    border
                    flex items-center gap-2
                    px-3 py-1.5
                  "
                  style={{ borderColor: primaryColor, color: primaryColor }}
                >
                  <Plus size={18} className="shrink-0" style={{ color: primaryColor }} />
                  <input
                    className="
                      flex-grow min-w-0
                      bg-transparent outline-none
                      text-sm md:text-base
                      py-1
                    "
                    placeholder="Ask Cora"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ color: primaryColor }}
                  />
                  <Mic size={18} className="shrink-0" style={{ color: primaryColor }} />
                </div>
              </form>
            </>
          )}
        </main>
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
