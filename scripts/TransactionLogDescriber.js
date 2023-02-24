const { ethers } = require("hardhat");

const NO_FUNC_NAME = "func not defined";

const funcHexDetails = {
  "0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c": {
    name: "Deposit (index_topic_1 address dst, uint256 wad)",
  },
  "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822": {
    name: "Swap (index_topic_1 address sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, index_topic_2 address to)",
  },
  "0xd1398bee19313d6bf672ccb116e51f4a1a947e91c757907f51fbb5b5e56c698f": {
    name: "Transfer (index_topic_1 address by, index_topic_2 address from, index_topic_3 address to, uint256 value)",
  },
  "0x8b3e96f2b889fa771c53c981b40daf005f63f637f1869f707052d15a3dd97140": {
    name: "TokenExchange (index_topic_1 address buyer, int128 sold_id, uint256 tokens_sold, int128 bought_id, uint256 tokens_bought)",
  },
  "0x9e71bc8eea02a63969f509818f2dafb9254532904319f9dbda79b67bd34a5f3d": {
    name: "Staked (index_topic_1 address user, uint256 amount)",
  },
  "0x6c8433a8e155f0af04dba058d4e4695f7da554578963d876bdf4a6d8d6399d9c": {
    name: "Harvest (uint256 harvested, index_topic_1 uint256 blockNumber)",
  },
  "0xc6a898309e823ee50bac64e45ca8adba6690e99e7841c45d754e2a38e9019d9b": {
    name: "Borrow (index_topic_1 address reserve, address user, index_topic_2 address onBehalfOf, uint256 amount, uint256 borrowRateMode, uint256 borrowRate, index_topic_3 uint16 referral)",
  },
  "0x49995e5dd6158cf69ad3e9777c46755a1a826a446c6416992167462dad033b2a": {
    name: "Burn (index_topic_1 address user, uint256 amount, uint256 index)",
  },
  "0x4cdde6e09bb755c9a5589ebaec640bbfedff1362d4b255ebf8339782b9942faa": {
    name: "Repay (index_topic_1 address reserve, index_topic_2 address user, index_topic_3 address repayer, uint256 amount)",
  },
  "0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65": {
    name: "Withdrawal (index_topic_1 address src, uint256 wad)",
  },
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef": {
    name: "Transfer (index_topic_1 address from, index_topic_2 address to, uint256 value)",
  },
  "0x2170c741c41531aec20e7c107c24eecfdd15e69c9bb0a8dd37b1840b9e0b207b": {
    name: "Swap (index_topic_1 bytes32 poolId, index_topic_2 address tokenIn, index_topic_3 address tokenOut, uint256 amountIn, uint256 amountOut)",
  },
  "0x908fb5ee8f16c6bc9bc3690973819f32a4d4b10188134543c88706e0e1d43378": {
    name: "LOG_SWAP (index_topic_1 address caller, index_topic_2 address tokenIn, index_topic_3 address tokenOut, uint256 tokenAmountIn, uint256 tokenAmountOut)",
  },
  "0x2468f9268c60ad90e2d49edb0032c8a001e733ae888b3ab8e982edf535be1a76": {
    name: "RewardsAccrued (address user, uint256 amount)",
    ignore: true,
  },
  "0x9310ccfcb8de723f578a9e4282ea9f521f05ae40dc08f3068dfad528a65ee3c7": {
    name: "RewardsClaimed (index_topic_1 address from, index_topic_2 address to, uint256 amount)",
    ignore: true,
  },
  "0xe2403640ba68fed3a2f88b7557551d1993f84b99bb10ff833f0cf8db0c5e0486": {
    name: "RewardPaid (index_topic_1 address user, uint256 reward)",
    ignore: true,
  },
  "0x9e96dd3b997a2a257eec4df9bb6eaf626e206df5f543bd963682d143300be310": {
    name: "RemoveLiquidityOne (index_topic_1 address provider, uint256 token_amount, uint256 coin_amount)",
    ignore: true,
  },
  "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925": {
    name: "Approval (index_topic_1 address owner, index_topic_2 address spender, uint256 value)",
    ignore: true,
  },
  "0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1": {
    name: "Sync (uint112 reserve0, uint112 reserve1)",
    ignore: true,
  },
  "0x17cc18c044bdfa5f365fb0f6140ffbaa76843012681aedb2015580693fa49b94": {
    name: "TreeDistribution (index_topic_1 address token, uint256 amount, index_topic_2 uint256 blockNumber, uint256 timestamp)",
    ignore: true,
  },
  "0x4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f": {
    name: "Mint (index_topic_1 address from, uint256 value, uint256 index)",
    ignore: true,
  },
  "0x2f00e3cdd69a77be7ed215ec7b2a36784dd158f921fca79ac29deffa353fe6ee": {
    name: "Mint (index_topic_1 address from, index_topic_2 address onBehalfOf, uint256 value, uint256 index)",
    ignore: true,
  },
  "0x804c9b842b2748a22bb64b345453a3de7ca54a6ca45ce00d415894979e22897a": {
    name: "ReserveDataUpdated (index_topic_1 address reserve, uint256 liquidityRate, uint256 stableBorrowRate, uint256 variableBorrowRate, uint256 liquidityIndex, uint256 variableBorrowIndex)",
    ignore: true,
  },
  "0xa0a19463ee116110c9b282012d9b65cc5522dc38a9520340cbaf3142e550127f": {
    name: "DelegatedPowerChanged (index_topic_1 address user, uint256 amount, uint8 delegationType)",
    ignore: true,
  },
  "0x5777ca300dfe5bead41006fbce4389794dbc0ed8d6cccebfaf94630aa04184bc": {
    name: "AssetIndexUpdated (index_topic_1 address asset, uint256 index)",
    ignore: true,
  },
  "0xbb123b5c06d5408bbea3c4fef481578175cfb432e3b482c6186f02ed9086585b": {
    name: "UserIndexUpdated (index_topic_1 address user, index_topic_2 address asset, uint256 index)",
    ignore: true,
  },
  "0x6afbb2eaf0241302d1ab6244dff35383c745f31ee1f878e9052d510baeb42506": {
    name: "TransactionEnqueued (uint256 _chainId, index_topic_1 address _l1TxOrigin, index_topic_2 address _target, uint256 _gasLimit, bytes _data, index_topic_3 uint256 _queueIndex, uint256 _timestamp)",
    ignore: true,
  },
  "0x678d1db16886696652bddc90d68217be474de2ce959bf7383cb63eaa8c6f1afa": {
    name: "SentMessage (index_topic_1 address target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit, uint256 chainId)",
    ignore: true,
  },
  "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67": { name: NO_FUNC_NAME },
  "0xe00361d207b252a464323eb23d45d42583e391f2031acdd2e9fa36efddd43cb0": { name: NO_FUNC_NAME },
  "0x6059a38198b1dc42b3791087d1ff0fbd72b3179553c25f678cd246f52ffaaf59": { name: NO_FUNC_NAME },
  "0xb2e76ae99761dc136e598d4a629bb347eccb9532a5f8bbd72e18467c3c34cc98": { name: NO_FUNC_NAME },
  "0x3ca9184e00000000000000000000000000000000000000000000000000000000": { name: NO_FUNC_NAME },
  "0x8201aa3f00000000000000000000000000000000000000000000000000000000": { name: NO_FUNC_NAME },
  "0xc333b5c3e71358b85edbb94334230ac00644c26af29851f9034a7105eb84b077": { name: NO_FUNC_NAME },
  "0x718594027abd4eaed59f95162563e0cc6d0e8d5b86b1c7be8b1b0ac3343d0396": { name: NO_FUNC_NAME },
  "0xef4b96e5b208365900f38219a7dec7af4565f8ff4ce6526970a9d024397f978d": { name: NO_FUNC_NAME },
};
const provider = new ethers.providers.JsonRpcProvider(
  "https://eth-mainnet.alchemyapi.io/v2/vma47TKOLkZ-xH_XQh1tQFfLADEJiHQt"
);

