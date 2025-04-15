"use client";

import {Toast} from "@/components/ui/Toast";
import React, {createContext, useContext, useState, useCallback} from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextProps {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

export const ToastProvider = ({children}: {children: React.ReactNode}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2, 11);
    const newToast: Toast = {id, message, type};
    setToasts((prev) => [...prev, newToast]);

    const timeoutId = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <ToastContext.Provider value={{showToast}}>
      {children}
      <div className="fixed bottom-4 right-4 flex flex-col items-end gap-2 z-50">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} variant={toast.type} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
