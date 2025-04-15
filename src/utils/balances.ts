import {LifiToken} from "@/types/tokens";
import {Connection, PublicKey} from "@solana/web3.js";
import {TOKEN_PROGRAM_ID} from "@solana/spl-token";
import {Abi, createPublicClient, formatEther, formatUnits, http} from "viem";
import {LifiChain} from "@/types/chains";
import {isInvalidNumber} from "./numbers";

export type ChainBalanceResult = {
  nativeAmount: string | null;
  nativeUSD: number | null;
  tokenBalances: BalanceResult[];
  tokenUSD: number | null;
  totalUSD: number | null;
};

type NativeBalanceResult = {
  amount: string | null;
  usd: number | null;
  error: string | null;
};

export type BalanceResult = {
  symbol: string | null;
  amount: string | null;
  usdValue: number | null;
  token: LifiToken | null;
};

type TokenBalancesResult = {
  balances: BalanceResult[];
  totalUsd: number;
  error: string | null;
};

export const fetchEVMNativeBalance = async (
  walletAddress: string,
  chainId: number | string,
  chainName: string,
  tokenName: string,
  tokenSymbol: string,
  tokenDecimals: number,
  tokenPriceUSD: string | undefined,
  rpcUrls: string[]
): Promise<NativeBalanceResult> => {
  try {
    if (
      !walletAddress ||
      !chainId ||
      !chainName ||
      !tokenName ||
      !tokenSymbol ||
      tokenDecimals == null ||
      !rpcUrls?.length
    ) {
      throw new Error("Invalid or missing input parameters.");
    }

    const client = createPublicClient({
      chain: {
        id: Number(chainId),
        name: chainName,
        nativeCurrency: {
          name: tokenName,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
        },
        rpcUrls: {
          default: {
            http: rpcUrls,
          },
        },
      },
      transport: http(rpcUrls[0]),
    });

    const rawNative = await client.getBalance({
      address: walletAddress as `0x${string}`,
    });
    const formattedNative = formatEther(rawNative);
    const nativeUsd = isInvalidNumber(tokenPriceUSD)
      ? null
      : parseFloat(formattedNative) * parseFloat(tokenPriceUSD || "0");

    return {
      amount: formattedNative,
      usd: isInvalidNumber(nativeUsd) ? null : nativeUsd,
      error: null,
    };
  } catch (err) {
    console.error("Error fetching EVM native balance:", err);
    return {
      amount: null,
      usd: null,
      error: (err as Error).message || "Error fetching EVM native balance",
    };
  }
};

export const fetchERC20Balances = async (
  walletAddress: string,
  tokens: LifiToken[],
  multicallAddress: string,
  chainId: number | string,
  chainName: string,
  tokenName: string,
  tokenSymbol: string,
  tokenDecimals: number,
  rpcUrls: string[]
): Promise<TokenBalancesResult> => {
  try {
    // Validate inputs
    if (
      !walletAddress ||
      !multicallAddress ||
      !chainId ||
      !chainName ||
      !tokenName ||
      !tokenSymbol ||
      typeof tokenDecimals !== "number" ||
      !Array.isArray(rpcUrls) ||
      rpcUrls.length === 0
    ) {
      throw new Error("Invalid or missing input parameters.");
    }

    if (!Array.isArray(tokens) || tokens.length === 0) {
      return {
        balances: [],
        totalUsd: 0,
        error: "No tokens provided.",
      };
    }

    const client = createPublicClient({
      chain: {
        id: Number(chainId),
        name: chainName,
        nativeCurrency: {
          name: tokenName,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
        },
        rpcUrls: {
          default: {
            http: rpcUrls,
          },
        },
      },
      transport: http(rpcUrls[0]),
    });

    // Minimal ERC-20 ABI
    const erc20Abi: Abi = [
      {
        name: "balanceOf",
        type: "function",
        stateMutability: "view",
        inputs: [{name: "owner", type: "address"}],
        outputs: [{name: "", type: "uint256"}],
      },
    ] as const satisfies Abi;

    const calls = tokens.map((token) => ({
      address: token.address as `0x${string}`,
      abi: erc20Abi,
      functionName: "balanceOf" as const,
      args: [walletAddress],
    }));

    const multicallResults = await client.multicall({
      contracts: calls,
      multicallAddress: multicallAddress as `0x${string}`,
    });

    // Map results to balances
    const balances = tokens
      .map((token, i) => {
        const result = multicallResults[i]?.result as bigint | undefined;
        if (!result) return null;

        const amount = formatUnits(result, token.decimals);
        const numeric = parseFloat(amount);
        if (isInvalidNumber(numeric) || numeric <= 0) return null;

        return {
          symbol: token.symbol,
          token,
          amount,
          usdValue: !isInvalidNumber(token.priceUSD)
            ? numeric * parseFloat(token.priceUSD || "0")
            : null,
        };
      })
      .filter(Boolean) as BalanceResult[];

    const totalUsd = balances.reduce((sum, t) => sum + (t.usdValue ?? 0), 0);

    return {
      balances,
      totalUsd,
      error: null,
    };
  } catch (err) {
    console.error("Error fetching ERC-20 balances:", err);
    return {
      balances: [],
      totalUsd: 0,
      error:
        (err instanceof Error && err.message) ||
        "Error fetching ERC-20 balances",
    };
  }
};

