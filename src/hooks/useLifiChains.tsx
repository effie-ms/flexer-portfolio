import {ChainType, LifiChain} from "@/types/chains";
import useSWR from "swr";

interface UseLifiChainsReturnType {
  chains: LifiChain[];
  isLoading: boolean;
}

const fetcher = async (url: string, chainType: string) => {
  const res = await fetch(`${url}?chainTypes=${chainType}`);
  if (!res.ok) {
    return [];
  }
  return res.json();
};

export const useLifiChains = (
  chainType: ChainType
): UseLifiChainsReturnType => {
  const {data, isLoading} = useSWR(
    ["https://li.quest/v1/chains", chainType],
    ([url, type]) => fetcher(url, type),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
      shouldRetryOnError: true,
      retry: 3, // Number of retry attempts
      onError: (err) => {
        console.error("Failed to fetch chains:", err);
      },
    }
  );

  return {
    chains: data?.chains ?? [],
    isLoading,
  };
};
