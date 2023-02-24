// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

/**
 * One Time Mint ERC 721 allows users with minter role to add any individual to mint token once.
 * Normal minters can mint tokens as usual.
 * Minters can create campaigns for one time mint.
 */
contract MembershipNFT is
    ERC2771Context,
    ERC721URIStorage,
    AccessControlEnumerable
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    // to access campaign status
    bytes32 private BYTE_ZERO = bytes32(uint256(0));
    bytes32 private BYTE_ONE = bytes32(uint256(1));

    // status for campaign mint state
    address private EMPTY = address(0);
    address private CAN_MINT = address(1);
    address private DISABLED = address(2);

    struct Campaign {
        bytes32 merkleRoot;
        uint64 expireAt;
        // 0x1: 0x1 or 0x2 // 1: campaign is created, 2: campaign is disabled
        // userId: <address> // minted to given address
        mapping(bytes32 => address) mintState;
    }
    mapping(bytes12 => Campaign) public campaigns;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address public creator;
    string public description;
    bytes12 public communityId;

    constructor(
        address _trustedForwarder,
        bytes12 _communityId,
        address _creator,
        string memory _name,
        string memory _symbol,
        string memory _description,
        bytes12 campaignId, // optional, pass 0x0..
        bytes32 merkleRoot, // optional, pass 0x0..
        uint64 expireAt // optional, pass 0
    ) ERC2771Context(_trustedForwarder) ERC721(_name, _symbol) {
        _setupRole(DEFAULT_ADMIN_ROLE, _creator);
        _setupRole(MINTER_ROLE, _creator);

        communityId = _communityId;
        creator = _creator;
        description = _description;

        if (
            campaignId > bytes12(0) &&
            merkleRoot > bytes32(0) &&
            expireAt > uint64(0)
        ) {
            createCampaign(campaignId, merkleRoot, expireAt);
        }
    }

    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "not owner.");
        _burn(tokenId);
    }

    function mintNFT(address recipient, string memory tokenUri)
        external
        returns (uint256)
    {
        require(
            hasRole(MINTER_ROLE, _msgSender()),
            "DOES_NOT_HAVE_MINTER_ROLE"
        );
        return _mintNFT(recipient, tokenUri);
    }

    function mintNFTCampaign(
        bytes12 campaignId,
        bytes32[] memory proof,
        bytes memory sign,
        address recipient,
        string memory tokenUri
    ) external returns (uint256) {
        require(isCampaignActive(campaignId), "campaign is not active");
        (bytes32 userId, bool canMint) = _canUserMintCampaign(
            campaignId,
            proof,
            sign
        );
        require(canMint, "cannot mint");

        campaigns[campaignId].mintState[userId] = recipient;
        return _mintNFT(recipient, tokenUri);
    }

    function createCampaign(
        bytes12 campaignId,
        bytes32 merkleRoot,
        uint64 expireAt
    ) public {
        require(
            hasRole(MINTER_ROLE, _msgSender()),
            "DOES_NOT_HAVE_MINTER_ROLE"
        );
        require(merkleRoot > 0, "invalid root");
        require(expireAt > block.timestamp, "invalid expire at");

        // enable campaign
        _setCampaignState(campaignId, CAN_MINT);
        campaigns[campaignId].merkleRoot = merkleRoot;
        campaigns[campaignId].expireAt = expireAt;
    }

    function disableCampaign(bytes12 campaignId) external {
        require(
            hasRole(MINTER_ROLE, _msgSender()),
            "DOES_NOT_HAVE_MINTER_ROLE"
        );
        require(campaignExist(campaignId), "campaign doesn't exist");
        require(isCampaignActive(campaignId), "campaign is not active");

        _setCampaignState(campaignId, DISABLED);
    }

    function isCampaignActive(bytes12 id) public view returns (bool) {
        return
            campaigns[id].expireAt > block.timestamp &&
            campaigns[id].mintState[BYTE_ONE] == CAN_MINT;
    }

    function campaignExist(bytes12 id) public view returns (bool) {
        return campaigns[id].mintState[BYTE_ONE] > EMPTY;
    }

    function _canUserMintCampaign(
        bytes12 campaignId,
        bytes32[] memory proof,
        bytes memory sign
    ) private view returns (bytes32, bool) {
        bytes32 _newHash = ECDSA.toEthSignedMessageHash(
            keccak256(abi.encodePacked(campaignId))
        );
        (address _userId, ECDSA.RecoverError error) = ECDSA.tryRecover(
            _newHash,
            sign
        );

        if (error != ECDSA.RecoverError.NoError) return (BYTE_ZERO, false);

        bytes32 userId = keccak256(abi.encodePacked(_userId, campaignId));
        return (
            userId,
            campaigns[campaignId].mintState[userId] == EMPTY &&
                _isAllowed(campaignId, proof, userId)
        );
    }

    function _isAllowed(
        bytes12 campaignId,
        bytes32[] memory proof,
        bytes32 userId
    ) private view returns (bool) {
        bytes32 root = campaigns[campaignId].merkleRoot;
        return MerkleProof.verify(proof, root, userId);
    }

    function _getId(string memory key) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(key));
    }

    function _setCampaignState(bytes12 campaignId, address state) private {
        campaigns[campaignId].mintState[BYTE_ONE] = state;
    }

    // Warning! do not call this without validation of user. currently used by mintNFT and mintNFTCampaign
    function _mintNFT(address recipient, string memory tokenUri)
        private
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenUri);

        return newItemId;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, AccessControlEnumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenId) internal override {
        super._burn(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256, /* firstTokenId */
        uint256
    ) internal virtual override {
        require(
            from == address(0) || to == address(0),
            "This a Soulbound token. It cannot be transferred. It can only be burned by the token owner."
        );
    }

    function _msgSender()
        internal
        view
        virtual
        override(ERC2771Context, Context)
        returns (address)
    {
        return super._msgSender();
    }

    function _msgData()
        internal
        view
        virtual
        override(ERC2771Context, Context)
        returns (bytes calldata)
    {
        return super._msgData();
    }
}
