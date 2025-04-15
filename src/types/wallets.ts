import {PublicKey, Transaction} from "@solana/web3.js";
import {ChainType, LifiChain} from "./chains";

export interface WalletConnectorProps {
  name: string;
  icon?: string;
  isConnected: boolean;
  isDetected: boolean;
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export interface EthereumWalletProvider {
  isConnected: boolean;
  isMetaMask: boolean;
  publicKey: PublicKey | null;
  request: (args: {
    method: string;
    params?: unknown[] | object;
  }) => Promise<unknown>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signAndSendTransaction: (
    transaction: Transaction
  ) => Promise<{signature: string}>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on: (event: string, callback: (...args: any[]) => void) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  off: (event: string, callback: (...args: any[]) => void) => void;
}

export interface SolanaWalletProvider {
  isConnected: boolean;
  publicKey: PublicKey | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAndSendTransaction: (
    transaction: Transaction
  ) => Promise<{signature: string}>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on: (event: string, callback: (...args: any[]) => void) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  off: (event: string, callback: (...args: any[]) => void) => void;
}

export interface WalletType {
  id: string;
  key?: string;
  name: string;
  icon: string;
  chainType: ChainType;
  address: string | null;
  submitMessageToChain: (message: string) => Promise<string | null>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnected: boolean;
  isDetected: boolean;
  provider: EthereumWalletProvider | SolanaWalletProvider | null;
}

export interface AccountType extends WalletType {
  chains: LifiChain[];
}
