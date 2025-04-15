import { ChainType } from "@/types/chains";
import {LifiToken} from "@/types/tokens";

export const fetchLifiTokens = async (
  chainId: string | number,
  chainType: ChainType
): Promise<{tokens: LifiToken[]}> => {
  try {
    if (!chainId || !chainType) {
      throw new Error("Invalid input parameters");
    }

    const url = `https://li.quest/v1/tokens?chains=${encodeURIComponent(
      chainId
    )}&chainTypes=${encodeURIComponent(chainType)}`;

    const res = await fetch(url, {
      headers: {accept: "application/json"},
    });

    if (!res.ok) {
      console.warn(
        `LI.FI token fetch failed for chainId ${chainId}: ${res.status}`
      );
      return {tokens: []};
    }

    const json = await res.json();
    const tokens = json.tokens?.[chainId] ?? [];

    if (!Array.isArray(tokens)) {
      console.warn(
        `Unexpected token structure from LI.FI for chainId ${chainId}`
      );
      return {tokens: []};
    }

    return {tokens};
  } catch (err) {
    console.error("Error fetching LI.FI tokens:", err);
    return {tokens: []};
  }
};
