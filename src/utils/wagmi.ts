import {injected} from "wagmi/connectors";
import {createConfig, http} from "wagmi";
import {sepolia} from "wagmi/chains";

export const config = createConfig({
  chains: [sepolia], // Connect to Sepolia to submit transactions
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(),
  },
});
