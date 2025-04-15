## Tasks

![Screenshot](public/readme/screenshot.png)

TLTR:
The flow: connect wallets -> select account (wallet) -> select chain -> view balances.
Click on "Submit to Testnet" to send a transaction with a message. 

This repository includes the implementation of the following features:

*NB:* The application is responsive for both large and small screens, but not supported on mobile devices.

### 1. Wallet connection for Ethereum (Metamask, Phantom Ethereum wallets) and Solana wallets (Phantom Solana wallets)

*NB:* Make sure the wallet extensions for Metamask and Phantom are installed. Otherwise wallet items are not interactive and are labeled as "Not installed".

Wallet connection for EVM wallets is handled via WagmiV2/Viem (chosen to simplify handling of overwrites of EVM wallets of each other, with handling of 1 EVM wallet at a time). Each Ethereum wallet connection states are handled via `useEthereumWallet()`.

Wallet connection for SVM wallets is implemented via provider on `window.phantom.solana` with solana/web3.js.

Once connected, the corresponding accounts are available in the dropdown on the right side. The balances are not mixed for both EVM and SVM and correspond to "one selected account and one selected chain". 

### 2. Fetching of tokens and chains using LiFi API. Implemented in `useLifiTokens()` and `useLifiChains()`, wrapped in SWR-styled fetches with caching and retries. No polling is enabled, just refetch on refocus within the session.

The app shows all the returned tokens and chains, no pagination on fetch (not in API), but rendered browser-side via pagination with infinite scroll.

*NB:* Rate-limiting errors are left on console.

### 3. Cumulative wallet balances

The balances are fetched for native tokens on LiFi's chains and for the ERC20/SPL tokens returned from the LiFi's API.
The used USD prices are also from the LiFi's responses (no polling).

The total balance shown is the sum of native token balance and the other chain's tokens (ERC20/SPL tokens) balances.
Since we need to know what tokens to request balances from, if tokens are not listed in LiFi's response, they are not going to be included in the balance. Tokens with invalid prices/balance type-wise are also filtered out.

The balances for ERC20 tokens on EVM chains are fetched via multicall address.
The balances for SPL tokens on SVM chains - via SPL program.

### 4. Sending balances to the chain

*NB*: The balances are transacted to **Sepolia for EVM and Solana Devnet for SVM**. The balances sent in the payload correspond to the cumulative USD balance *on the chain selected in the dropdown* (*not balances on Sepolia for EVM and Solana Devnet for SVM*).

As sending data on EVM to normal wallets is not allowed, sending it to the Ethscription smart contract as calldata NFT-style.

The statuses of transaction stages are shown in toasts rendered in the bottom right corner. Once the transaction is sent and its hash is available, the link to it on the explorer appears under the button "Submit to Testnet".

Status updates are implemented via FSM singleton with event listeners.

**Preliminary requirements to send transactions:**

1) Switch Metamask to Sepolia chain in the wallet (added programmatic logic, but it does not work equally on different wallets).
2) Enable Testing mode on Phantom.
3) Get Sepolia ETH and SOL for Devnet to pay gas fees from the faucets.

## Running the application

This is a [Next.js](https://nextjs.org) project.

Runtime: Node.js (v.20)
Written in React.js (v.18), Typescript ES2018
Styling: TailwindCSS

1) Install dependencies: 

```bash
npm install
```

2) Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

