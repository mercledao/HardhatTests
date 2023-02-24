const { ethers } = require("hardhat");

const trackToTxns = {
  1: {
    containsAddrs: [{ address: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", name: "usdc" }],
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": { name: "usdc" },
  },

  137: {
    containsAddrs: [{ address: "2791bca1f2de4661ed88a30c99a7a9449aa84174", name: "usdc" }],
    "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174": { name: "usdc" },
  },
};

const listenToTxns = ({ rpcUrl, chainId }) => {
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl); // connect to the Hardhat Network
  provider.on("block", async (blockNumber) => {
    const block = await provider.getBlockWithTransactions(blockNumber);
    console.log(block);
    block.transactions.forEach((tx) => {
      if (trackToTxns[chainId][tx.from]) {
        console.log(
          `txn::chainId: ${chainId} blockNumber: ${blockNumber}  hash: ${tx.hash}  from: ${tx.from}  to: ${tx.to}`
        );
        return;
      }
      for (let i = 0; i < trackToTxns[chainId].containsAddrs.length; i++) {
        const addressDetail = trackToTxns[chainId].containsAddrs[i];
        if (tx.data.indexOf(addressDetail.address) > -1) {
          console.log(
            `InData::chainId: ${chainId} blockNumber: ${blockNumber}  hash: ${tx.hash}  from: ${tx.from}  to: ${tx.to}`
          );
          break;
        }
      }
    });
  });
};

const main = async () => {
  listenToTxns({ rpcUrl: "https://eth-mainnet.alchemyapi.io/v2/vma47TKOLkZ-xH_XQh1tQFfLADEJiHQt", chainId: 1 });
  listenToTxns({
    rpcUrl: "https://rpc-mainnet.maticvigil.com/v1/7946c991b3854b139ba413743294e925ca078af5",
    chainId: 137,
  });
};

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
