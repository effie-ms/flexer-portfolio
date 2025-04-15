import {ChainType, LifiChain} from "@/types/chains";

export const fetchLifiChains = async (
  chainType: ChainType
): Promise<{
  chains: LifiChain[];
}> => {
  try {
    const res = await fetch(
      `https://li.quest/v1/chains?chainTypes=${chainType}`
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch chains: ${res.statusText}`);
    }

    const data = await res.json();
    return {
      chains: data?.chains ?? [],
    };
  } catch (err) {
    console.error("fetchLifiChains error:", (err as Error).message);
    return {chains: []};
  }
};
