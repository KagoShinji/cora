import { useState, useEffect } from "react";
import { Mic, Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [modal, setModal] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // NEW

  const closeModal = () => setModal(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() === "") return;

    setChatHistory([...chatHistory, { role: "user", text: query }]);
    setQuery("");
    setSubmitted(true);
  };

  useEffect(() => {
    const el = document.getElementById("chat-scroll");
    if (el) el.scrollTop = el.scrollHeight;
  }, [chatHistory]);

  return (
    <div className="flex h-screen w-screen bg-white text-gray-900 overflow-hidden">
      <div
        className={`absolute top-4 left-5 transition-all duration-300 text-red-800 font-serif text-3xl select-none`}
      >
        CORA
      </div>
      {/* Main Content */}
      <div className="flex-1 relative flex flex-col">
        {/* Header */}
        <header className="flex justify-end gap-4 px-6 py-4">
          <button
            className="px-4 py-1 text-sm bg-red-800 text-white rounded-full"
            onClick={() => setModal("login")}
          >
            Login
          </button>
          <button
            className="px-4 py-1 text-sm border border-red-800 text-red-800 rounded-full"
            onClick={() => setModal("register")}
          >
            Sign up
          </button>
        </header>

        {/* Main Chat or Welcome */}
        <main id="chat-scroll" className="flex-grow overflow-y-auto relative">
          {!submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-red-800 mb-1">
                CORA
              </h1>
              <form
                onSubmit={handleSubmit}
                className="w-full max-w-md flex items-center border border-red-400 rounded-lg px-4 py-2 bg-gray-100 text-red-800"
              >
                <Plus size={16} className="mr-2" />
                <input
                  className="flex-grow bg-transparent outline-none placeholder:text-red-300"
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
                    <span className="font-semibold text-red-800">You:</span>{" "}
                    {chat.text}
                  </div>
                ))}
              </div>

              {/* Input Box at Bottom */}
              <form
                onSubmit={handleSubmit}
                className="w-full max-w-xl px-4 py-2 absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center border border-red-400 rounded-lg bg-gray-100 text-red-800"
              >
                <Plus size={16} className="mr-2" />
                <input
                  className="flex-grow bg-transparent outline-none placeholder:text-red-300"
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
            <input
              type="email"
              placeholder="Email"
              className="border rounded p-2"
            />
            <input
              type="password"
              placeholder="Password"
              className="border rounded p-2"
            />
            <button
              type="submit"
              className="bg-red-800 text-white py-2 rounded"
            >
              Login
            </button>
          </form>
        </Modal>
      )}
      {modal === "register" && (
        <Modal title="Create an account" onClose={closeModal}>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="border rounded p-2"
            />
            <input
              type="email"
              placeholder="Email"
              className="border rounded p-2"
            />
            <input
              type="password"
              placeholder="Password"
              className="border rounded p-2"
            />
            <button
              type="submit"
              className="bg-red-800 text-white py-2 rounded"
            >
              Register
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
