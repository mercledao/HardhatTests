const { expect } = require("chai");

const profileData = {
  name: "Nischit Pradhan",
  description: "I like to learn new things!",
  image: "ipfs://bafkreibhoidbaunlnybwncrvqktrkzqejowjrqvrjq3xzkp6vnmpoyppdy",
  animation_url: "ipfs://bafkreieufjkfqknfzivoejyvhrzii7m6smdqbv5gls4xshsvnw6pgfrrpq",
  attributes: [
    {
      display_type: "boost_number",
      trait_type: "XP",
      value_type: "XP",
      value: 30,
      claims: {
        "0x63f72e8458a23ab13b0437ca": {
          request: {
            domain: {
              name: "Claim Reward Vinyl Singles Track",
              version: "1",
              chainId: 5,
              verifyingContract: "0xFF236D360d16707f22b22285Cb24900D62CaFD4F",
            },
            types: {
              Reward: [
                { name: "id", type: "bytes12" },
                { name: "name", type: "string" },
                { name: "description", type: "string" },
                { name: "image", type: "string" },
                { name: "xp", type: "uint256" },
                { name: "to", type: "address" },
                { name: "delegate", type: "address" },
                { name: "requestAt", type: "uint256" },
              ],
            },
            message: {
              id: "0x63f72e8458a23ab13b0437ca",
              name: "Vinyl Singles Track",
              description: "Virtual Vinyl Singles Tracks from the 10 KOL, available on LGND Music",
              image: "https://storage-daohook-staging.s3.amazonaws.com/community/zool/events/image+10.png",
              xp: 20,
              to: "0xA0e44Be4C5fbA68D03C1295fE162B74DC6ec3053",
              delegate: "0xA0e44Be4C5fbA68D03C1295fE162B74DC6ec3053",
              requestAt: 1677500079,
            },
            sign: "0x1fc613b1ea8cbd7322f6025f86bb7b140fcd4005c622cf844c956993ef4deee02fd3c6f7800040a6d16ebff5aa5f8518ab63429000a7ef4d50129daf460ea9641b",
          },
          attestedByMercle: {
            domain: {
              name: "Attest Claims",
              version: "1",
              chainId: 5,
              verifyingContract: "0xFF236D360d16707f22b22285Cb24900D62CaFD4F",
            },
            types: {
              AttestClaim: [
                { name: "delegateSign", type: "bytes" },
                { name: "from", type: "address" },
                { name: "issueAt", type: "uint256" },
                { name: "miscClaims", type: "Reward[]" },
              ],
              Reward: [
                { name: "id", type: "bytes12" },
                { name: "name", type: "string" },
                { name: "description", type: "string" },
                { name: "image", type: "string" },
                { name: "xp", type: "uint256" },
                { name: "to", type: "address" },
                { name: "delegate", type: "address" },
                { name: "requestAt", type: "uint256" },
              ],
            },
            message: {
              delegateSign:
                "0x1fc613b1ea8cbd7322f6025f86bb7b140fcd4005c622cf844c956993ef4deee02fd3c6f7800040a6d16ebff5aa5f8518ab63429000a7ef4d50129daf460ea9641b",
              from: "0xeCE207e717365d67f87e1aE5cAc715Cf60208e63",
              issueAt: 1677500085,
              miscClaims: [
                {
                  id: "0x63f8b22ff6fac9595a07b919",
                  name: "Long Curly Hair",
                  description: "Very sikly and nourished air",
                  image:
                    "https://storage-daohook-staging.s3.amazonaws.com/community/zool/events/Style%3DLong+curly.png",
                  xp: 10,
                  to: "0xA0e44Be4C5fbA68D03C1295fE162B74DC6ec3053",
                  delegate: "0xeCE207e717365d67f87e1aE5cAc715Cf60208e63",
                  requestAt: 1677500084,
                },
              ],
            },
            sign: "0xfe0b407c72a5e5cd12cf47c34f0e5edef431b9fcbb04cc28c4b94621c15936313b6d6138d7fffd9ff16ca8319ef92d4e50b10cb2b5ca893978bead1d45ea05d71b",
          },
        },
      },
    },
  ],
};

