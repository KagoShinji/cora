import { FilePen, Menu, Star, XIcon, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/userStores";
import { useAppSettingsStore } from "../stores/useSettingsStore";
import { fetchConversations,submitSatisfactionReview } from "../api/api";
import toast from "react-hot-toast";

// ✅ Accept isMobile with a safe default (won't break older callers)
function SidebarUser({
  isOpen,
  setOpen,
  onNewChat,
  onSelectChat,
  currentConversationId,
  sidebarRefreshKey,
  isMobile = false, // ← NEW, default false for backward compatibility
}) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSatisfactionModal, setShowSatisfactionModal] = useState(false);
  //const [hasShownSatisfaction, setHasShownSatisfaction] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const getSettings = useAppSettingsStore((s) => s.getSettings);

  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const signout = useAuthStore((state) => state.signout);

  const primaryColor = useAppSettingsStore((s) => s.primary_color);


  useEffect(() => {
    getSettings(); 
  }, [getSettings]);
  
  useEffect(() => {
    const getConversations = async () => {
      try {
        setIsLoading(true);
        const data = await fetchConversations();
        setConversations(data);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getConversations();
  }, [sidebarRefreshKey]);

  const handleLogout = async () => {
    await signout();
    navigate("/");
  };

  const handleNewChatClick = () => {
    setShowSatisfactionModal(true); // ✅ Always show modal
    onNewChat();
  };

  // Auto-close drawer on mobile after selecting a chat
  const handleSelectConversation = (id) => {
    onSelectChat(id);
    if (isMobile) setOpen(false);
  };
const bgColor = primaryColor ?? "transparent";
  return (
    <>
    
      {/* Mobile backdrop (tap to close) */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        style={{backgroundColor:bgColor}}
        className={[
          "fixed top-0 left-0 h-screen z-50 transition-all duration-300 ease-in-out flex flex-col",
          isMobile
            ? // Mobile: off-canvas drawer (no width collapse)
              `w-64 transform ${isOpen ? "translate-x-0" : "-translate-x-full"}`
            : // Desktop: original collapsible widths
              `${isOpen ? "w-64" : "w-16"}`
        ].join(" ")}
        role={isMobile ? "dialog" : undefined}
        aria-modal={isMobile ? true : undefined}
        aria-label="Conversations sidebar"
      >
        <div className="flex items-center justify-start p-4">
          <Menu
            onClick={() => setOpen(!isOpen)}
            className="cursor-pointer w-5 h-5 text-white"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          />
        </div>

        {/* Search: always visible on mobile; collapses on desktop */}
        <div
          className={[
            "px-4 mb-2 transition-all duration-300 ease-in-out overflow-hidden",
            isMobile ? "h-10 opacity-100" : isOpen ? "h-10 opacity-100" : "h-0 opacity-0",
          ].join(" ")}
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 rounded bg-white text-black text-sm focus:outline-none focus:ring-1 focus:ring-white"
          />
        </div>

        <nav className="flex flex-col gap-2 p-2 text-white">
          <div
            className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-200/20 transition"
            onClick={handleNewChatClick}
          >
            <FilePen size={18} className="text-white" />
            {(isMobile || isOpen) && <span className="font-semibold">New Chat</span>}
          </div>
        </nav>

        {/* Conversations list */}
        {(isMobile || isOpen) && (
          <div className="flex flex-col !text-white px-2 mt-2 overflow-y-auto sidebar-scroll">
            <ul className="space-y-2 text-sm pl-2">
              {isLoading ? (
                <li>Loading chats...</li>
              ) : conversations.length > 0 ? (
                conversations
                  .filter((chat) =>
                    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((chat) => (
                    <li
                      key={chat.id}
                      onClick={() => handleSelectConversation(chat.id)}
                      className={`cursor-pointer truncate rounded p-2 text-left ${
                        chat.id === currentConversationId
                          ? "bg-red-800"
                          : "hover:bg-red-800"
                      }`}
                    >
                      {chat.title}
                    </li>
                  ))
              ) : (
                <li>No conversations found.</li>
              )}
            </ul>
          </div>
        )}

{/* Footer card */} 
{(isMobile || isOpen) && (
  <div className="mt-auto px-2 pb-4"style={{backgroundColor:secondaryColor}}>
    <div
      onClick={() => setShowLogoutModal(true)}
      className="rounded-lg shadow p-4 cursor-pointer hover:bg-gray-50 transition"
      style={{
        backgroundColor: "#ffffff",
        color: primaryColor || "#B91C1C",   // ✅ Text color from primaryColor
      }}
    >
      <div className="font-semibold uppercase">
        {user || "Guest"}
      </div>
      <div className="text-sm opacity-80">User</div>
    </div>
  </div>
)}
      </aside>

      {/* Logout Modal (modern, X icon close) */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            aria-describedby="logout-desc"
            className="relative w-[90%] max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 p-6 sm:p-8"
            style={{ "--pc": primaryColor || "#B91C1C" }}
          >
            <div
              className="absolute inset-x-0 -top-px h-[2px]"
              style={{ background: "linear-gradient(90deg,transparent,var(--pc),transparent)" }}
            />
            <XIcon
              onClick={() => setShowLogoutModal(false)}
              className="absolute right-3 top-3 h-6 w-6 cursor-pointer hover:opacity-80"
              style={{ color: primaryColor || "#B91C1C" }}
              role="button"
              tabIndex={0}
              aria-label="Close"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setShowLogoutModal(false);
              }}
            />
            <div className="space-y-4 sm:space-y-5">
              <h2 id="logout-title" className="text-xl sm:text-2xl font-semibold !text-[var(--pc)]">
                Confirm Logout
              </h2>
              <p id="logout-desc" className="text-neutral-700">
                Are you sure you want to log out?
              </p>
              <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  type="button"
                  className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 border !bg-white text-sm font-medium transition hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 !border-[var(--pc)] !text-[var(--pc)]"
                  style={{ "--tw-ring-color": "var(--pc)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  type="button"
                  className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold shadow-md transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 !bg-[var(--pc)] !text-white"
                  style={{ "--tw-ring-color": "var(--pc)" }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

{/* ✅ Satisfaction Modal (spinner added) */}
      {showSatisfactionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="satisfaction-title"
            aria-describedby="satisfaction-desc"
            className="relative w-[90%] max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 p-6 sm:p-8 text-center"
            style={{ "--pc": primaryColor || "#B91C1C" }}
          >
            <div
              className="absolute inset-x-0 -top-px h-[2px]"
              style={{
                background:
                  "linear-gradient(90deg,transparent,var(--pc),transparent)",
              }}
            />

            <h2
              id="satisfaction-title"
              className="text-xl sm:text-2xl font-semibold mb-2 !text-[var(--pc)]"
            >
              Rate Your Experience
            </h2>
            <p id="satisfaction-desc" className="text-neutral-600 mb-6">
              How accurate and relevant was this conversation?
            </p>

            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={32}
                  className={`cursor-pointer transition ${
                    star <= (hoverRating || rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => setShowSatisfactionModal(false)}
                type="button"
                className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 border !bg-white text-sm font-medium transition hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  borderColor: "var(--pc)",
                  color: "var(--pc)",
                  "--tw-ring-color": "var(--pc)",
                }}
                disabled={isSubmitting} // ✅ Prevent skip while submitting
              >
                Skip
              </button>

              <button
                onClick={async () => {
                  if (rating === 0 || isSubmitting) return;
                  try {
                    setIsSubmitting(true); // ✅ start spinner
                    await submitSatisfactionReview(rating);
                    console.log("Rating submitted:", rating);
                    toast.success("Thank you for your feedback!");
                    setShowSatisfactionModal(false);
                  } catch (error) {
                    console.error("Failed to submit rating:", error);
                    toast.error(
                      error.message ||
                        "Failed to submit rating. Please try again."
                    );
                  } finally {
                    setIsSubmitting(false); // ✅ stop spinner
                  }
                }}
                type="button"
                disabled={rating === 0 || isSubmitting}
                className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold shadow-md transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed !text-white"
                style={{
                  backgroundColor: "var(--pc)",
                  "--tw-ring-color": "var(--pc)",
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SidebarUser;