export const fetchSVMNativeBalance = async (
  walletAddress: string,
  tokenDecimals: number,
  tokenPriceUSD: string | undefined
): Promise<NativeBalanceResult> => {
  try {
    if (!walletAddress) {
      throw new Error("Missing wallet address.");
    }

    const connection = new Connection(
      "https://solana-rpc.publicnode.com",
      "confirmed"
    );
    const publicKey = new PublicKey(walletAddress);

    const lamports = await connection.getBalance(publicKey);
    const tokens = (lamports / 10 ** tokenDecimals).toFixed(6);
    const usd = !isInvalidNumber(tokenPriceUSD)
      ? parseFloat(tokens) * parseFloat(tokenPriceUSD || "0")
      : null;

    return {
      amount: tokens,
      usd,
      error: null,
    };
  } catch (err) {
    console.error("Error fetching SOL native balance:", err);
    return {
      amount: null,
      usd: null,
      error: (err as Error).message || "Error fetching SOL native balance",
    };
  }
};

export const fetchSPLTokenBalances = async (
  walletAddress: string,
  tokenList: LifiToken[]
): Promise<TokenBalancesResult> => {
  try {
    if (!walletAddress) {
      throw new Error("Missing wallet address.");
    }

    const connection = new Connection("https://solana-rpc.publicnode.com", {
      commitment: "confirmed",
    });
    const publicKey = new PublicKey(walletAddress);

    const {value: tokenAccounts} =
      await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID,
      });

    const balances = tokenAccounts
      .map((account) => {
        const info = account.account.data.parsed.info;
        const mint = info.mint;
        const rawAmount = info.tokenAmount.uiAmount;

        const tokenMeta = tokenList.find((t) => t.address === mint);
        if (!tokenMeta || !rawAmount || rawAmount <= 0) return null;

        const formatted = rawAmount.toString();
        const usdValue = !isInvalidNumber(tokenMeta.priceUSD)
          ? parseFloat(formatted) * parseFloat(tokenMeta.priceUSD || "0")
          : null;

        return {
          symbol: tokenMeta.symbol,
          token: tokenMeta,
          amount: formatted,
          usdValue,
        };
      })
      .filter(Boolean) as BalanceResult[];

    console.log("Token accounts:", balances);

    const totalUsd = balances.reduce((sum, t) => sum + (t.usdValue ?? 0), 0);

    return {balances, totalUsd, error: null};
  } catch (err) {
    console.error("Error fetching SPL token balances:", err);
    return {
      balances: [],
      totalUsd: 0,
      error:
        (err instanceof Error && err.message) ||
        "Error fetching SPL token balances",
    };
  }
};

export const fetchEVMChainBalances = async (
  chain: LifiChain,
  walletAddress: string,
  tokens: LifiToken[]
): Promise<ChainBalanceResult> => {
  try {
    const nativeResult = await fetchEVMNativeBalance(
      walletAddress,
      chain.id,
      chain.name,
      chain.nativeToken.name,
      chain.nativeToken.symbol,
      chain.nativeToken.decimals,
      chain.nativeToken.priceUSD,
      chain.metamask.rpcUrls
    );

    const nativeAmount = nativeResult.error ? null : nativeResult.amount;
    const nativeUSD = nativeResult.error ? null : nativeResult.usd;

    const erc20Result =
      "multicallAddress" in chain
        ? await fetchERC20Balances(
            walletAddress,
            tokens,
            chain.multicallAddress as `0x${string}`,
            chain.id,
            chain.name,
            chain.nativeToken.name,
            chain.nativeToken.symbol,
            chain.nativeToken.decimals,
            chain.metamask.rpcUrls
          )
        : {
            balances: [],
            totalUsd: 0,
            error: "No multicall address provided.",
          };
    const tokenUSD = erc20Result.error ? null : erc20Result.totalUsd;
    const tokenBalances = erc20Result.error ? [] : erc20Result.balances;
    return {
      nativeAmount,
      nativeUSD,
      tokenBalances,
      tokenUSD,
      totalUSD: (nativeUSD || 0) + (tokenUSD || 0),
    };
  } catch (err) {
    console.error("Unexpected EVM balance error:", err);
    return {
      nativeAmount: null,
      nativeUSD: null,
      tokenBalances: [],
      tokenUSD: null,
      totalUSD: null,
    };
  }
};

export const fetchSVMChainBalances = async (
  chain: LifiChain,
  walletAddress: string,
  tokens: LifiToken[]
): Promise<ChainBalanceResult> => {
  try {
    const nativeResult = await fetchSVMNativeBalance(
      walletAddress,
      chain.nativeToken.decimals,
      chain.nativeToken.priceUSD
    );

    const nativeAmount = nativeResult.error ? null : nativeResult.amount;
    const nativeUSD = nativeResult.error ? null : nativeResult.usd;

    const splResult = await fetchSPLTokenBalances(walletAddress, tokens);

    const tokenUSD = splResult.error ? null : splResult.totalUsd;
    const tokenBalances = splResult.error ? [] : splResult.balances;

    return {
      nativeAmount,
      nativeUSD,
      tokenBalances,
      tokenUSD,
      totalUSD: (nativeUSD || 0) + (tokenUSD || 0),
    };
  } catch (err) {
    console.error("Unexpected SVM balance error:", err);
    return {
      nativeAmount: null,
      nativeUSD: null,
      tokenBalances: [],
      tokenUSD: null,
      totalUSD: null,
    };
  }
};

export const fetchChainBalances = async (
  chain: LifiChain,
  walletAddress: string,
  tokens: LifiToken[]
): Promise<ChainBalanceResult> => {
  if (chain.chainType === "EVM") {
    return await fetchEVMChainBalances(chain, walletAddress, tokens);
  } else if (chain.chainType === "SVM") {
    return await fetchSVMChainBalances(chain, walletAddress, tokens);
  } else {
    console.warn("Unsupported chain type");
    return {
      nativeAmount: null,
      nativeUSD: null,
      tokenBalances: [],
      tokenUSD: null,
      totalUSD: null,
    };
  }
};
