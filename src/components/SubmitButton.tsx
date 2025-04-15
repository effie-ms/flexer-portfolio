import {useMemo, useState} from "react";
import {WalletType} from "@/types/wallets";
import {ChainType} from "@/types/chains";
import {
  useInscriptionFlow,
  useInscriptionStatus,
} from "@/hooks/useInscriptionFlow";
import clsx from "clsx";

interface SubmitButtonProps {
  isVisible: boolean;
  selectedAccount: WalletType;
  handleSubmitToChain: () => Promise<string | null>;
}

const getTransactionUrl = (txHash: string | null, chainType: ChainType) => {
  if (!txHash) return null;

  switch (chainType) {
    case "SVM":
      return `https://explorer.solana.com/tx/${txHash}?cluster=devnet`;
    case "EVM":
      return `https://sepolia.etherscan.io/tx/${txHash}`;
    default:
      return null;
  }
};

export const SubmitButton = ({
  isVisible,
  selectedAccount,
  handleSubmitToChain,
}: SubmitButtonProps) => {
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  useInscriptionFlow();
  const status = useInscriptionStatus();

  const isSubmitting = useMemo(() => {
    return !["idle", "completed", "failed", "rejected"].includes(status);
  }, [status]);

  console.log(status)

  const transactionUrl = getTransactionUrl(
    transactionHash,
    selectedAccount.chainType
  );

  return (
    <div className={clsx("relative", {hidden: !isVisible})}>
      <button
        onClick={async () => {
          const txHash = await handleSubmitToChain();
          setTransactionHash(txHash);
        }}
        disabled={isSubmitting}
        className={`px-4 py-2 rounded-xl border font-bold cursor-pointer transition duration-300 ease-in-out text-sm
        ${
          isSubmitting
            ? "text-gray-300 border-gray-300 cursor-not-allowed animate-pulse"
            : "text-pink-500 border-pink-500 hover:bg-pink-500 hover:text-white"
        }
      `}
      >
        {isSubmitting ? "Submitting..." : "Submit to Testnet"}
      </button>
      {Boolean(transactionUrl) && (
        <a
          href={transactionUrl || ""}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute left-0 top-full text-center text-teal-500 cursor-pointer transition duration-300 ease-in-out hover:underline text-xs"
        >
          View transaction on Explorer
        </a>
      )}
    </div>
  );
};
