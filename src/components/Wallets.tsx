import {WalletType} from "@/types/wallets";
import {WalletConnector} from "./WalletConnector";

interface WalletsProps {
  wallets: WalletType[];
}

export const Wallets = ({wallets}: WalletsProps) => {
  return (
    <div className="w-full bg-white/5 rounded-3xl border border-white/10 p-5">
      <h2>Connect a wallet</h2>
      <div className="flex flex-col gap-y-3 w-full my-5">
        {wallets.map((wallet, idx) => (
          <WalletConnector
            key={`${wallet.name}-${idx}`}
            name={wallet.name}
            isConnected={wallet.isConnected}
            isDetected={wallet.isDetected}
            isLoading={false}
            icon={wallet.icon}
            connect={wallet.connect}
            disconnect={wallet.disconnect}
          />
        ))}
      </div>
    </div>
  );
};
