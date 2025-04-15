import {ToastProvider} from "@/context/ToastProvider";
import "@/styles/globals.css";
import {config} from "@/utils/wagmi";
import type {AppProps} from "next/app";
import {Manrope} from "next/font/google";
import {WagmiProvider} from "wagmi";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const queryClient = new QueryClient();

export default function App({Component, pageProps}: AppProps) {
  return (
    <div className={manrope.variable}>
      <ToastProvider>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
          </QueryClientProvider>
        </WagmiProvider>
      </ToastProvider>
    </div>
  );
}
