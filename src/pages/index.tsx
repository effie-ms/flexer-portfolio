import {Dashboard} from "@/components/Dashboard";
import { ClientDesktopOnly } from "@/components/ui/ClientDesktopOnly";

export default function Home() {
  return (
    <ClientDesktopOnly>
      <Dashboard />
    </ClientDesktopOnly>
  );
}
