import type { Config } from "@ponder/core";
import { http, parseAbiItem } from "viem";

export const config: Config = {
  networks: [
    {
      name: "mainnet",
      chainId: 1,
      pollingInterval: 1000,
      maxRpcRequestConcurrency: 2,
      transport: http(process.env.PONDER_RPC_URL_1),
    },
  ],
  filters: [
  //   {
  //   name: "L2OutputOracle",
  //   startBlock: 17365801,
  //   network: "mainnet",
  //   abi: "/Users/dennisonbertram/Develop/superchain-explorer-ponder/abis/L2OutputOracle_0xd2e6.json",
  //   filter: {
  //     event: parseAbiItem("event Initialized(uint8 version)")
  //   }
  // },
  {
    name: "L2OutputOracle",
    startBlock: 17365801,
    network: "mainnet",
    abi: "/Users/dennisonbertram/Develop/superchain-explorer-ponder/abis/L2OutputOracle_0xd2e6.json",
    filter: {
      event: parseAbiItem("event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)")
    }
  },
  {
    name: "L2OutputOracle",
    startBlock: 17365801,
    network: "mainnet",
    abi: "/Users/dennisonbertram/Develop/superchain-explorer-ponder/abis/L2OutputOracle_0xd2e6.json",
    filter: {
      event: parseAbiItem("event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)")
    }
  },
  {
    name: "Proxy",
    startBlock: 17365801,
    network: "mainnet",
    abi: "/Users/dennisonbertram/Develop/superchain-explorer-ponder/abis/Proxy.json",
    filter: {
      event: parseAbiItem("event AdminChanged(address previousAdmin, address newAdmin)")
    }
  },
  {
    name: "Proxy",
    startBlock: 17365801,
    network: "mainnet",
    abi: "/Users/dennisonbertram/Develop/superchain-explorer-ponder/abis/Proxy.json",
    filter: {
      event: parseAbiItem("event Upgraded(address indexed implementation)")
    }
  }]
  // contracts: [
  //   {
  //     name: "Proxy",
  //     network: "mainnet",
  //     abi: ["./abis/Proxy.json", "./abis/L2OutputOracle_0xd2e6.json"],
  //     address: "0xdfe97868233d1aa22e815a266982f2cf17685a27",
  //     startBlock: 17365801,
  //   },
  // ],
};
