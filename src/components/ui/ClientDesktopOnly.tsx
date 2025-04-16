import {isMobileDevice} from "@/utils/devices";
import {useEffect, useState} from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
}

export const ClientDesktopOnly = ({children}: ClientOnlyProps) => {
  const [hasMounted, setHasMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
    setHasMounted(true);
  }, []);

  if (isMobile)
    return (
      <div className="flex items-center justify-center text-center p-20 border border-white/10 bg-white/5 rounded-xl">
        Supported only on Desktop devices
      </div>
    );

  if (hasMounted) {
    return children;
  }

  return null;
};
