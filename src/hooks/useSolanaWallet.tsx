import {useEffect, useState} from "react";
import {
  PublicKey,
  Connection,
  Transaction,
  clusterApiUrl,
  SendTransactionError,
} from "@solana/web3.js";
import {createMemoInstruction} from "@solana/spl-memo";
import {inscriptionFSM} from "@/utils/inscriptionFSM";
import {SolanaWalletProvider, WalletType} from "@/types/wallets";

export const useSolanaWallet = (
  id: string,
  name: string,
  icon: string,
  getProvider: (window: Window) => SolanaWalletProvider | null
): WalletType => {
  const [isConnected, setIsConnected] = useState(false);
  const [isDetected, setIsDetected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<SolanaWalletProvider | null>(null);

  useEffect(() => {
    const solana = getProvider(window);
    setProvider(solana);
    setIsDetected(!!solana);

    const handleConnect = (publicKey: PublicKey) => {
      setIsConnected(true);
      setAddress(publicKey.toString());
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setAddress(null);
    };

    const handleAccountChange = (newPublicKey: PublicKey | null) => {
      if (newPublicKey) {
        setAddress(newPublicKey.toString());
        setIsConnected(true);
      } else {
        setAddress(null);
        setIsConnected(false);
      }
    };

    if (solana) {
      solana.on("connect", handleConnect);
      solana.on("disconnect", handleDisconnect);
      solana.on("accountChanged", handleAccountChange);

      if (solana.isConnected && solana.publicKey) {
        setIsConnected(true);
        setAddress(solana.publicKey.toString());
      }
    }

    return () => {
      if (solana) {
        solana.off("connect", handleConnect);
        solana.off("disconnect", handleDisconnect);
        solana.off("accountChanged", handleAccountChange);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connect = async () => {
    if (!provider) return;
    await provider.connect();
  };

  const disconnect = async () => {
    if (!provider) return;
    await provider.disconnect();
  };

  const publishMessageToChain = async (
    message: string
  ): Promise<string | null> => {
    try {
      inscriptionFSM.start();

      if (!provider || !provider.publicKey)
        throw new Error("Wallet not connected");

      const publicKey = provider.publicKey;

      // Submit to Solana Devnet
      const connection = new Connection(clusterApiUrl("devnet"), {
        commitment: "confirmed",
      });

      const {blockhash, lastValidBlockHeight} =
        await connection.getLatestBlockhash("finalized");

      const transaction = new Transaction({
        blockhash,
        lastValidBlockHeight,
        feePayer: publicKey,
      }).add(createMemoInstruction(message, [publicKey]));

      inscriptionFSM.messagePrepared();

      let signedTx: Transaction | null = null;
      try {
        signedTx = await provider.signTransaction(transaction);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "User rejected the request."
        ) {
          inscriptionFSM.rejected();
          return null;
        }
        inscriptionFSM.error();
        return null;
      }

      inscriptionFSM.signed();

      let txHash: string | null = null;
      try {
        txHash = await connection.sendRawTransaction(signedTx.serialize());
      } catch (err) {
        if (err instanceof SendTransactionError) {
          inscriptionFSM.error();
          return null;
        }
      }

      if (txHash) {
        inscriptionFSM.sent();

        try {
          await connection.confirmTransaction({
            signature: txHash,
            blockhash,
            lastValidBlockHeight,
          });
        } catch (err) {
          if (err instanceof Error) {
            inscriptionFSM.error();
            return null;
          }
        }

        inscriptionFSM.confirmed();
      }

      return txHash;
    } catch (err) {
      inscriptionFSM.error();
      console.error("Transaction failed:", err);
      return null;
    }
  };

  return {
    id,
    name,
    icon,
    provider,
    chainType: "SVM",
    isConnected,
    isDetected,
    address,
    connect,
    disconnect,
    submitMessageToChain: publishMessageToChain,
  };
};
