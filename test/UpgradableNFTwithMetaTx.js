const { upgrades } = require("hardhat");

const { expect } = require("chai");

describe("Test UpgradableNFTwithMetaTx", () => {
  it("should deploy contract with proper trusted forwarder", async () => {
    const [owner] = await ethers.getSigners();

    const forwarderAddress = "0xE041608922d06a4F26C0d4c27d8bCD01daf1f792";

    const UpgradableNFTwithMetaTx = await ethers.getContractFactory("UpgradableNFTwithMetaTx");
    const upgradableNFTwithMetaTx = await upgrades.deployProxy(
      UpgradableNFTwithMetaTx,
      [owner.address, "Awesome Test NFT", "ATNFT", "This is a test NFT used to verify hardhat features"],
      { constructorArgs: [forwarderAddress] }
    );

    expect(await upgradableNFTwithMetaTx.name()).equals("Awesome Test NFT");
    expect(await upgradableNFTwithMetaTx.symbol()).equals("ATNFT");
    expect(await upgradableNFTwithMetaTx.hello()).equals("bello");
    expect(await upgradableNFTwithMetaTx.isTrustedForwarder(owner.address)).equals(false);
    expect(await upgradableNFTwithMetaTx.isTrustedForwarder(forwarderAddress)).equals(true);
  });

  it("should upgrade deployed contract with trusted forwarder", async () => {
    const [owner] = await ethers.getSigners();

    const forwarderAddress = "0xE041608922d06a4F26C0d4c27d8bCD01daf1f792";

    const UpgradableNFTwithMetaTx = await ethers.getContractFactory("UpgradableNFTwithMetaTx");
    const upgradableNFTwithMetaTx = await upgrades.deployProxy(
      UpgradableNFTwithMetaTx,
      [owner.address, "Awesome Test NFT", "ATNFT", "This is a test NFT used to verify hardhat features"],
      { constructorArgs: [forwarderAddress] }
    );

    expect(await upgradableNFTwithMetaTx.hello()).equals("bello");

    const UpgradedNFTwithMetaTx = await ethers.getContractFactory("UpgradedNFTwithMetaTx");
    await upgrades.upgradeProxy(upgradableNFTwithMetaTx.address, UpgradedNFTwithMetaTx, {
      constructorArgs: [forwarderAddress],
    });

    const upgradedContract = await ethers.getContractAt("UpgradedNFTwithMetaTx", upgradableNFTwithMetaTx.address);
    expect(await upgradedContract.hello()).equals("bello and mello");

    expect(await upgradedContract.isTrustedForwarder(owner.address)).equals(false);
    expect(await upgradedContract.isTrustedForwarder(forwarderAddress)).equals(true);
  });
});
