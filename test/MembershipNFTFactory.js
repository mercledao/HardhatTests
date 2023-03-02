const { expect } = require("chai");

const mercleAddress = "0xeCE207e717365d67f87e1aE5cAc715Cf60208e63";
const forwarderAddress = "0xE041608922d06a4F26C0d4c27d8bCD01daf1f792";

describe("Test MembershipNFTFactory", () => {
  it("should deploy new NFT from Factory and upgrade it", async () => {
    const [owner] = await ethers.getSigners();

    const MembershipNFTFactory = await ethers.getContractFactory("MembershipNFTFactory");
    const nftFactory = await MembershipNFTFactory.deploy(mercleAddress, forwarderAddress);

    expect(await nftFactory.claimIssuer()).equal(mercleAddress);

    await nftFactory.deployContract(
      owner.address,
      "0x6314366bd52be1fb78274d6a",
      "Awesome Test NFT",
      "ATNFT",
      "My upgradable awesome test NFT",
      "0x63c5071b57273ebfcd1c0a44",
      "0xfa291557a4b526785c28677a4a5f0921d2c66a5dce9e2049b03a367cfaf26b74",
      1891584796,
      false,
      false
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
        1891584796,
        false,
        false
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
        1891584796,
        false,
        false
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
        1891584796,
        false,
        false
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
        1891584796,
        false,
        false
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

describe("Test MembershipNFT", () => {
  it("cannot mint campaign twice with same proof", async () => {
    const [owner, owner2] = await ethers.getSigners();
    const MembershipNFTFactory = await ethers.getContractFactory("MembershipNFTFactory");
    const nftFactory = await MembershipNFTFactory.deploy(mercleAddress, forwarderAddress);
    await nftFactory
      .connect(owner)
      .deployContract(
        owner.address,
        "0x6314366bd52be1fb78274d6a",
        "Mercle Test",
        "MERCLE",
        "Mercle NFT Token",
        "0x63d7dbc61ed63f114d73f394",
        "0xf1b85dede07df57f974a35212b9b5df15ef63349b4628ab7317a3d23867b7758",
        1706626887,
        false,
        false
      );

    const wallet = new ethers.Wallet("0x902421e6626c0c1b7cae8fd7f032e1f44a8ad3f8f22e4858e0a6eade75fdfc96");
    const msghash = ethers.utils.solidityKeccak256(["bytes12"], ["0x63d7dbc61ed63f114d73f394"]);
    const sign = await wallet.signMessage(ethers.utils.arrayify(msghash));

    const membershipNft = await upgrades.forceImport(
      await nftFactory.getNft(0),
      await ethers.getContractFactory("MembershipNFT"),
      {
        constructorArgs: [forwarderAddress],
        kind: "uups",
      }
    );

    await membershipNft
      .connect(owner2)
      .mintNFTCampaign(
        "0x63d7dbc61ed63f114d73f394",
        ["0x396204952bad5e9752b7dc95f950dde89efc2320efc29c3a2cf9fd622494e285"],
        sign,
        owner.address,
        "http://zool.timesnap.xyz"
      );

    try {
      await membershipNft
        .connect(owner2)
        .mintNFTCampaign(
          "0x63d7dbc61ed63f114d73f394",
          ["0x396204952bad5e9752b7dc95f950dde89efc2320efc29c3a2cf9fd622494e285"],
          sign,
          owner.address,
          "http://zool.timesnap.xyz"
        );
      expect(false).to.equal(true);
    } catch (e) {
      expect("cannot mint").to.equal("cannot mint");
    }
  });
  it("setIsOpenMint should allow anybody to mint but it can only be set by admin", async () => {
    const [owner, owner2] = await ethers.getSigners();
    const MembershipNFTFactory = await ethers.getContractFactory("MembershipNFTFactory");
    const nftFactory = await MembershipNFTFactory.deploy(mercleAddress, forwarderAddress);
    await nftFactory
      .connect(owner)
      .deployContract(
        owner.address,
        "0x6314366bd52be1fb78274d6a",
        "Mercle Test",
        "MERCLE",
        "Mercle NFT Token",
        "0x000000000000000000000000",
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        0,
        false,
        false
      );

    const membershipNft = await upgrades.forceImport(
      await nftFactory.getNft(0),
      await ethers.getContractFactory("MembershipNFT"),
      {
        constructorArgs: [forwarderAddress],
        kind: "uups",
      }
    );
    try {
      await membershipNft.connect(owner2).mintNFT(owner2.address, "https://zool.timesnap.xyz");
      expect(false).equals(true);
    } catch (e) {
      expect(e.message.indexOf("DOES_NOT_HAVE_MINTER_ROLE") > -1).equals(true);
    }

    // test only admin can change isOpenMint state
    expect(await membershipNft.isOpenMint()).equals(false);
    try {
      await membershipNft.connect(owner2).setIsOpenMint(true);
      expect(false).equals(true);
    } catch (e) {
      expect(e.message.indexOf("NOT_AUTHORIZED") > -1).equals(true);
    }
    await membershipNft.connect(owner).setIsOpenMint(true);
    expect(await membershipNft.isOpenMint()).equals(true);

    // test anybody can mint
    await membershipNft.connect(owner2).mintNFT(owner2.address, "https://zool.timesnap.xyz");
    expect(await membershipNft.balanceOf(owner2.address)).equals(1);
  });

  it("setIsTradable should allow transfer of tokens it can only be set by admin", async () => {
    const [owner, owner2] = await ethers.getSigners();
    const MembershipNFTFactory = await ethers.getContractFactory("MembershipNFTFactory");
    const nftFactory = await MembershipNFTFactory.deploy(mercleAddress, forwarderAddress);
    await nftFactory
      .connect(owner)
      .deployContract(
        owner.address,
        "0x6314366bd52be1fb78274d6a",
        "Mercle Test",
        "MERCLE",
        "Mercle NFT Token",
        "0x000000000000000000000000",
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        0,
        false,
        false
      );

    const membershipNft = await upgrades.forceImport(
      await nftFactory.getNft(0),
      await ethers.getContractFactory("MembershipNFT"),
      {
        constructorArgs: [forwarderAddress],
        kind: "uups",
      }
    );
    await membershipNft.connect(owner).mintNFT(owner.address, "https://zool.timesnap.xyz");

    try {
      await membershipNft.connect(owner).transferFrom(owner.address, owner2.address, 1);
      expect(false).equals(true);
    } catch (e) {
      expect(e.message.indexOf("This a Soulbound token") > -1).equals(true);
    }

    // test only admin can change isOpenMint state
    expect(await membershipNft.isOpenMint()).equals(false);
    try {
      await membershipNft.connect(owner2).setIsTradable(true);
      expect(false).equals(true);
    } catch (e) {
      expect(e.message.indexOf("NOT_AUTHORIZED") > -1).equals(true);
    }
    await membershipNft.connect(owner).setIsTradable(true);
    expect(await membershipNft.isTradable()).equals(true);

    await membershipNft.connect(owner).transferFrom(owner.address, owner2.address, 1);
    expect(await membershipNft.balanceOf(owner.address)).eq(0);
    expect(await membershipNft.balanceOf(owner2.address)).eq(1);
  });

  it("setIsOpenMing and setIsTradable with constructor", async () => {
    const [owner, owner2, owner3] = await ethers.getSigners();
    const MembershipNFTFactory = await ethers.getContractFactory("MembershipNFTFactory");
    const nftFactory = await MembershipNFTFactory.deploy(mercleAddress, forwarderAddress);
    await nftFactory
      .connect(owner)
      .deployContract(
        owner.address,
        "0x6314366bd52be1fb78274d6a",
        "Mercle Test",
        "MERCLE",
        "Mercle NFT Token",
        "0x000000000000000000000000",
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        0,
        true,
        true
      );

    const membershipNft = await upgrades.forceImport(
      await nftFactory.getNft(0),
      await ethers.getContractFactory("MembershipNFT"),
      {
        constructorArgs: [forwarderAddress],
        kind: "uups",
      }
    );
    await membershipNft.connect(owner2).mintNFT(owner2.address, "https://zool.timesnap.xyz");
    expect(await membershipNft.balanceOf(owner2.address)).eq(1);

    await membershipNft.connect(owner2).transferFrom(owner2.address, owner3.address, 1);
    expect(await membershipNft.balanceOf(owner2.address)).eq(0);
    expect(await membershipNft.balanceOf(owner3.address)).eq(1);
  });
});
