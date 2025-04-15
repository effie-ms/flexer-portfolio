import {fetchEVMNativeBalance, fetchERC20Balances} from "./balances";

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

vi.mock("viem", async () => {
  const actual = await vi.importActual("viem");
  return {
    ...actual,
    createPublicClient: vi.fn(() => ({
      getBalance: vi.fn(() => BigInt("1000000000000000000")),
      multicall: vi.fn(() => [
        {result: BigInt("1000000")}, // 1 USDC (with 6 decimals)
      ]),
    })),
    formatEther: (value: bigint) =>
      (BigInt(value) / BigInt(10 ** 18)).toString(),
    formatUnits: (value: bigint, decimals: number) =>
      (BigInt(value) / BigInt(10 ** decimals)).toString(),
  };
});

describe("fetchEVMNativeBalance", () => {
  it("returns correct native balance and USD value", async () => {
    const result = await fetchEVMNativeBalance(
      "0xabc",
      1,
      "Ethereum",
      "Ether",
      "ETH",
      18,
      "2000",
      ["https://mock-rpc.com"]
    );

    expect(result.amount).toBe("1");
    expect(result.usd).toBe(2000);
  });

  it("handles missing walletAddress", async () => {
    const result = await fetchEVMNativeBalance(
      "", // missing wallet
      1,
      "Ethereum",
      "Ether",
      "ETH",
      18,
      "2000",
      ["https://mock-rpc"]
    );

    expect(result.amount).toBeNull();
    expect(result.usd).toBeNull();
    expect(result.error).toMatch(/Invalid or missing input parameters/);
  });
});

describe("fetchERC20Balances", () => {
  it("returns token balances and USD values", async () => {
    const result = await fetchERC20Balances(
      "0xabc123",
      mockTokens,
      "0xmulticall",
      1,
      "Ethereum",
      "Ether",
      "ETH",
      18,
      ["https://mock-rpc"]
    );

    expect(result.balances[0].symbol).toBe("USDC");
    expect(result.balances[0].usdValue).toBe(1);
    expect(result.totalUsd).toBe(1);
  });

  it("handles empty token list", async () => {
    const result = await fetchERC20Balances(
      "0xabc123",
      [], // empty token list
      "0xmulticall",
      1,
      "Ethereum",
      "Ether",
      "ETH",
      18,
      ["https://mock-rpc"]
    );

    expect(result.balances).toHaveLength(0);
    expect(result.totalUsd).toBe(0);
    expect(result.error).toBe("No tokens provided.");
  });
});
