import { useState } from "react";
import SidebarCoSuperAdmin from "../../components/SidebarCoSuperAdmin";
import { useAppSettingsStore } from "../../stores/useSettingsStore";
import ChangeNameModal from "../../components/ChangeNameModal";

function CoSuperAdminThemes() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const changeLogo = useAppSettingsStore((state) => state.changeLogo)

  const getSettings = useAppSettingsStore((state)=>state.getSettings)
  const logoPath = useAppSettingsStore((state) => state.logo_path)
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const changeName = useAppSettingsStore((state) => state.changeName);
  const name = useAppSettingsStore((state) => state.name);
  const primaryColor = useAppSettingsStore((state) => state.primary_color);
  const secondaryColor = useAppSettingsStore((state) => state.secondary_color);
  const changeColor = useAppSettingsStore((state) => state.changeColor);

  const [selectedPrimary, setSelectedPrimary] = useState(primaryColor || "#007bff");
  const [selectedSecondary, setSelectedSecondary] = useState(secondaryColor || "#6c757d");

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
        <h1 style={{color:primaryColor}} className="text-3xl font-bold  mb-8">Themes</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
          {/* Logo Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs h-72 flex flex-col items-center justify-between">
            <h2  className="text-xl font-semibold !text-primary   ">Logo</h2>
            <img
            src={logoPath ? `http://127.0.0.1:8000${logoPath}` : "/school-logo.png"}
            alt="School Logo"
            className="w-24 h-24 object-contain rounded-full"
          />
                      <input
                        id="logoUpload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            changeLogo(file)
                          }
                        }}
                      />
            <button
                style={{backgroundColor:primaryColor}}
                className=" !text-white px-4 py-2 rounded-md hover:!bg-gray-800 transition-colors"
                onClick={() => document.getElementById('logoUpload')?.click()}
              >
                Change
            </button>
          </div>

          {/* Name Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs h-72 flex flex-col items-center justify-between">
            <h2  className="text-xl !text-primary font-semibold">Name</h2>
            <div style={{color:primaryColor}} className="text-2xl font-bold  uppercase">{name}</div>
            <button
              style={{backgroundColor:primaryColor}}
                className=" !text-white px-4 py-2 rounded-md hover:!bg-gray-800 transition-colors"
                onClick={() => setIsNameModalOpen(true)}
              >
                Change
            </button>
          </div>

          {/* Theme Color Card */}
<div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs h-72 flex flex-col items-center justify-between">
  <h2  className="text-xl font-semibold text-primary mb-2">Themes</h2>

  <div className="flex gap-4">
    {/* Primary Color Picker */}
    <div className="relative">
      <button
        style={{backgroundColor:primaryColor}}
        onClick={() => document.getElementById("primaryColorPicker").click()}
        className=" text-white px-4 py-2 rounded"
      >
        Primary
      </button>
      <input
        id="primaryColorPicker"
        type="color"
        value={selectedPrimary}
        className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer"
        onChange={(e) => setSelectedPrimary(e.target.value)}
      />
    </div>

    {/* Secondary Color Picker */}
    <div className="relative">
      <button
        onClick={() => document.getElementById("secondaryColorPicker").click()}
        className="!bg-white border !border-primary text-primary px-4 py-2 rounded"
      >
        Secondary
      </button>
      <input
        id="secondaryColorPicker"
        type="color"
        value={selectedSecondary}
        className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer"
        onChange={(e) => setSelectedSecondary(e.target.value)}
      />
    </div>
  </div>

  <button
    style={{backgroundColor:primaryColor}}
    className=" !text-white px-4 py-2 rounded-md hover:!bg-gray-800 transition-colors"
    onClick={() => changeColor(selectedPrimary, selectedSecondary)}
  >
    Apply
  </button>
</div>
        </div>
      </main>
      <ChangeNameModal
  isOpen={isNameModalOpen}
  onClose={() => setIsNameModalOpen(false)}
  onSave={async (newName) => {
    await changeName(newName); 
    setIsNameModalOpen(false);
  }}
/>
    </div>
    
  );
}

export default CoSuperAdminThemes;