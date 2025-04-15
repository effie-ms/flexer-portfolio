import {EthereumWalletProvider, SolanaWalletProvider} from "./wallets";

declare global {
  interface Window {
    ethereum?: EthereumWalletProvider;
    phantom?: {
      ethereum?: EthereumWalletProvider;
      solana?: SolanaWalletProvider;
    };
  }
}
