import {WalletType} from "@/types/wallets";
import {formatNumber, isInvalidNumber} from "@/utils/numbers";
import {useCallback} from "react";
import {SubmitButton} from "./SubmitButton";

interface BalanceProps {
  totalUSD: number | null;
  isLoading: boolean;
  selectedAccount: WalletType;
}

export const Balance = ({
  totalUSD,
  selectedAccount,
  isLoading,
}: BalanceProps) => {
  const handleSubmitToChain = useCallback(async () => {
    if (!isInvalidNumber(totalUSD)) {
      return await selectedAccount.submitMessageToChain(
        `Total balance of ${selectedAccount.address} is $${totalUSD}`
      );
    }
    return null;
  }, [totalUSD, selectedAccount]);
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="text-white text-sm">Total balance:</div>
      <div className="flex flex-row gap-3 w-full items-center flex-wrap justify-between">
        {isLoading ? (
          <div className="h-[38px] w-[200px] bg-white/10 rounded-md animate-pulse"></div>
        ) : (
          <div className="text-white text-3xl">
            {formatNumber(totalUSD, {precision: 2, prefix: "$"})}
          </div>
        )}
        <SubmitButton
          isVisible={!isInvalidNumber(totalUSD) && !isLoading}
          selectedAccount={selectedAccount}
          handleSubmitToChain={handleSubmitToChain}
        />
      </div>
    </div>
  );
};
