export type LifiChain = EVMChain | SVMChain;

export type ChainType = "EVM" | "SVM";

export interface BaseChain {
  key: string;
  chainType: ChainType;
  name: string;
  coin: string;
  id: number;
  mainnet: boolean;
  logoURI: string;
  nativeToken: NativeToken;
  metamask: MetamaskConfig;
}

export interface EVMChain extends BaseChain {
  chainType: "EVM";
  tokenlistUrl?: string;
  multicallAddress?: `0x${string}`;
  relayerSupported?: boolean;
  diamondAddress?: `0x${string}`;
  permit2?: `0x${string}`;
  permit2Proxy?: `0x${string}`;
}

export interface SVMChain extends BaseChain {
  chainType: "SVM";
  faucetUrls?: string[];
}

export interface NativeToken {
  address: string;
  chainId: number;
  symbol: string;
  decimals: number;
  name: string;
  coinKey: string;
  logoURI: string;
  priceUSD?: string;
}

export interface MetamaskConfig {
  chainId: string;
  chainName: string;
  blockExplorerUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
}
