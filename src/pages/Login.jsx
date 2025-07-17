import { useState } from "react";
import { useNavigate } from "react-router-dom";

const credentialsMap = {
  superadmin: { password: "super123", path: "/superadmin" },
  cosuperadmin: { password: "co123", path: "/cosuperadmin" },
  admincreator: { password: "creator123", path: "/admincreator" },
  adminapprover: { password: "admin123", path: "/adminapprover" },
};

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = credentialsMap[username];

    if (user && user.password === password) {
      navigate(user.path);
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src="/bg-image.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />
      </div>

      {/* Centered login card */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="bg-white/90 backdrop-blur-lg p-8 sm:p-10 rounded-2xl shadow-2xl max-w-md w-full text-center text-black">
          {/* School Logo */}
          <div className="mb-6">
            <img
              src="/school-logo.png"
              alt="School Logo"
              className="w-40 h-40 mx-auto object-contain rounded-full border shadow-md"
            />
            <h2 className="mt-4 text-5xl font-extrabold text-red-800 tracking-tight">CORA</h2>
            <p className="text-lg text-gray-600 mt-1">Admin Portal</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800 text-black"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800 text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-red-800 text-white py-2 rounded font-semibold hover:bg-red-700 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
