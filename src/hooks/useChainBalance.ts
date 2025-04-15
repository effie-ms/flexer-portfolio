import {LifiChain} from "@/types/chains";
import {LifiToken} from "@/types/tokens";
import {
  BalanceResult,
  ChainBalanceResult,
  fetchChainBalances,
} from "@/utils/balances";
import {useEffect, useMemo, useState} from "react";
import {useLifiTokens} from "./useLifiTokens";

interface useChainBalanceReturnType {
  tokenBalances: BalanceResult[];
  totalUSD: number | null;
  nativeAmount: string | null;
  nativeUSD: number | null;
  tokenUSD: number | null;
  isLoading: boolean;
}

export const useChainBalance = (
  chain: LifiChain | null,
  walletAddress: string | null
): useChainBalanceReturnType => {
  const [balancesResult, setBalancesResult] = useState<ChainBalanceResult>({
    nativeAmount: null,
    nativeUSD: null,
    tokenBalances: [],
    tokenUSD: null,
    totalUSD: null,
  });
  const {tokens: allTokens, isLoading: isLoadingTokens} = useLifiTokens(
    chain?.id,
    chain?.chainType
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!chain || !walletAddress || !allTokens.length) return;
      setIsLoading(true);

      try {
        const result = await fetchChainBalances(
          chain,
          walletAddress,
          allTokens
        );
        setBalancesResult(result);
      } catch (err) {
        console.error(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalances();
  }, [chain, walletAddress, allTokens]);

  const tokensWithBalances = useMemo(() => {
    if (isLoading || isLoadingTokens) return [];

    const nativeTokenBalance: BalanceResult = {
      token: chain?.nativeToken as LifiToken,
      symbol: chain?.nativeToken.symbol as string,
      amount: balancesResult.nativeAmount ?? "0",
      usdValue: balancesResult.nativeUSD ?? 0,
    };
    const sortedTokenBalances = [
      ...balancesResult.tokenBalances,
      nativeTokenBalance,
    ].sort((a, b) => (b.usdValue ?? 0) - (a.usdValue ?? 0));

    const existingTokenAddresses = sortedTokenBalances.map(
      (t) => t?.token?.address
    );
    const zeroTokens = allTokens
      .filter((t) => !existingTokenAddresses.includes(t?.address))
      .map(
        (token) =>
          ({
            token,
            symbol: token.symbol,
            usdValue: 0,
            amount: "0",
          } as BalanceResult)
      );

    return [...sortedTokenBalances, ...zeroTokens];
  }, [
    allTokens,
    balancesResult.nativeAmount,
    balancesResult.nativeUSD,
    balancesResult.tokenBalances,
    chain?.nativeToken,
    isLoading,
    isLoadingTokens,
  ]);

  return {
    totalUSD: balancesResult.totalUSD,
    nativeAmount: balancesResult.nativeAmount,
    nativeUSD: balancesResult.nativeUSD,
    tokenUSD: balancesResult.tokenUSD,
    tokenBalances: tokensWithBalances,
    isLoading: isLoading || isLoadingTokens,
  };
};
