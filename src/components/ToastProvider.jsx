"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const ToastContext = createContext(null);
let nextToastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback((message, type = "info") => {
    const id = ++nextToastId;
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => dismiss(id), 4500);
  }, [dismiss]);

  const toast = useMemo(() => ({
    success: (message) => notify(message, "success"),
    error: (message) => notify(message, "error"),
    info: (message) => notify(message, "info"),
  }), [notify]);

  useEffect(() => {
    const authSuccessMessage = window.sessionStorage.getItem("bazarDor:auth-success-toast");
    if (!authSuccessMessage) return;

    window.sessionStorage.removeItem("bazarDor:auth-success-toast");
    const timeoutId = window.setTimeout(() => notify(authSuccessMessage, "success"), 0);
    return () => window.clearTimeout(timeoutId);
  }, [notify]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-100 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3" aria-live="polite" aria-atomic="false">
        {toasts.map((item) => (
          <div
            key={item.id}
            role={item.type === "error" ? "alert" : "status"}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur ${
              item.type === "success"
                ? "border-emerald-200 bg-emerald-50/95 text-emerald-900"
                : item.type === "error"
                  ? "border-red-200 bg-red-50/95 text-red-900"
                  : "border-slate-200 bg-white/95 text-slate-800"
            }`}
          >
            <span aria-hidden="true" className="font-bold">{item.type === "success" ? "✓" : item.type === "error" ? "!" : "i"}</span>
            <p className="flex-1 text-sm font-semibold">{item.message}</p>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              className="-mr-1 -mt-1 rounded p-1 text-current/60 hover:bg-black/5 hover:text-current"
              aria-label="বার্তা বন্ধ করুন"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const toast = useContext(ToastContext);
  if (!toast) throw new Error("useToast must be used within ToastProvider");
  return toast;
}