const main = async () => {
  const txnHash = "0xb05e2ad84fd750c3f21b38b2a04128aae076414dace7be445580bf3a63b03a5a";

  const txnReceipt = await provider.getTransactionReceipt(txnHash);
  const logs = txnReceipt.logs;

  console.log("txnHash :: ", txnHash);
  // const cache = {}
  for (let i = 0; i < logs.length; i++) {
    const log = logs[i];
    // // helper used to generate missing function name hashes
    // if (cache[log.topics[0]]) continue;
    // if (!funcHexDetails[log.topics[0]]?.name) console.log(`"${log.topics[0]}": { name: "" },`);
    // cache[log.topics[0]] = true;

    if (
      !funcHexDetails[log.topics[0]]?.name ||
      funcHexDetails[log.topics[0]]?.name == NO_FUNC_NAME ||
      funcHexDetails[log.topics[0]]?.ignore
    )
      continue;

    const topics = [funcHexDetails[log.topics[0]]?.name];
    for (let i = 1; i < log.topics.length; i++) {
      const topic = log.topics[i];
      const topicAsAddress = tryGetAddress(topic);
      if (ethers.utils.isAddress(topicAsAddress)) {
        try {
          const address = topicAsAddress;
          const addressName = await getTokenName(address);
          if (addressName) {
            topics.push(`${addressName}(${address})`);
          } else {
            topics.push(address);
          }
        } catch (e) {
          topics.push(topic);
        }
      } else {
        topics.push(topic);
      }
    }

    const name = await getTokenName(log.address);
    console.log(`${name || "Contract"}(${log.address}) `, {
      topics: topics,
      data: log.data,
    });
  }
};

const isSwap = ()=>{
    /**
     * from cannot be zero address
     * to cannot be zero address
     * 
     * convert currencies to common value
     * get conversion price at block id
     * 
USDC  2e90edd000         0x01d1f55d94a53a9517c07f793f35320FAA0D2DCf -> 0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57
Ether 67a123ec0e9d2b905  0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640 -> 0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57
USDC  2e90edd000         0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57 -> 0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640
Ether 67a123ec0e9d2b905  0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57 -> 0x01d1f55d94a53a9517c07f793f35320FAA0D2DCf

USDC:  2e90edd000        0x01d1f55d94a53a9517c07f793f35320FAA0D2DCf -> 0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57 -> 0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640
Ether: 67a123ec0e9d2b905 0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640 -> 0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57 -> 0x01d1f55d94a53a9517c07f793f35320FAA0D2DCf
     */
}

const erc20Abi = [
  "function name() external pure returns (string memory)",
  "function symbol() external pure returns (string memory)",
  "function decimals() external pure returns (uint8)",
  "function totalSupply() external view returns (uint)",
  "function balanceOf(address owner) external view returns (uint)",
];
const tokenCache = {};
const getTokenName = async (address) => {
  if (tokenCache[address] !== undefined) {
    return tokenCache[address].name;
  }
  try {
    const token = new ethers.Contract(address, erc20Abi, provider);
    const name = await token.name();
    tokenCache[address] = { name };
  } catch (e) {
    tokenCache[address] = {};
  }

  return tokenCache[address].name;
};

const tryGetAddress = (bytes) => {
  try {
    const address = ethers.utils.defaultAbiCoder.decode(["address"], bytes)[0];
    if (ethers.utils.isAddress(address)) return address;
  } catch (e) {}

  return bytes;
};

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
