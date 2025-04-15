export type LifiToken = {
  address: string;
  symbol: string;
  name: string;
  chainId: number;
  decimals: number;
  priceUSD?: string;
  coinKey?: string;
  logoURI?: string;
};
