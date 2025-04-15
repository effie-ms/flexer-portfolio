"use client";

import {useEthereumWallet} from "@/hooks/useEthereumWallet";
import {useSolanaWallet} from "@/hooks/useSolanaWallet";
import {AccountType} from "@/types/wallets";
import {useLifiChains} from "./useLifiChains";

export interface WalletConnector {
  id: string;
  name: string;
  icon: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  isDetected: boolean;
  isLoading: boolean;
}

export const useWallets = (): {wallets: AccountType[]} => {
  const {wallets: walletsEVM} = useEVMWallets();
  const {wallets: walletsSVM} = useSVMWallets();

  return {
    wallets: [...walletsEVM, ...walletsSVM],
  };
};

export const useEVMWallets = (): {wallets: AccountType[]} => {
  const {chains} = useLifiChains("EVM");
  const metamaskWallet = useEthereumWallet(
    "io.metamask",
    "Metamask",
    "/wallets/metamask-wallet.png",
    (windowObject) => {
      return typeof windowObject !== "undefined" &&
        !!windowObject.ethereum?.isMetaMask
        ? windowObject.ethereum ?? null
        : null;
    }
  );

  const phantomEVM = useEthereumWallet(
    "app.phantom",
    "Phantom EVM",
    "/wallets/phantom-wallet.png",
    (windowObject) => {
      return typeof windowObject !== "undefined"
        ? windowObject.phantom?.ethereum ?? null
        : null;
    }
  );

  return {
    wallets: [
      {...metamaskWallet, chains},
      {...phantomEVM, chains},
    ],
  };
};

const useSVMWallets = (): {wallets: AccountType[]} => {
  const {chains} = useLifiChains("SVM");
  const phantomSVMWallet = useSolanaWallet(
    "phantomsvm",
    "Phantom SVM",
    "/wallets/phantom-wallet.png",
    (windowObject) => {
      return typeof window !== "undefined"
        ? windowObject?.phantom?.solana ?? null
        : null;
    }
  );
  return {wallets: [{...phantomSVMWallet, chains}]};
};
