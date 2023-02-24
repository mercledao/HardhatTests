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
              verifyingContract: "0x1F3D07D8D1A15db366AE47B2A5542fc5870D1968",
            },
            types: {
              Reward: [
                {
                  name: "id",
                  type: "bytes12",
                },
                {
                  name: "name",
                  type: "string",
                },
                {
                  name: "description",
                  type: "string",
                },
                {
                  name: "image",
                  type: "string",
                },
                {
                  name: "xp",
                  type: "uint256",
                },
                {
                  name: "receiver",
                  type: "address",
                },
                {
                  name: "requester",
                  type: "address",
                },
                {
                  name: "requestAt",
                  type: "uint256",
                },
              ],
            },
            message: {
              description: "Virtual Vinyl Singles Tracks from the 10 KOL, available on LGND Music",
              id: "0x63f72e8458a23ab13b0437ca",
              image: "https://storage-daohook-staging.s3.amazonaws.com/community/zool/events/image+10.png",
              name: "Vinyl Singles Track",
              receiver: "0xE52772e599b3fa747Af9595266b527A31611cebd",
              requestAt: 1677152232,
              requester: "0xE52772e599b3fa747Af9595266b527A31611cebd",
              xp: 20,
            },
            sign: "0x208beb955479706d17874f9a05c9f42ee496c1cf558808caf5d47f0a26160ad07e48e4f2ced50c2b22cb2af94090f5b86c5e0e55d1294dacd0e677f03ddea93c1b",
          },
          attestedByMercle: {
            domain: {
              name: "Attest Claims",
              version: "1",
              chainId: 5,
              verifyingContract: "0x1F3D07D8D1A15db366AE47B2A5542fc5870D1968",
            },
            types: {
              AttestClaim: [
                {
                  name: "requesterSign",
                  type: "bytes",
                },
                {
                  name: "issuer",
                  type: "address",
                },
                {
                  name: "issueAt",
                  type: "uint256",
                },
                {
                  name: "miscClaims",
                  type: "Reward[]",
                },
              ],
              Reward: [
                {
                  name: "id",
                  type: "bytes12",
                },
                {
                  name: "name",
                  type: "string",
                },
                {
                  name: "description",
                  type: "string",
                },
                {
                  name: "image",
                  type: "string",
                },
                {
                  name: "xp",
                  type: "uint256",
                },
                {
                  name: "receiver",
                  type: "address",
                },
                {
                  name: "requester",
                  type: "address",
                },
                {
                  name: "requestAt",
                  type: "uint256",
                },
              ],
            },
            message: {
              requesterSign:
                "0x208beb955479706d17874f9a05c9f42ee496c1cf558808caf5d47f0a26160ad07e48e4f2ced50c2b22cb2af94090f5b86c5e0e55d1294dacd0e677f03ddea93c1b",
              issuer: "0xeCE207e717365d67f87e1aE5cAc715Cf60208e63",
              issueAt: 1677245944,
              miscClaims: [
                {
                  id: "0x63f8b22ff6fac9595a07b919",
                  name: "Long Curly Hair",
                  description: "Very sikly and nourished air",
                  image:
                    "https://storage-daohook-staging.s3.amazonaws.com/community/zool/events/Style%3DLong+curly.png",
                  xp: 10,
                  receiver: "0xE52772e599b3fa747Af9595266b527A31611cebd",
                  requester: "0xeCE207e717365d67f87e1aE5cAc715Cf60208e63",
                  requestAt: 1677245944,
                },
              ],
            },
            sign: "0x1eb0a91e931c28a3c022b139a4e418d9f334286ad02531a1c4ccbb9bf69d3abd7843a94feeac7828ce5d94b2cd70052464b43d69eba0eed27cee6ab5a6be81a01c",
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
              verifyingContract: "0x1F3D07D8D1A15db366AE47B2A5542fc5870D1968",
            },
            types: {
              AttestClaim: [
                {
                  name: "requesterSign",
                  type: "bytes",
                },
                {
                  name: "issuer",
                  type: "address",
                },
                {
                  name: "issueAt",
                  type: "uint256",
                },
              ],
            },
            message: {
              requesterSign:
                "0x208beb955479706d17874f9a05c9f42ee496c1cf558808caf5d47f0a26160ad07e48e4f2ced50c2b22cb2af94090f5b86c5e0e55d1294dacd0e677f03ddea93c1b",
              issuer: "0xeCE207e717365d67f87e1aE5cAc715Cf60208e63",
              issueAt: 1677257162,
            },
            sign: "0x6950a774b6e90e20b33f1ac052476f6c5c07caec239139fe7e4cdd064cacea6a3256bba7ef8eec8278577f60035de8a6f5279f9b8bd55b0ccf15caba8cac78171c",
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

    const requesterAddress = ethers.utils.verifyTypedData(request.domain, request.types, request.message, request.sign);
    console.log("ethers verification", requesterAddress, request.message.requester);
    expect(requesterAddress).to.equal(request.message.requester);

    const VerifyTypedSign = await ethers.getContractFactory("VerifyTypedSign");
    const verifyTypedSign = await VerifyTypedSign.deploy();

    const [vouchFrom, isVerified] = await verifyTypedSign.verifyClaimRequest(
      request.domain,
      request.message,
      request.sign
    );
    console.log(vouchFrom, isVerified);
    expect(vouchFrom).to.equal(request.message.requester);
    expect(isVerified).to.equal(true);
  });

  it("Deployment should verify mercle attested claim wihout miscClaim data", async () => {
    const [owner] = await ethers.getSigners();

    const request =
      profileDataAttestedByMercleWithoutMiscClaim.attributes[0].claims["0x63f72e8458a23ab13b0437ca"].attestedByMercle;

    const requesterAddress = ethers.utils.verifyTypedData(request.domain, request.types, request.message, request.sign);
    console.log("ethers verification", requesterAddress, request.message.issuer);
    expect(requesterAddress).to.equal(request.message.issuer);

    const VerifyTypedSign = await ethers.getContractFactory("VerifyTypedSign");
    const verifyTypedSign = await VerifyTypedSign.deploy();

    const [vouchFrom, isVerified] = await verifyTypedSign.verifyAttestedByMercle(
      request.domain,
      { ...request.message, miscClaims: [] },
      request.sign
    );
    console.log(vouchFrom, isVerified);
    expect(vouchFrom).to.equal(request.message.issuer);
    expect(isVerified).to.equal(true);
  });

  it("Deployment should verify mercle attested claim with miscClaim data", async () => {
    const [owner] = await ethers.getSigners();

    const request = profileData.attributes[0].claims["0x63f72e8458a23ab13b0437ca"].attestedByMercle;

    const requesterAddress = ethers.utils.verifyTypedData(request.domain, request.types, request.message, request.sign);
    console.log("ethers verification", requesterAddress, request.message.issuer);
    expect(requesterAddress).to.equal(request.message.issuer);

    const VerifyTypedSign = await ethers.getContractFactory("VerifyTypedSign");
    const verifyTypedSign = await VerifyTypedSign.deploy();

    const [vouchFrom, isVerified] = await verifyTypedSign.verifyAttestedByMercle(
      request.domain,
      request.message,
      request.sign
    );
    console.log(vouchFrom, isVerified);
    expect(vouchFrom).to.equal(request.message.issuer);
    expect(isVerified).to.equal(true);
  });
});
