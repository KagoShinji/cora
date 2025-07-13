import { Menu } from "lucide-react";

export default function Sidebar({ open, setOpen }) {
  return (
    <aside
      className={`${
        open ? "w-48" : "w-16"
      } bg-red-800 text-white flex flex-col transition-all duration-300 ease-in-out h-full`}
    >
      {/* Top - Menu Icon */}
      <div className="flex items-center justify-center p-4">
        <Menu
          onClick={() => setOpen(!open)}
          className="cursor-pointer w-5 h-5"
        />
      </div>

      {/* Menu Items */}
      <div className="flex flex-col mt-4 px-2">
        <ul className={`space-y-3 text-sm ${open ? "pl-2" : "pl-0"} transition-all`}>
          <li
            className={`cursor-pointer hover:underline ${
              open ? "text-left" : "text-center"
            }`}
          >
            Dashboard
          </li>
          <li
            className={`cursor-pointer hover:underline ${
              open ? "text-left" : "text-center"
            }`}
          >
            Settings
          </li>
          <li
            className={`cursor-pointer hover:underline ${
              open ? "text-left" : "text-center"
            }`}
          >
            Logout
          </li>
        </ul>
      </div>
    </aside>
  );
}
