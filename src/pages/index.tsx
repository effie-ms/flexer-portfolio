import {Dashboard} from "@/components/Dashboard";
import {ClientDesktopOnly} from "@/components/ui/ClientDesktopOnly";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Flexer Portfolio</title>
        <meta
          name="description"
          content="ETH/SOL portfolios for Metamask and Phantom wallets"
        />
      </Head>
      <ClientDesktopOnly>
        <Dashboard />
      </ClientDesktopOnly>
    </>
  );
}
