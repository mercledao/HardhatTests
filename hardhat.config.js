require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("hardhat-contract-sizer");
require("hardhat-abi-exporter");
require("@nomiclabs/hardhat-etherscan");

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "/.env") });
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    goerli: {
      url: "https://eth-goerli.alchemyapi.io/v2/vma47TKOLkZ-xH_XQh1tQFfLADEJiHQt",
      chainId: 5,
      accounts: [`0x${process.env.MERCLE_WALLET_PRIV_KEY}`],
    },
    ethereum: {
      url: "https://eth-mainnet.alchemyapi.io/v2/vma47TKOLkZ-xH_XQh1tQFfLADEJiHQt",
      chainId: 1,
    },
    polygon: {
      url: "https://rpc-mainnet.maticvigil.com/v1/7946c991b3854b139ba413743294e925ca078af5",
      chainId: 137,
    },
  },
  abiExporter: { path: "./abis", clear: true, flat: true, only:["MembershipNFT$","MembershipNFTFactory$"] },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