const profileDataAttestedByMercleWithoutMiscClaim = {
  name: "Nischit Pradhan",
  description: "I like to learn new things!",
  image: "ipfs://bafkreibhoidbaunlnybwncrvqktrkzqejowjrqvrjq3xzkp6vnmpoyppdy",
  animation_url: "ipfs://bafkreieufjkfqknfzivoejyvhrzii7m6smdqbv5gls4xshsvnw6pgfrrpq",
  attributes: [
    {
      display_type: "boost_number",
      trait_type: "XP",
      value_type: "XP",
      value: 20,
      claims: {
        "0x63f72e8458a23ab13b0437ca": {
          attestedByMercle: {
            domain: {
              name: "Attest Claims",
              version: "1",
              chainId: 5,
              verifyingContract: "0xFF236D360d16707f22b22285Cb24900D62CaFD4F",
            },
            types: {
              AttestClaim: [
                { name: "delegateSign", type: "bytes" },
                { name: "from", type: "address" },
                { name: "issueAt", type: "uint256" },
              ],
            },
            message: {
              delegateSign:
                "0xf13d691163306eec1a9d6e181a6143adcaddbd68cb0be42d49f9c0a5637283a44ee02adace2dd3d5ddf60029c241f2c85e4dc441cf9c66f49a09e137374ecbc61c",
              from: "0xeCE207e717365d67f87e1aE5cAc715Cf60208e63",
              issueAt: 1677499973,
            },
            sign: "0x5a19f9a8711dcea58e5892b365a85d1e98697af7cba532eca857b3bc850b7f18465509d3c8ede44aaa52ede3758e4e99e6939acef235e79bd84ca01d4eda584d1b",
          },
        },
      },
    },
  ],
};

describe("VerifyTypedSign contract", () => {
  it("Deployment should verify user reward request data", async () => {
    const [owner] = await ethers.getSigners();

    const request = profileData.attributes[0].claims["0x63f72e8458a23ab13b0437ca"].request;

    const delegateAddress = ethers.utils.verifyTypedData(request.domain, request.types, request.message, request.sign);
    console.log("ethers verification", delegateAddress, request.message.delegate);
    expect(delegateAddress).to.equal(request.message.delegate);

    const VerifyTypedSign = await ethers.getContractFactory("VerifyTypedSign");
    const verifyTypedSign = await VerifyTypedSign.deploy();

    const [vouchFrom, isVerified] = await verifyTypedSign.verifyClaimRequest(
      request.domain,
      request.message,
      request.sign
    );
    console.log(vouchFrom, isVerified);
    expect(vouchFrom).to.equal(request.message.delegate);
    expect(isVerified).to.equal(true);
  });

  it("Deployment should verify mercle attested claim wihout miscClaim data", async () => {
    const [owner] = await ethers.getSigners();

    const request =
      profileDataAttestedByMercleWithoutMiscClaim.attributes[0].claims["0x63f72e8458a23ab13b0437ca"].attestedByMercle;

    const requesterAddress = ethers.utils.verifyTypedData(request.domain, request.types, request.message, request.sign);
    console.log("ethers verification", requesterAddress, request.message.from);
    expect(requesterAddress).to.equal(request.message.from);

    const VerifyTypedSign = await ethers.getContractFactory("VerifyTypedSign");
    const verifyTypedSign = await VerifyTypedSign.deploy();

    const [vouchFrom, isVerified] = await verifyTypedSign.verifyAttestedByMercle(
      request.domain,
      { ...request.message, miscClaims: [] },
      request.sign
    );
    console.log(vouchFrom, isVerified);
    expect(vouchFrom).to.equal(request.message.from);
    expect(isVerified).to.equal(true);
  });

  it("Deployment should verify mercle attested claim with miscClaim data", async () => {
    const [owner] = await ethers.getSigners();

    const request = profileData.attributes[0].claims["0x63f72e8458a23ab13b0437ca"].attestedByMercle;

    const requesterAddress = ethers.utils.verifyTypedData(request.domain, request.types, request.message, request.sign);
    console.log("ethers verification", requesterAddress, request.message.from);
    expect(requesterAddress).to.equal(request.message.from);

    const VerifyTypedSign = await ethers.getContractFactory("VerifyTypedSign");
    const verifyTypedSign = await VerifyTypedSign.deploy();

    const [vouchFrom, isVerified] = await verifyTypedSign.verifyAttestedByMercle(
      request.domain,
      request.message,
      request.sign
    );
    console.log(vouchFrom, isVerified);
    expect(vouchFrom).to.equal(request.message.from);
    expect(isVerified).to.equal(true);
  });
});
