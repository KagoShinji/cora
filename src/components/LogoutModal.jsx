import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { XIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function LogoutModal({
  open,
  onClose,
  onConfirm,
  primaryColor = "#1D4ED8",
  title = "Confirm Logout",
  description = "Are you sure you want to log out?",
  confirmLabel = "Logout",
  cancelLabel = "Cancel",
  zIndexClass = "z-[70]", // > sidebar z-50
  closeOnBackdrop = true,
  closeOnEsc = true,
}) {
  const confirmRef = useRef(null);
  const lastActive = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    // store last focused element, lock body scroll
    lastActive.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // focus the confirm button
    confirmRef.current?.focus();

    // esc to close
    const onKey = (e) => {
      if (closeOnEsc && e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow || "";
      // restore focus
      lastActive.current && lastActive.current.focus?.();
    };
  }, [open, onClose, closeOnEsc]);

  if (!open) return null;

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      toast.success("✅ Logged out successfully!");
      onClose();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("❌ Failed to log out. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div
      className={`fixed inset-0 min-h-[100dvh] p-4 bg-black/50 backdrop-blur-sm flex items-center justify-center ${zIndexClass}`}
      onMouseDown={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) onClose?.();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-title"
      aria-describedby="logout-desc"
    >
      <div
        className="relative w-[90%] max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 p-6 sm:p-8"
        style={{ "--pc": primaryColor }}
      >
        {/* Accent line */}
        <div
          className="absolute inset-x-0 -top-px h-[2px]"
          style={{ background: "linear-gradient(90deg,transparent,var(--pc),transparent)" }}
        />

        {/* X close (icon only) */}
        <XIcon
          onClick={onClose}
          className="absolute right-3 top-3 h-6 w-6 cursor-pointer hover:opacity-80"
          style={{ color: primaryColor }}
          role="button"
          tabIndex={0}
          aria-label="Close"
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClose?.()}
        />

        <div className="space-y-4 sm:space-y-5">
          <h2
            id="logout-title"
            className="text-xl sm:text-2xl font-semibold"
            style={{ color: "var(--pc)" }}
          >
            {title}
          </h2>
          <p id="logout-desc" className="text-neutral-700">
            {description}
          </p>

          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              type="button"
              className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 border !bg-white text-sm font-medium transition hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                borderColor: "var(--pc)",
                color: "var(--pc)",
                "--tw-ring-color": "var(--pc)",
              }}
            >
              {cancelLabel}
            </button>

            <button
              ref={confirmRef}
              onClick={handleConfirm}
              type="button"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-md transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 text-white disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--pc)",
                "--tw-ring-color": "var(--pc)",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging out…
                </>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
