import { useState } from "react";
import SidebarCoSuperAdmin from "../../components/SidebarCoSuperAdmin";

function CoSuperAdminThemes() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 h-screen fixed top-0 left-0 z-40 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <SidebarCoSuperAdmin isOpen={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main content */}
      <main
        className={`transition-all duration-300 p-8 overflow-y-auto bg-gray-100 ${
          sidebarOpen ? "ml-64" : "ml-16"
        } w-full`}
      >
        <h1 className="text-3xl font-bold text-red-800 mb-8">Themes</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
          {/* Logo Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs h-72 flex flex-col items-center justify-between">
            <h2 className="text-xl font-semibold text-black">Logo</h2>
            <img
              src="/school-logo.png"
              alt="School Logo"
              className="w-24 h-24 object-contain"
            />
            <button className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 transition">
              Change
            </button>
          </div>

          {/* Name Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs h-72 flex flex-col items-center justify-between">
            <h2 className="text-xl font-semibold text-black">Name</h2>
            <div className="text-2xl font-bold text-black">CORA</div>
            <button className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 transition">
              Change
            </button>
          </div>

          {/* Theme Color Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs h-72 flex flex-col items-center justify-between">
            <h2 className="text-xl font-semibold text-black mb-2">Themes</h2>
            <div className="flex gap-4">
              <button className="bg-red-800 text-white px-4 py-2 rounded">
                Primary
              </button>
              <button className="border border-red-800 text-red-800 px-4 py-2 rounded bg-white">
                Secondary
              </button>
            </div>
            <button className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 transition">
              Change
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CoSuperAdminThemes;