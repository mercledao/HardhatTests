const { expect } = require("chai");

describe("Test deployed contract", () => {
  it("should deploy NFT contract", async () => {
    const [owner] = await ethers.getSigners();

    const MembershipNFTPlain = await ethers.getContractFactory("MembershipNFTPlain");
    const membershipNFT = await MembershipNFTPlain.deploy(
      "0xE041608922d06a4F26C0d4c27d8bCD01daf1f792",
      "0x6314366bd52be1fb78274d6a",
      owner.address,
      "Awesome Test NFT",
      "ATNFT",
      "This is a test NFT used to verify hardhat features",
      "0x63d7dbc61ed63f114d73f394", // optional, pass 0x0..
      "0xf1b85dede07df57f974a35212b9b5df15ef63349b4628ab7317a3d23867b7758", // optional, pass 0x0..
      "1706626887" // optional, pass 0
    );
    expect(await membershipNFT.campaignExist("0x63d7dbc61ed63f114d73f393")).to.equal(false);
    expect(await membershipNFT.campaignExist("0x63d7dbc61ed63f114d73f394")).to.equal(true);
  });
});

describe("Test mint contract", () => {
  it("should be able to mint once", async () => {
    const [owner] = await ethers.getSigners();

    const wallet = new ethers.Wallet("0x902421e6626c0c1b7cae8fd7f032e1f44a8ad3f8f22e4858e0a6eade75fdfc96");
    const msghash = ethers.utils.solidityKeccak256(["bytes12"], ["0x63d7dbc61ed63f114d73f394"]);
    const sign = await wallet.signMessage(ethers.utils.arrayify(msghash));

    const MembershipNFTPlain = await ethers.getContractFactory("MembershipNFTPlain");
    const membershipNFT = await MembershipNFTPlain.deploy(
      "0xE041608922d06a4F26C0d4c27d8bCD01daf1f792",
      "0x6314366bd52be1fb78274d6a",
      owner.address,
      "Awesome Test NFT",
      "ATNFT",
      "This is a test NFT used to verify hardhat features",
      "0x63d7dbc61ed63f114d73f394", // optional, pass 0x0..
      "0xf1b85dede07df57f974a35212b9b5df15ef63349b4628ab7317a3d23867b7758", // optional, pass 0x0..
      "1706626887" // optional, pass 0
    );
    console.log("mint first time");

    await membershipNFT.mintNFTCampaign(
      "0x63d7dbc61ed63f114d73f394",
      ["0x396204952bad5e9752b7dc95f950dde89efc2320efc29c3a2cf9fd622494e285"],
      sign,
      owner.address,
      "http://zool.timesnap.xyz"
    );

    console.log("mint second time");
    try {
      await membershipNFT.mintNFTCampaign(
        "0x63d7dbc61ed63f114d73f394",
        ["0x396204952bad5e9752b7dc95f950dde89efc2320efc29c3a2cf9fd622494e285"],
        sign,
        owner.address,
        "http://zool.timesnap.xyz"
      );
      expect("cannot mint").to.equal(false);
    } catch (e) {
      expect("cannot mint").to.equal("cannot mint");
    }
  });
});
