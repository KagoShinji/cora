import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSettingsStore } from "../stores/useSettingsStore";
import { useAuthStore } from '../stores/userStores';
import { resetPasswordRequest } from "../api/api";


const credentialsMap = {
  'superadmin@gmail.com': { password: "super123", role: "superadmin", path: "/superadmin" },
  'cosuperadmin@gmail.com': { password: "co123", role: "co-superadmin", path: "/cosuperadmin" },
  'admincreator@gmail.com': { password: "creator123", role: "admin-creator", path: "/admincreator" },
  'adminapprover@gmail.com': { password: "admin123", role: "admin-approver", path: "/adminapprover" },
};


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const logoPath = useAppSettingsStore((state) => state.logo_path)
  const appName = useAppSettingsStore((state)=>state.name)
  const primaryColor = useAppSettingsStore((s)=>s.primary_color)
  const secondaryColor = useAppSettingsStore((s)=>s.secondary_color)

  const navigate = useNavigate();

  const signin = useAuthStore((state) => state.signin);

  const handleLogin = async (e) => {
    e.preventDefault();
    const users = credentialsMap[email];

    if (users && users.password === password) {
      navigate(users.path);
      return;
    }

    const userData = {
      email: email,
      password: password
    };

    const login = await signin(userData);

    if (!login) {
      alert("Invalid credentials");
      return;
    } else {
      alert("Login successfully");

    }
    switch (login.user.role) {
      case 'superadmin':
        navigate('/superadmin');
        break;
      case 'co-superadmin':
        navigate('/cosuperadmin');
        break;
      case 'admincreator':
        navigate('/admincreator');
        break;
      case 'adminapprover':
        navigate('/adminapprover');
        break;
      case 'user':
        navigate('/users')
      default:
        alert('Unauthorized role or unknown user.');
    }
  };

  const handleForgotSubmit = async () => {
  if (!forgotEmail) {
    alert("Please enter your email.");
    return;
  }

  try {
    await resetPasswordRequest(forgotEmail);
    alert(`Password reset instructions sent to: ${forgotEmail}`);
    setForgotEmail("");
    setShowForgotModal(false);
  } catch (error) {
    console.error(error);
    alert(error.message || "Failed to send password reset email");
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

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl border">
            <h2 className="text-2xl font-bold mb-4 text-primary text-center">Forgot Password</h2>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Enter your email to receive password reset instructions.
            </p>
            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-primary rounded-md px-4 py-2 text-primary outline-none focus:ring-1 focus:ring-primary mb-4"
              required
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 !bg-white text-primary border !border-primary rounded-md hover:bg-primary/10 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleForgotSubmit}
                className="px-4 py-2 !bg-primary text-white rounded-md hover:bg-primary/90 transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Centered login card */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="bg-white/90 backdrop-blur-lg p-8 sm:p-10 rounded-2xl shadow-2xl max-w-md w-full text-center text-black">
          {/* School Logo */}
          <div className="mb-6">
            <img
              src={logoPath ? `http://127.0.0.1:8000${logoPath}` : "/school-logo.png"}
              alt="School Logo"
              className="w-40 h-40 mx-auto object-contain rounded-full border shadow-md border-primary"
            />
            <h2 style={{ color: primaryColor }} className="mt-4 text-5xl font-extrabold tracking-tight">{appName}</h2>
            <p style={{color:secondaryColor}} className="text-lg text-primary mt-1">Admin Portal</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">
            <div>
              <label style={{color:secondaryColor}} className="block text-sm font-medium  mb-1">Email</label>
              <input
                type="text"
                placeholder="Enter your email"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{color:secondaryColor}} className="block text-sm font-medium  mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="text-sm text-right mt-1">
                <p
  onClick={() => setShowForgotModal(true)}
  className="text-sm  hover:underline cursor-pointer text-right mt-1"
  style={{color:secondaryColor}}
>
  Forgot Password?
</p>
              </div>
            </div>
            <button
              type="submit"
              style={{backgroundColor:primaryColor}}
              className=" text-white py-2 rounded font-semibold hover:bg-primary transition"
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
