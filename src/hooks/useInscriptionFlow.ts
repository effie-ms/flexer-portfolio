import {useEffect, useSyncExternalStore} from "react";
import {useToast} from "@/context/ToastProvider";
import {inscriptionFSM, InscriptionState} from "@/utils/inscriptionFSM";

export const useInscriptionStatus = () => {
  return useSyncExternalStore(
    inscriptionFSM.subscribe.bind(inscriptionFSM),
    inscriptionFSM.getState.bind(inscriptionFSM)
  );
};

export const useInscriptionFlow = () => {
  const {showToast} = useToast();
  useEffect(() => {
    const unsubscribe = inscriptionFSM.onTransition(
      (state: InscriptionState) => {
        switch (state) {
          case "preparing_message":
            showToast("Preparing inscription message");
            break;
          case "awaiting_signature":
            showToast("Please sign the transaction");
            break;
          case "sending_transaction":
            showToast("Sending transaction");
            break;
          case "waiting_confirmation":
            showToast("Waiting for confirmation");
            break;
          case "completed":
            showToast("Inscription complete!");
            break;
          case "failed":
            showToast("Transaction failed");
            break;
        }
      }
    );

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
