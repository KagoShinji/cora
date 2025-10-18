// src/components/Sidebar.jsx
import { useEffect } from "react";
import { Menu, FilePen } from "lucide-react";
import { useAppSettingsStore } from "../stores/useSettingsStore";

export default function Sidebar({
  open,
  setOpen,
  onNewChat,
  isMobile = false, // optional, safe default
}) {
  const primaryColor = useAppSettingsStore((state) => state.primary_color);
  

  // Close on Escape (mobile drawer)
  useEffect(() => {
    if (!isMobile || !open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobile, open, setOpen]);

  const bgColor = primaryColor || "#1D4ED8";

  // Build classes per mode to keep smooth animations in both cases
  const asideClasses = [
    "fixed top-0 left-0 h-screen z-50 text-white flex flex-col ease-in-out",
    // Use transform-only animation on mobile; width animation on desktop
    isMobile ? "transition-transform duration-300" : "transition-all duration-300",
    isMobile
      ? // Mobile: off-canvas drawer
        `w-64 transform ${open ? "translate-x-0" : "-translate-x-full"}`
      : // Desktop: original collapse behavior
        `${open ? "w-64" : "w-16"}`
  ].join(" ");

  return (
    <>
      {/* Mobile backdrop (tap to close) */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        style={{ backgroundColor: bgColor, willChange: "transform" }}
        className={asideClasses}
        role={isMobile ? "dialog" : undefined}
        aria-modal={isMobile ? true : undefined}
        aria-label="Sidebar"
      >
        {/* Toggle */}
        <div className="flex items-center justify-start px-4 py-4">
          <Menu
            onClick={() => setOpen(!open)}
            className="cursor-pointer w-5 h-5 text-white"
            role="button"
            tabIndex={0}
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
            aria-pressed={open}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setOpen(!open);
            }}
            title={open ? "Collapse" : "Expand"}
          />
        </div>

        {/* New Chat */}
        <div
          className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-200/20 rounded transition mx-2"
          onClick={() => {
            onNewChat?.();
            if (isMobile) setOpen(false); // close drawer after action on mobile
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onNewChat?.();
              if (isMobile) setOpen(false);
            }
          }}
          aria-label="Start a new chat"
          title="New Chat"
        >
          <FilePen size={18} className="text-white" />
          {(isMobile || open) && <span className="font-semibold text-white">New Chat</span>}
        </div>

        {/* (Add chat history here if needed; visibility can follow (isMobile || open)) */}
      </aside>
    </>
  );
}
