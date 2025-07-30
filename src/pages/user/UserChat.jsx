import { useEffect, useRef, useState } from "react";
import { Mic, Plus } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { useAuthStore } from "../../stores/userStores";

export default function UserChat() {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // [{ role: "user" | "assistant", text: string }]
  const [submitted, setSubmitted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  // Optional: show the logged-in user's name/email
  const currentUser = useAuthStore((s) => s.currentUser); // adjust selector if different

  // ---- Helpers -------------------------------------------------------------

  // Fake/placeholder answer — replace with your API call
  const mockAnswer = async (userText) => {
    // Simulate latency
    await new Promise((r) => setTimeout(r, 900));
    return `You said: "${userText}". This is a placeholder reply. Replace mockAnswer() with your real API.`;
  };

  const appendMessage = (msg) =>
    setChatHistory((prev) => [...prev, msg]);

  // ---- Handlers ------------------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || isTyping) return;

    // show user's message
    appendMessage({ role: "user", text: trimmed });
    setQuery("");
    setSubmitted(true);

    // get assistant response
    try {
      setIsTyping(true);
      const answer = await mockAnswer(trimmed);
      appendMessage({ role: "assistant", text: answer });
    } catch (err) {
      appendMessage({
        role: "assistant",
        text: "Sorry, something went wrong while generating a response.",
      });
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    setQuery("");
    setChatHistory([]);
    setSubmitted(false);
    setIsTyping(false);
    inputRef.current?.focus();
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      // Clear draft quickly
      setQuery("");
    }
  };

  // ---- Effects -------------------------------------------------------------

  // Auto-focus on first render
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Auto-scroll when chat updates
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatHistory, isTyping]);

  // ---- UI ------------------------------------------------------------------

  return (
    <div className="flex h-screen w-screen bg-white text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} onNewChat={handleNewChat} />

      {/* Logo */}
      <div
        className="fixed top-4 z-50 transition-all duration-300 text-primary font-bold text-xl select-none"
        style={{
          left: sidebarOpen ? "12rem" : "5rem",
          pointerEvents: "none",
        }}
      >
        CORA
      </div>

      {/* Main Content */}
      <div className="flex-1 relative flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4">

          {/* Optional user chip */}
          {currentUser && (
            <div className="flex items-center gap-3">
              <div className="text-right leading-tight">
                <div className="text-sm font-semibold text-primary">
                  {currentUser.name || currentUser.email || "User"}
                </div>
                {currentUser.email && (
                  <div className="text-xs text-primary/70">{currentUser.email}</div>
                )}
              </div>
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">
                {(currentUser.name || currentUser.email || "U").charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </header>

        {/* Chat Area */}
        <main ref={scrollRef} id="chat-scroll" className="flex-grow overflow-y-auto relative">
          {!submitted && chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-1">Hello!</h1>
              <p className="text-sm text-primary mb-6">What can I help you with?</p>
              <form
                onSubmit={handleSubmit}
                className="w-full max-w-md flex items-center border border-primary rounded-lg px-4 py-2 bg-gray-100 text-primary"
              >
                <Plus size={16} className="mr-2" />
                <input
                  ref={inputRef}
                  className="flex-grow bg-transparent outline-none placeholder:text-primary/50"
                  placeholder="Ask Cora"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                />
                <Mic size={16} />
              </form>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3 max-w-2xl mx-auto px-4 py-6 pb-28">
                {chatHistory.map((chat, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg text-sm ${
                      chat.role === "user"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <span className="font-semibold">
                      {chat.role === "user" ? "You" : "CORA"}:
                    </span>{" "}
                    {chat.text}
                  </div>
                ))}

                {isTyping && (
                  <div className="p-3 rounded-lg text-sm bg-primary/10 text-primary animate-pulse">
                    CORA is typing…
                  </div>
                )}
              </div>

              {/* Input Box */}
              <form
                onSubmit={handleSubmit}
                className="w-full max-w-xl px-4 py-2 absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center border border-primary rounded-lg bg-gray-100 text-primary"
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
            </>
          )}
        </main>
      </div>
    </div>
  );
}
