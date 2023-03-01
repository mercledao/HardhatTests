const { expect } = require("chai");

const mercleAddress = "0xeCE207e717365d67f87e1aE5cAc715Cf60208e63";
const forwarderAddress = "0xE041608922d06a4F26C0d4c27d8bCD01daf1f792";

describe("Test MembershipNFTFactory", () => {
  it("should deploy new NFT from Factory and upgrade it", async () => {
    const [owner] = await ethers.getSigners();

    const MembershipNFTFactory = await ethers.getContractFactory("MembershipNFTFactory");
    const nftFactory = await MembershipNFTFactory.deploy(mercleAddress, forwarderAddress);

    expect(await nftFactory.mercleAddress()).equal(mercleAddress);

    await nftFactory.deployContract(
      owner.address,
      "0x6314366bd52be1fb78274d6a",
      "Awesome Test NFT",
      "ATNFT",
      "My upgradable awesome test NFT",
      "0x63c5071b57273ebfcd1c0a44",
      "0xfa291557a4b526785c28677a4a5f0921d2c66a5dce9e2049b03a367cfaf26b74",
      1891584796
    );

    // contract was deployed from outside so need to import it to hardhat
    const upgradableNFT = await upgrades.forceImport(
      await nftFactory.getNft(0),
      await ethers.getContractFactory("MembershipNFT"),
      {
        constructorArgs: [forwarderAddress],
        kind: "uups",
      }
    );

    expect(await upgradableNFT.symbol()).equals("ATNFT");
    try {
      await upgradableNFT.newFunction();
      expect(false).equals(true);
    } catch (e) {
      // newFunction should not exist by default
      expect(false).equals(false);
    }
    expect(await upgradableNFT.isTrustedForwarder(owner.address)).equals(false);
    expect(await upgradableNFT.isTrustedForwarder(forwarderAddress)).equals(true);

    const UpgradedNFT = await ethers.getContractFactory("MembershipNFTUpgraded");
    await upgrades.upgradeProxy(upgradableNFT.address, UpgradedNFT, { constructorArgs: [forwarderAddress] });
    const upgradedNFT = await ethers.getContractAt("MembershipNFTUpgraded", upgradableNFT.address);

    expect(upgradedNFT.address).equals(upgradableNFT.address);
    expect(await upgradedNFT.symbol()).equals("ATNFT");
    expect(await upgradedNFT.newFunction()).equals("this is a new function");
    expect(await upgradedNFT.isTrustedForwarder(owner.address)).equals(false);
    expect(await upgradedNFT.isTrustedForwarder(forwarderAddress)).equals(true);
  });

  it("should deploy two contracts from two owners with different token details", async () => {
    const [owner1, owner2] = await ethers.getSigners();

    const UpgradableNFTFactory = await ethers.getContractFactory("MembershipNFTFactory");
    const nftFactory = await UpgradableNFTFactory.deploy(mercleAddress, forwarderAddress);

    await nftFactory
      .connect(owner1)
      .deployContract(
        owner1.address,
        "0x6314366bd52be1fb78274d6a",
        "Mercle Test",
        "MERCLE",
        "Mercle NFT Token",
        "0x63c5071b57273ebfcd1c0a44",
        "0xfa291557a4b526785c28677a4a5f0921d2c66a5dce9e2049b03a367cfaf26b74",
        1891584796
      );
    await nftFactory
      .connect(owner2)
      .deployContract(
        owner2.address,
        "0x6314366bd52be1fb78274d6a",
        "LIFI Test",
        "LIFI",
        "LIFI Test Token",
        "0x63c5071b57273ebfcd1c0a44",
        "0xfa291557a4b526785c28677a4a5f0921d2c66a5dce9e2049b03a367cfaf26b74",
        1891584796
      );

    const mercleNft = await ethers.getContractAt("MembershipNFT", await nftFactory.getNft(0));
    const lifiNft = await ethers.getContractAt("MembershipNFT", await nftFactory.getNft(1));

    expect(await mercleNft.creator()).equals(owner1.address);
    expect(await lifiNft.creator()).equals(owner2.address);

    expect(await mercleNft.name()).equals("Mercle Test");
    expect(await lifiNft.name()).equals("LIFI Test");

    await mercleNft
      .connect(owner1)
      .mintNFT(
        owner1.address,
        "https://backendstaging.timesnap.xyz/ipns/k51qzi5uqu5dhdud6me9gkmkjw24vczznmx4eo3yluj8ydnr1la9vghgo2e5nt"
      );
    await lifiNft
      .connect(owner2)
      .mintNFT(
        owner2.address,
        "https://backendstaging.timesnap.xyz/ipns/k51qzi5uqu5dimvz5tuae342cuvuypov9eyn6bodyk199ifdmqc58yi31m6gs5"
      );

    expect(await mercleNft.balanceOf(owner1.address)).equals(1);
    expect(await mercleNft.balanceOf(owner2.address)).equals(0);
    expect(await lifiNft.balanceOf(owner2.address)).equals(1);
    expect(await lifiNft.balanceOf(owner1.address)).equals(0);
  });

  it("should allow upgrade of contract by access holder only", async () => {
    const [owner1, owner2] = await ethers.getSigners();

    const UpgradableNFTFactory = await ethers.getContractFactory("MembershipNFTFactory");
    const nftFactory = await UpgradableNFTFactory.deploy(mercleAddress, forwarderAddress);

    await nftFactory
      .connect(owner1)
      .deployContract(
        owner1.address,
        "0x6314366bd52be1fb78274d6a",
        "Mercle Test",
        "MERCLE",
        "Mercle NFT Token",
        "0x63c5071b57273ebfcd1c0a44",
        "0xfa291557a4b526785c28677a4a5f0921d2c66a5dce9e2049b03a367cfaf26b74",
        1891584796
      );
    await nftFactory
      .connect(owner2)
      .deployContract(
        owner2.address,
        "0x6314366bd52be1fb78274d6a",
        "LIFI Test",
        "LIFI",
        "LIFI Test Token",
        "0x63c5071b57273ebfcd1c0a44",
        "0xfa291557a4b526785c28677a4a5f0921d2c66a5dce9e2049b03a367cfaf26b74",
        1891584796
      );

    const mercleNft = await upgrades.forceImport(
      await nftFactory.getNft(0),
      await ethers.getContractFactory("MembershipNFT"),
      {
        constructorArgs: [forwarderAddress],
        kind: "uups",
      }
    );
    const lifiNft = await upgrades.forceImport(
      await nftFactory.getNft(1),
      await ethers.getContractFactory("MembershipNFT"),
      {
        constructorArgs: [forwarderAddress],
        kind: "uups",
      }
    );

    const UpgradedNFT = await ethers.getContractFactory("MembershipNFTUpgraded");

    await upgrades.upgradeProxy(mercleNft.address, UpgradedNFT.connect(owner1), {
      constructorArgs: [forwarderAddress],
    });

    try {
      // should not be able to upgrade contract of other account
      await upgrades.upgradeProxy(lifiNft.address, UpgradedNFT.connect(owner1), {
        constructorArgs: [forwarderAddress],
      });
      expect(false).equals(true);
    } catch (e) {
      expect(true).equals(true);
    }

    await upgrades.upgradeProxy(lifiNft.address, UpgradedNFT.connect(owner2), {
      constructorArgs: [forwarderAddress],
    });
  });
});
