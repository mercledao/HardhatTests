const { expect } = require("chai");

describe("BlockListen", () => {
  it("should listen to recent eth blocks", async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://eth-goerli.alchemyapi.io/v2/123abc123abc123abc123abc123abcde"
    );
    provider.on("block", async (blockNumber) => {
      console.log(`New block detected: #${blockNumber}`);
      const block = await provider.getBlock(blockNumber);
      console.log(block.transactions);
    });

    await new Promise((res, rej) => {});
  });
});
