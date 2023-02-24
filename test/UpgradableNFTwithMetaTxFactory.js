const { expect } = require("chai");

const forwarderAddress = "0xE041608922d06a4F26C0d4c27d8bCD01daf1f792";

describe("Test UpgradableNFTwithMetaTxFactory", () => {
  it("should deploy a new UpgradableNFTwithMetaTxFactory contract and be upgraded to UpgradedNFTwithMetaTx", async () => {
    const [owner] = await ethers.getSigners();

    const UpgradableNFTwithMetaTxFactory = await ethers.getContractFactory("UpgradableNFTwithMetaTxFactory");
    const nftFactory = await UpgradableNFTwithMetaTxFactory.deploy(forwarderAddress);
    await nftFactory.deployContract(owner.address, "Awesome Test NFT", "ATNFT", "My upgradable awesome test NFT");

    // contract was deployed from outside so need to import it to hardhat
    const upgradableNFT = await upgrades.forceImport(
      await nftFactory.getNft(0),
      await ethers.getContractFactory("UpgradableNFTwithMetaTx"),
      {
        constructorArgs: [forwarderAddress],
        kind: "uups",
      }
    );

    expect(await upgradableNFT.symbol()).equals("ATNFT");
    expect(await upgradableNFT.hello()).equals("bello");
    expect(await upgradableNFT.isTrustedForwarder(owner.address)).equals(false);
    expect(await upgradableNFT.isTrustedForwarder(forwarderAddress)).equals(true);

    const UpgradedNFT = await ethers.getContractFactory("UpgradedNFTwithMetaTx");
    await upgrades.upgradeProxy(upgradableNFT.address, UpgradedNFT, { constructorArgs: [forwarderAddress] });
    const upgradedNFT = await ethers.getContractAt("UpgradedNFTwithMetaTx", upgradableNFT.address);

    expect(upgradedNFT.address).equals(upgradableNFT.address);
    expect(await upgradedNFT.symbol()).equals("ATNFT");
    expect(await upgradedNFT.hello()).equals("bello and mello");
    expect(await upgradedNFT.isTrustedForwarder(owner.address)).equals(false);
    expect(await upgradedNFT.isTrustedForwarder(forwarderAddress)).equals(true);
  });

  it("should deploy two contracts from two owners with different token details", async () => {
    const [owner1, owner2] = await ethers.getSigners();

    const UpgradableNFTFactory = await ethers.getContractFactory("UpgradableNFTwithMetaTxFactory");
    const nftFactory = await UpgradableNFTFactory.deploy(forwarderAddress);

    await nftFactory.connect(owner1).deployContract(owner1.address, "Mercle Test", "MERCLE", "Mercle NFT Token");
    await nftFactory.connect(owner2).deployContract(owner2.address, "LIFI Test", "LIFI", "LIFI Test Token");

    const mercleNft = await ethers.getContractAt("UpgradableNFTwithMetaTx", await nftFactory.getNft(0));
    const lifiNft = await ethers.getContractAt("UpgradableNFTwithMetaTx", await nftFactory.getNft(1));

    expect(await mercleNft.creator()).equals(owner1.address);
    expect(await lifiNft.creator()).equals(owner2.address);

    expect(await mercleNft.name()).equals("Mercle Test");
    expect(await lifiNft.name()).equals("LIFI Test");

    await mercleNft
      .connect(owner1)
      .safeMint(
        owner1.address,
        "https://backendstaging.timesnap.xyz/ipns/k51qzi5uqu5dhdud6me9gkmkjw24vczznmx4eo3yluj8ydnr1la9vghgo2e5nt"
      );
    await lifiNft
      .connect(owner2)
      .safeMint(
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

    const UpgradableNFTFactory = await ethers.getContractFactory("UpgradableNFTwithMetaTxFactory");
    const nftFactory = await UpgradableNFTFactory.deploy(forwarderAddress);

    await nftFactory.connect(owner1).deployContract(owner1.address, "Mercle Test", "MERCLE", "Mercle NFT Token");
    await nftFactory.connect(owner2).deployContract(owner2.address, "LIFI Test", "LIFI", "LIFI Test Token");

    const mercleNft = await upgrades.forceImport(
      await nftFactory.getNft(0),
      await ethers.getContractFactory("UpgradableNFTwithMetaTx"),
      {
        constructorArgs: [forwarderAddress],
        kind: "uups",
      }
    );
    const lifiNft = await upgrades.forceImport(
      await nftFactory.getNft(1),
      await ethers.getContractFactory("UpgradableNFTwithMetaTx"),
      {
        constructorArgs: [forwarderAddress],
        kind: "uups",
      }
    );

    const UpgradedNFT = await ethers.getContractFactory("UpgradedNFTwithMetaTx");

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
