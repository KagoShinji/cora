import { Menu, FilePen } from "lucide-react";

export default function Sidebar({ open, setOpen, onNewChat }) {
  return (
    <aside
      className={`${
        open ? "w-64" : "w-16"
      } bg-red-800 text-white flex flex-col transition-all duration-300 ease-in-out h-full`}
    >
      {/* Toggle Button */}
      <div className="flex items-center justify-start px-4 py-4">
        <Menu onClick={() => setOpen(!open)} className="cursor-pointer w-5 h-5 text-white" />
      </div>

      {/* New Chat */}
      <div
        className="flex items-center gap-2 cursor-pointer px-4 py-2 hover:bg-red-700 transition"
        onClick={onNewChat}
      >
        <FilePen size={18} className="text-white" />
        {open && <span className="font-semibold text-white">New Chat</span>}
      </div>

      {/* Chat History */}
      {open && (
        <div className="flex flex-col px-2 mt-4 overflow-y-auto">
          <ul className="space-y-2 text-sm pl-2">
            {[
              "Tuition Fee Inquiry",
              "Enrollment Requirements",
              "Class Schedule",
              "Scholarship Info",
              "Subject Pre-requisites",
            ].map((chat, idx) => (
              <li
                key={idx}
                className="cursor-pointer truncate rounded p-2 hover:bg-red-700 text-left text-white"
              >
                {chat}
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
