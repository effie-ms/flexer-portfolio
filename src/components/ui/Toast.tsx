import Image from "next/image";
import clsx from "clsx";

interface ToastProps {
  message: string;
  variant?: "success" | "info" | "error";
}

const iconMap = {
  success: "/icons/toast-success.svg",
  info: "/icons/toast-info.svg",
  error: "/icons/toast-error.svg",
};

export const Toast = ({message, variant = "info"}: ToastProps) => {
  return (
    <div
      className={clsx(
        "inline-flex items-center justify-end gap-2 px-4 py-2 rounded-full text-sm font-medium text-white bg-white/5 shadow-md backdrop-blur-sm"
      )}
    >
      <Image src={iconMap[variant]} alt={variant} width={16} height={16} />
      <span className="mt-[1px] text-right">{message}</span>
    </div>
  );
};
