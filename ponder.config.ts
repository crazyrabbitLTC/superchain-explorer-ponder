import type { Config } from "@ponder/core";

export const config: Config = {
  networks: [
    { name: "mainnet", chainId: 1, rpcUrl: process.env.PONDER_RPC_URL_1 },
  ],
  contracts: [
    {
      name: "Proxy",
      network: "mainnet",
      abi: ["./abis/Proxy.json", "./abis/L2OutputOracle_0xd2e6.json"],
      address: "0xdfe97868233d1aa22e815a266982f2cf17685a27",
      startBlock: 17365801,
    },
  ],
};
