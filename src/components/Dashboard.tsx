import {useWallets} from "@/hooks/useWallets";
import {AccountsWrapper} from "./Accounts";
import {Wallets} from "./Wallets";

export const Dashboard = () => {
  const {wallets} = useWallets();
  return (
    <div className="flex flex-col gap-5 h-full w-full">
      <h1 className="text-center">Flexer Portfolio</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-20 w-full justify-center mx-auto">
        <Wallets wallets={wallets} />
        <AccountsWrapper wallets={wallets} />
      </div>
    </div>
  );
};
