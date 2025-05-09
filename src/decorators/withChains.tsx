import {AccountType} from "@/types/wallets";

export type WithChainsProps = {
  selectedAccount: AccountType;
};

export const withChains =
  <P extends object>(selectedAccount: AccountType) =>
  (Component: React.ComponentType<P & WithChainsProps>) => {
    return function WithChainsWrapper(props: P) {
      const chains = selectedAccount?.chains || [];
      if (!chains?.length) {
        return (
          <div className="text-sm text-gray-300 italic mb-5">
            No chains available.
          </div>
        );
      }

      const initialChain = chains[0];
      return (
        <Component
          {...props}
          selectedAccount={selectedAccount}
          chains={chains}
          initialChain={initialChain}
        />
      );
    };
  };
