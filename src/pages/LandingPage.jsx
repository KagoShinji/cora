import { useState, useEffect } from "react";
import { Mic, Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import { useAuthStore } from "../stores/userStores";
import { useAppSettingsStore } from "../stores/useSettingsStore";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [modal, setModal] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const closeModal = () => setModal(null);

  const signup = useAuthStore((state) => state.signup);
  const signin = useAuthStore((state) => state.signin);
  const error = useAuthStore((state) => state.error);
  const name = useAppSettingsStore((state) => state.name);
  const primaryColor = useAppSettingsStore((state)=>state.primary_color)

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

  const navigate = useNavigate()
  const handleLogin = async (e) => {
    e.preventDefault();
    const userData = {
      email,
      password,
    };
    
    try {
      const login = await signin(userData)
      if (!login) {
      alert("Invalid credentials");
      return;
    } else {
      alert("Login successfully");

    }
    switch(login.user.role){
      case 'user':
        navigate('/user/chat')
        break
      default:
        alert('Unauthorized role or unknown user.');
    }
    } catch (error) {

    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const userData = {
      name: username,
      email,
      password,
    };
    try {
      const response = await signup(userData);
      if (!response.ok) {
        console.log("Something went wrong please try again", error);
      }
      alert("Created account successfully");
    } catch (err) {
      throw Error("Something went wrong please try again:", err);
    }
  };

  useEffect(() => {
    const el = document.getElementById("chat-scroll");
    if (el) el.scrollTop = el.scrollHeight;
  }, [chatHistory]);

  return (
    <div className="flex h-screen w-screen bg-white text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        onNewChat={handleNewChat}
      />

      {/* Logo */}
      <div
        className="fixed top-4 z-50 transition-all duration-300 text-primary font-bold text-xl select-none"
        style={{
          left: sidebarOpen ? "12rem" : "5rem",
          pointerEvents: "none",
        }}
      >
        {name.toUpperCase()}
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
                  className="flex-grow bg-transparent outline-none placeholder:text-primary/50"
                  placeholder={`Ask ${name.toUpperCase()}`}
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
                  placeholder="Ask Cora"
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
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="login-email"
                className="text-sm font-medium text-primary"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                className="border rounded p-2"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="login-password"
                className="text-sm font-medium text-primary"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                className="border rounded p-2"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <button
              type="submit"
              className="!bg-primary text-white py-2 rounded"
            
            >
              Login
            </button>
          </form>
        </Modal>
      )}
      {modal === "register" && (
        <Modal title="Create an account" onClose={closeModal}>
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="register-name"
                className="text-sm font-medium text-primary "
              >
                Full Name
              </label>
              <input
                id="register-name"
                type="text"
                className="border rounded p-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="register-email"
                className="text-sm font-medium text-primary"
              >
                Email
              </label>
              <input
                id="register-email"
                type="email"
                className="border rounded p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="register-password"
                className="text-sm font-medium text-primary"
              >
                Password
              </label>
              <input
                id="register-password"
                type="password"
                className="border rounded p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="!bg-primary text-white py-2 rounded"
            >
              Register
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
