import {TokenItem} from "./TokenItem";
import {BalanceResult} from "@/utils/balances";
import {InfiniteList} from "@/components/ui/InfiniteList";

interface TokenItemsProps {
  tokens: BalanceResult[];
  isLoading: boolean;
}

export const TokenItems = ({tokens, isLoading}: TokenItemsProps) => {
  return (
    <div className="flex flex-col gap-3 w-full sm:h-[420px]">
      <div className="text-white text-sm">Tokens:</div>
      {isLoading ? (
        <div className="text-gray-300 text-sm animate-pulse">
          Loading...
        </div>
      ) : Boolean(!tokens.length) ? (
        <div className="text-gray-300 text-sm">
          No tokens found for this address
        </div>
      ) : (
        <InfiniteList
          className="h-full overflow-x-hidden pr-1"
          items={tokens}
          renderItem={(obj: BalanceResult, idx: number) => (
            <TokenItem
              key={`${obj.token?.address}-${idx}`}
              name={obj.token?.name || ""}
              icon={obj.token?.logoURI || null}
              symbol={obj.token?.symbol || ""}
              balance={obj.amount}
              balanceUSD={obj.usdValue}
              isLoading={isLoading}
            />
          )}
        />
      )}
    </div>
  );
};
