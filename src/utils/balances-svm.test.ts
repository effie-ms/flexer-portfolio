import {fetchSVMNativeBalance, fetchSPLTokenBalances} from "@/utils/balances";

const mockTokens = [
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xusdc",
    decimals: 6,
    priceUSD: "1",
    chainId: 1,
  },
];

vi.mock("@solana/web3.js", async () => {
  const actual = await vi.importActual("@solana/web3.js");
  return {
    ...actual,
    Connection: vi.fn(() => ({
      getBalance: vi.fn(() => Promise.resolve(1000000000)), // 1 SOL in lamports
      getParsedTokenAccountsByOwner: vi.fn(() =>
        Promise.resolve({
          value: [
            {
              account: {
                data: {
                  parsed: {
                    info: {
                      mint: "0xusdc",
                      tokenAmount: {uiAmount: 2},
                    },
                  },
                },
              },
            },
          ],
        })
      ),
    })),
    PublicKey: vi.fn().mockImplementation((addr) => addr),
    TOKEN_PROGRAM_ID: "mock-program-id",
  };
});

describe("fetchSVMNativeBalance", () => {
  it("returns SOL and USD value", async () => {
    const result = await fetchSVMNativeBalance("solana-wallet", 9, "100");
    expect(result.amount).toBe("1.000000");
    expect(result.usd).toBe(100);
  });

  it("handles missing wallet", async () => {
    const result = await fetchSVMNativeBalance("", 9, "100");
    expect(result.amount).toBeNull();
    expect(result.error).toMatch(/Missing wallet address/);
  });
});

describe("fetchSPLTokenBalances", () => {
  it("returns SPL token balances with USD", async () => {
    const result = await fetchSPLTokenBalances("wallet-address", mockTokens);
    expect(result.balances.length).toBe(1);
    expect(result.balances[0].usdValue).toBe(2);
    expect(result.totalUsd).toBe(2);
  });

  it("handles missing wallet", async () => {
    const result = await fetchSPLTokenBalances("", mockTokens);
    expect(result.error).toMatch(/Missing wallet address/);
  });
});
