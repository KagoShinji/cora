import { useEffect, useRef, useState } from "react";
import { Mic, Plus } from "lucide-react";
import SidebarUser from "../../components/SidebarUser"; // ⬅️ use your SidebarUser
import { useAuthStore } from "../../stores/userStores";
import { useAppSettingsStore } from "../../stores/useSettingsStore";
import { generateAnswer } from "../../api/api";

export default function UserChat() {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // start open by default
  const [isTyping, setIsTyping] = useState(false);
  const name = useAppSettingsStore((state) => state.name);
  const currentUser = useAuthStore((s) => s.currentUser);

  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  // ---- Handlers ------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || isTyping) return;

    appendMessage({ role: "user", text: trimmed });
    setQuery("");
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
          if (last.role === "assistant") {
            last.text = streamedAnswer;
          }
          return [...updated.slice(0, -1), last];
        });
      });
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

  const appendMessage = (msg) =>
    setChatHistory((prev) => [...prev, msg]);

  const handleNewChat = () => {
    setQuery("");
    setChatHistory([]);
    setSubmitted(false);
    setIsTyping(false);
    inputRef.current?.focus();
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      setQuery("");
    }
  };

  // ---- Effects -------------------------------------------------------------
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatHistory, isTyping]);

  // ---- UI ------------------------------------------------------------------
  return (
    <div className="flex h-screen w-screen bg-white text-gray-900 overflow-hidden">
      {/* SidebarUser integration */}
      <SidebarUser
        isOpen={sidebarOpen}
        setOpen={setSidebarOpen}
        onNewChat={handleNewChat}
      />

      {/* Logo */}
      <div
        className="fixed top-4 z-50 transition-all duration-300 text-primary font-bold text-xl select-none"
        style={{
          left: sidebarOpen ? "17rem" : "5rem",
          pointerEvents: "none",
        }}
      >
        {name.toUpperCase()}
      </div>

      {/* Main Content */}
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
              <form
                onSubmit={handleSubmit}
                className="w-full max-w-md flex items-center border border-primary rounded-lg px-4 py-2 bg-gray-100 text-primary"
              >
                <Plus size={16} className="mr-2" />
                <input
                  ref={inputRef}
                  className="flex-grow bg-transparent outline-none placeholder:text-primary/50"
                  placeholder={`Ask ${name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}`}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  disabled={isTyping}
                />
                <Mic size={16} />
              </form>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-w-2xl mx-auto">
              {chatHistory.map((chat, idx, arr) => {
                const isCoraTyping =
                  chat.role === "assistant" &&
                  isTyping &&
                  chat.text === "";

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
                    {isCoraTyping
                      ? "CORA is typing…"
                      : chat.text?.trim()
                      ? chat.text.replace(/\*\*/g, "")
                      : "[No response received]"}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Input Box */}
        {(submitted || chatHistory.length > 0) && (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl px-4 py-2 flex items-center border border-primary rounded-lg bg-gray-100 text-primary mx-auto mb-4"
          >
            <Plus size={16} className="mr-2" />
            <input
              ref={inputRef}
              className="flex-grow bg-transparent outline-none placeholder:text-primary/50 disabled:opacity-60"
              placeholder="Ask Cora"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={isTyping}
            />
            <Mic size={16} />
          </form>
        )}
      </div>
    </div>
  );
}
