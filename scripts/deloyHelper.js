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

module.exports = { main, deployContract, testDeployedContract };
