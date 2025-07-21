import { useState, useEffect } from "react";
import { Mic, Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [modal, setModal] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeModal = () => setModal(null);

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

  useEffect(() => {
    const el = document.getElementById("chat-scroll");
    if (el) el.scrollTop = el.scrollHeight;
  }, [chatHistory]);

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
        <header className="flex justify-end gap-4 px-6 py-4">
          <button
            className="px-4 py-1 text-sm !bg-primary text-white rounded-full"
            onClick={() => setModal("login")}
          >
            Login
          </button>
          <button
            className="px-4 py-1 text-sm border !bg-white !border-primary text-primary rounded-full"
            onClick={() => setModal("register")}
          >
            Sign up
          </button>
        </header>

        {/* Chat Area */}
        <main id="chat-scroll" className="flex-grow overflow-y-auto relative">
          {!submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-1">
                Hello, Roca
              </h1>
              <p className="text-sm text-primary mb-6">What can I help you with?</p>
              <form
                onSubmit={handleSubmit}
                className="w-full max-w-md flex items-center border border-primary rounded-lg px-4 py-2 bg-gray-100 text-primary"
              >
                <Plus size={16} className="mr-2" />
                <input
                  className="flex-grow bg-transparent outline-none placeholder:text-primary/50"
                  placeholder="Ask Coby"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Mic size={16} />
              </form>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4 max-w-2xl mx-auto px-4 py-6 pb-24">
                {chatHistory.map((chat, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 text-left p-3 rounded-lg text-sm text-gray-800"
                  >
                    <span className="font-semibold text-primary">You:</span>{" "}
                    {chat.text}
                  </div>
                ))}
              </div>

              {/* Input Box */}
              <form
                onSubmit={handleSubmit}
                className="w-full max-w-xl px-4 py-2 absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center border border-primary rounded-lg bg-gray-100 text-primary"
              >
                <Plus size={16} className="mr-2" />
                <input
                  className="flex-grow bg-transparent outline-none placeholder:text-primary/50"
                  placeholder="Ask Coby"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Mic size={16} />
              </form>
            </>
          )}
        </main>
      </div>

      {/* Modals */}
{modal === "login" && (
  <Modal title="Login to your account" onClose={closeModal}>
    <form className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="login-email" className="text-sm font-medium text-primary">Email</label>
        <input id="login-email" type="email" className="border rounded p-2" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="login-password" className="text-sm font-medium text-primary">Password</label>
        <input id="login-password" type="password" className="border rounded p-2" />
      </div>
      <button type="submit" className="!bg-primary text-white py-2 rounded">
        Login
      </button>
    </form>
  </Modal>
)}
{modal === "register" && (
  <Modal title="Create an account" onClose={closeModal}>
    <form className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="register-name" className="text-sm font-medium text-primary ">Full Name</label>
        <input id="register-name" type="text" className="border rounded p-2" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="register-email" className="text-sm font-medium text-primary">Email</label>
        <input id="register-email" type="email" className="border rounded p-2" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="register-password" className="text-sm font-medium text-primary">Password</label>
        <input id="register-password" type="password" className="border rounded p-2" />
      </div>
      <button type="submit" className="!bg-primary text-white py-2 rounded">
        Register
      </button>
    </form>
  </Modal>
)}
    </div>
  );
}