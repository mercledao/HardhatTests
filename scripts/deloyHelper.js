const hre = require("hardhat");

async function main() {
  const VerifyTypedSign = await hre.ethers.getContractFactory("VerifyTypedSign");
  const verifyTypedSign = await VerifyTypedSign.deploy();

  await verifyTypedSign.deployed();

  console.log(`VerifyTypedSign deployed to ${verifyTypedSign.address}`);
  return { address: verifyTypedSign.address };
}

const deployContract = async () => {
  const VerifyTypedSign = await hre.ethers.getContractFactory("VerifyTypedSign");
  const verifyTypedSign = await VerifyTypedSign.deploy();

  await verifyTypedSign.deployed();

  console.log(`VerifyTypedSign deployed to ${verifyTypedSign.address}`);
  return { address: verifyTypedSign.address };
};

const testDeployedContract = async (address) => {
  const verifyTypedSign = await hre.ethers.getContractAt("VerifyTypedSign", address);

  const domain = {
    name: "Vouch for Nischit Pradhan",
    version: "1",
  };

  const vouch = {
    rating: "🤩",
    helpful: "Very helpful nice",
    note: "nice",
    vouchFor: "0xE52772e599b3fa747Af9595266b527A31611cebd",
    vouchFrom: "0x8D264d965b4484DC4f478aCAcEcCc024Ac21D346",
  };
  const sign =
    "0x26b2d4f25c98616bc3ba95b908ab9441cfaa2f547fd3c1eb12cf6bd45d3df4db316f8d66fd3c0de7404f131f931ddf7fd039ae38e7860e4f0f3596373d5b8a5c1c";

  const [vouchFrom, isVerified] = await verifyTypedSign.verifyVouchSign(domain, vouch, sign);
  console.log(vouchFrom, isVerified);
  return { vouchFrom, isVerified, isVouchFromSame: vouchFrom == vouch.vouchFrom, isVerifiedTrue: isVerified == true };
};

const deployMembershipNFTFactory = async () => {
  const chainId = 5;
  const biconomyForwarders = {
    1: "0x84a0856b038eaAd1cC7E297cF34A7e72685A8693",
    5: "0xE041608922d06a4F26C0d4c27d8bCD01daf1f792",
    100: "0x86C80a8aa58e0A4fa09A69624c31Ab2a6CAD56b8",
    137: "0x86C80a8aa58e0A4fa09A69624c31Ab2a6CAD56b8",
  };
  const MembershipNFTFactory = await hre.ethers.getContractFactory("MembershipNFTFactory");
  const membershipNFTFactory = await MembershipNFTFactory.deploy(
    process.env.MERCLE_WALLET_ADDRESS,
    biconomyForwarders[chainId]
  );

  console.log(`MembershipNFTFactory deployed to ${membershipNFTFactory.address}`);
  return { address: membershipNFTFactory.address };
};

module.exports = { deployMembershipNFTFactory, main, deployContract, testDeployedContract };
