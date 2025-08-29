import { Menu, FilePen } from "lucide-react";
import { useAppSettingsStore } from "../stores/useSettingsStore";

export default function Sidebar({ open, setOpen, onNewChat }) {
  const primaryColor = useAppSettingsStore((state)=>state.primary_color)
  return (
    <aside
      className={`${
        open ? "w-64" : "w-16"
      }  text-white flex flex-col transition-all duration-300 ease-in-out h-full`}
      style={{ backgroundColor: primaryColor || "#1D4ED8" }}
    >
      {/* Toggle Button */}
      <div className="flex items-center justify-start px-4 py-4">
        <Menu onClick={() => setOpen(!open)} className="cursor-pointer w-5 h-5 text-white" />
      </div>

      {/* New Chat */}
      <div
        className="flex items-center gap-2 cursor-pointer px-4 py-2 hover:bg-primary transition"
        onClick={onNewChat}
      >
        <FilePen size={18} className="text-white" />
        {open && <span className="font-semibold text-white">New Chat</span>}
      </div>

      {/* Chat History */}
    </aside>
  );
}
