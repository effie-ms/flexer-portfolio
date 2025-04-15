"use client";

import {WalletConnectorProps} from "@/types/wallets";
import clsx from "clsx";
import Image from "next/image";
import {useCallback, useMemo} from "react";

export const WalletConnector = ({
  name,
  icon,
  isConnected,
  isDetected,
  isLoading,
  connect,
  disconnect,
}: WalletConnectorProps) => {
  const handleClick = useCallback(async () => {
    if (isLoading || !isDetected) return;

    if (isConnected) {
      await disconnect();
    } else {
      await connect();
    }
  }, [connect, disconnect, isConnected, isDetected, isLoading]);

  const status = useMemo(() => {
    if (isLoading) {
      return null;
    }

    if (!isDetected) {
      return {
        text: "Not installed",
        className: "bg-blue-700",
      };
    }

    if (isConnected) {
      return {
        text: "Disconnect",
        className: "bg-pink-500",
      };
    }

    return {
      text: "Connect",
      className: "bg-teal-600",
    };
  }, [isLoading, isDetected, isConnected]);

  return (
    <div
      className={clsx(
        "flex gap-2 items-center justify-between p-2 rounded-xl border border-white/5 bg-white/5 transition-colors duration-300",
        !isLoading && isDetected
          ? isConnected
            ? "hover:bg-pink-500/20 cursor-pointer"
            : "hover:bg-teal-500/20 cursor-pointer"
          : "cursor-not-allowed",
        isLoading && "animate-pulse"
      )}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        {icon ? (
          <Image
            src={icon}
            alt="Wallet"
            className="rounded-md object-cover"
            width={40}
            height={40}
          />
        ) : (
          <div className="w-10 h-10 rounded-md bg-white/10" />
        )}
        <span className="text-xs sm:text-sm text-white leading-tight">
          {name}
        </span>
      </div>
      {Boolean(status) && (
        <div
          className={clsx(
            "text-xs sm:text-sm text-white px-2 py-1 rounded-md text-center leading-tight",
            status?.className
          )}
        >
          {status?.text}
        </div>
      )}
    </div>
  );
};
