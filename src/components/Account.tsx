import {useEffect, useState} from "react";
import {Balance} from "./Balance";
import {Chains} from "./Chains";
import {TokenItems} from "./TokenItems";
import {useChainBalance} from "@/hooks/useChainBalance";
import {LifiChain} from "@/types/chains";
import {AccountType} from "@/types/wallets";
import {withChains, WithChainsProps} from "@/decorators/withChains";

interface AccountWrapperProps {
  selectedAccount: AccountType;
}

interface AccountProps {
  selectedAccount: AccountType;
  initialChain: LifiChain;
  chains: LifiChain[];
}

export const AccountWrapper = ({selectedAccount}: AccountWrapperProps) => {
  const AccountWithChains = withChains(selectedAccount)(
    Account as React.ComponentType<object & WithChainsProps>
  );
  return <AccountWithChains />;
};

const Account = ({selectedAccount, initialChain, chains}: AccountProps) => {
  const [selectedChain, setSelectedChain] = useState(initialChain);

  useEffect(() => {
    setSelectedChain(initialChain);
  }, [initialChain]);

  const {
    tokenBalances,
    totalUSD,
    isLoading: isLoadingBalance,
  } = useChainBalance(selectedChain, selectedAccount?.address);

  return (
    <div className="flex flex-col gap-5 w-full my-5">
      <Chains
        chains={chains}
        selectedChain={selectedChain}
        setSelectedChain={setSelectedChain}
      />
      <Balance
        selectedAccount={selectedAccount}
        isLoading={isLoadingBalance}
        totalUSD={totalUSD}
      />
      <TokenItems
        tokens={tokenBalances}
        isLoading={isLoadingBalance}
      />
    </div>
  );
};
