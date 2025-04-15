import {WalletType} from "@/types/wallets";

export type WithAccountsProps = {
  accounts: WalletType[];
  initialAccount: WalletType;
};

export const withAccounts =
  <P extends object>(wallets: WalletType[]) =>
  (Component: React.ComponentType<P & WithAccountsProps>) => {
    return function WithAccountsWrapper(props: P) {
      const accounts = wallets?.filter((wallet) => wallet.isConnected) ?? [];
      if (!accounts?.length) {
        return (
          <div className="text-sm text-gray-300 italic my-5">
            Connect a wallet to see your accounts.
          </div>
        );
      }

      const initialAccount = accounts[0];
      return (
        <Component
          {...props}
          accounts={accounts}
          initialAccount={initialAccount}
        />
      );
    };
  };
