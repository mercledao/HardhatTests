const { expect } = require("chai");

describe("HistoricBalanceOf", () => {
  it("should get balanceOf by blockId", async () => {
    const erc20Abi = [
      "constructor(string symbol, string name)",
      "function balanceOf(address owner) view returns (uint balance)",
    ];
    const provider = ethers.getDefaultProvider(1, {
      etherscan: process.env.ETHERSCAN_API_KEY,
      infura: {
        projectId: process.env.INFURA_API_KEY,
        projectSecret: process.env.INFURA_SECRET_KEY,
      },
      alchemy: process.env.ALCHEMY_API_KEY,
      pocket: {
        applicationId: process.env.POCKET_API_KEY,
        applicationSecretKey: process.POCKET_SECRET_KEY,
      },
    });

    const token = new ethers.Contract("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", erc20Abi, provider);
    console.log({
      old: (await token.balanceOf("0x8c1aB48dBf74E73CAEb2B46AfC028060b21242d4", { blockTag: 16573183 })).toString(),
      current: (await token.balanceOf("0x8c1aB48dBf74E73CAEb2B46AfC028060b21242d4")).toString(),
    });
  });
});
