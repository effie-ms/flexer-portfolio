import {ChainType} from "@/types/chains";
import {LifiToken} from "@/types/tokens";
import {fetchLifiTokens} from "@/utils/tokens";
import useSWR from "swr";

interface UseLifiTokensReturnType {
  tokens: LifiToken[];
  isLoading: boolean;
}

export const useLifiTokens = (
  chainId?: number,
  chainType?: ChainType
): UseLifiTokensReturnType => {
  const shouldFetch = chainId !== undefined && chainType !== undefined;

  const {data, isLoading} = useSWR(
    shouldFetch ? ["lifiTokens", chainId, chainType] : null,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, id, type]) => fetchLifiTokens(id, type),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      onError: (err) => {
        console.error("Failed to fetch tokens:", err);
      },
    }
  );

  return {
    tokens: data?.tokens ?? [],
    isLoading,
  };
};
