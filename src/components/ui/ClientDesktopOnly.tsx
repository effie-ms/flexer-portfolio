import {isMobileDevice} from "@/utils/devices";
import {useEffect, useState} from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
}

export const ClientDesktopOnly = ({children}: ClientOnlyProps) => {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const isMobile = isMobileDevice();
    setIsSupported(!isMobile);
  }, []);

  if (!isSupported)
    return (
      <div className="flex items-center justify-center p-20 border border-white/10 bg-white/5 rounded-xl">
        Supported only on Desktop devices
      </div>
    );

  return children;
};
