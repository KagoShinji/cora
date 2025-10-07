// src/components/GlobalToaster.jsx
import { Toaster } from "react-hot-toast";

export default function GlobalToaster() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: "10px",
          padding: "14px 18px",
          fontWeight: 500,
          color: "#fff",
          boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        },
        success: {
          iconTheme: { primary: "#22c55e", secondary: "#fff" },
          style: { background: "#16a34a" }, // Green
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "#fff" },
          style: { background: "#dc2626" }, // Red
        },
        loading: {
          style: { background: "#3b82f6" }, // Blue
        },
      }}
    />
  );
}
