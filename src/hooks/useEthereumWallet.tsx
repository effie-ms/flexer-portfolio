import {useEffect, useMemo, useState} from "react";
import {useAccount, useConnect, useDisconnect} from "wagmi";
import {EthereumWalletProvider, WalletType} from "@/types/wallets";
import {inscriptionFSM} from "@/utils/inscriptionFSM";
import {parseEther, UserRejectedRequestError} from "viem";
import {sepolia} from "wagmi/chains";
import {
  getWalletClient,
  switchChain,
  waitForTransactionReceipt,
} from "@wagmi/core";
import {config} from "@/utils/wagmi";

export const useEthereumWallet = (
  id: string,
  name: string,
  icon: string,
  getProvider: (window: Window) => EthereumWalletProvider | null
): WalletType => {
  const {connect: connectActive, connectors} = useConnect();
  const {disconnect: disconnectActive} = useDisconnect();
  const {
    address: activeAddress,
    isConnected: isConnectedAll,
    connector: activeConnector,
  } = useAccount();

  const isActiveAccount = useMemo(
    () => activeConnector?.id === id,
    [activeConnector?.id, id]
  );

  const [isDetected, setIsDetected] = useState(false);
  const [provider, setProvider] = useState<EthereumWalletProvider | null>(null);

  useEffect(() => {
    const ethereum = getProvider(window);
    setProvider(ethereum);
    setIsDetected(!!ethereum);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connect = async () => {
    const connector = connectors.find((c) => c.id === id);
    if (!connector) return;
    connectActive({connector});
  };

  const disconnect = async () => {
    if (isActiveAccount) {
      disconnectActive();
    }
  };

  const publishMessageToChain = async (
    message: string
  ): Promise<string | null> => {
    const walletClient = await getWalletClient(config, {
      connector: activeConnector,
    });

    if (!isActiveAccount || !activeAddress || !walletClient) {
      return null;
    }

    try {
      inscriptionFSM.start();

      const hexMessage = `0x${Buffer.from(message, "utf8").toString("hex")}`;

      inscriptionFSM.messagePrepared();

      if (walletClient.chain?.id !== sepolia.id) {
        walletClient.addChain({chain: sepolia});
        walletClient.switchChain({id: sepolia.id});
        await switchChain(config, {
          chainId: sepolia.id,
          connector: activeConnector,
        });
      }

      inscriptionFSM.signed();

      let txHash: `0x${string}` | null = null;
      try {
        txHash = await walletClient.sendTransaction({
          account: activeAddress as `0x${string}`,
          chain: sepolia,
          to: "0x0000000000000000000000000000000000000000",
          value: parseEther("0"),
          data: hexMessage as `0x${string}`,
        });
      } catch (error: unknown) {
        // Handle Viem errors manually
        if (error instanceof UserRejectedRequestError) {
          inscriptionFSM.rejected();
          console.error("User rejected the transaction:", error);
          return null;
        }
        // All other errors
        throw error;
      }

      inscriptionFSM.sent();

      const receipt = await waitForTransactionReceipt(config, {hash: txHash});
      if (receipt.status === "success") {
        inscriptionFSM.confirmed();
      } else {
        inscriptionFSM.error();
        console.error("Transaction failed:", receipt);
      }

      return txHash;
    } catch (error) {
      inscriptionFSM.error();
      console.error("Error publishing message to chain:", error);
      return null;
    }
  };

  return {
    id,
    name,
    icon,
    provider,
    chainType: "EVM",
    isConnected: isActiveAccount ? isConnectedAll : false,
    isDetected,
    address: isActiveAccount ? (activeAddress as string) : null,
    connect,
    disconnect,
    submitMessageToChain: publishMessageToChain,
  };
};
