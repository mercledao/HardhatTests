// SPDX-License-Identifier: MIT
//       _____                       .__
//      /     \   ___________   ____ |  |   ____
//     /  \ /  \_/ __ \_  __ \_/ ___\|  | _/ __ \
//    /    Y    \  ___/|  | \/\  \___|  |_\  ___/
//    \____|__  /\___  >__|    \___  >____/\___  >
//        \/     \/            \/          \/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/metatx/ERC2771ContextUpgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * One Time Mint ERC 721 allows users with minter role to add any individual to mint token once.
 * Normal minters can mint tokens as usual.
 * Minters can create campaigns for one time mint.
 */
contract MembershipNFT is
    Initializable,
    ERC721Upgradeable,
    ERC721URIStorageUpgradeable,
    AccessControlUpgradeable,
    UUPSUpgradeable,
    ERC2771ContextUpgradeable
{
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant CLAIM_ISSUER_ROLE = keccak256("CLAIM_ISSUER_ROLE");

    // to access campaign status
    bytes32 private constant BYTE_ZERO = bytes32(uint256(0));
    bytes32 private constant BYTE_ONE = bytes32(uint256(1));

    // status for campaign mint state
    address private constant EMPTY = address(0);
    address private constant CAN_MINT = address(1);
    address private constant DISABLED = address(2);

    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _tokenIds;

    struct Campaign {
        bytes32 merkleRoot;
        uint64 expireAt;
        // 0x1: 0x1 or 0x2 // 1: campaign is created, 2: campaign is disabled
        // userId: <address> // minted to given address
        mapping(bytes32 => address) mintState;
    }
    mapping(bytes12 => Campaign) public campaigns;
    address public creator;
    string public description;
    bytes12 public communityId;
    bool public isTradable;
    bool public isOpenMint;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(address _trustedForwarder)
        ERC2771ContextUpgradeable(_trustedForwarder)
    {
        _disableInitializers();
    }

    function initialize(
        address claimIssuer,
        address _creator,
        bytes12 _communityId,
        string memory _name,
        string memory _symbol,
        string memory _description,
        bytes12 campaignId, // optional, pass 0x0..
        bytes32 merkleRoot, // optional, pass 0x0..
        uint64 expireAt // optional, pass 0
    ) public initializer {
        __ERC721_init(_name, _symbol);
        __ERC721URIStorage_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _setupRole(DEFAULT_ADMIN_ROLE, _creator);
        _setupRole(UPGRADER_ROLE, _creator);
        _setupRole(MINTER_ROLE, _creator);
        // allow factory contract to initialize campaign
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(CLAIM_ISSUER_ROLE, _creator);
        _setupRole(CLAIM_ISSUER_ROLE, claimIssuer);
        isTradable = false;
        isOpenMint = false;

        creator = _creator;
        description = _description;
        communityId = _communityId;

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
            isOpenMint || hasRole(MINTER_ROLE, _msgSender()),
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

    function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function setIsOpenMint(bool _isOpenMint) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "NOT_AUTHORIZED");
        isOpenMint = _isOpenMint;
    }

    function setIsTradable(bool _isTradable) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "NOT_AUTHORIZED");
        isTradable = _isTradable;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256, /* firstTokenId */
        uint256
    ) internal virtual override {
        require(
            isTradable || (from == address(0) || to == address(0)),
            "This a Soulbound token. It cannot be transferred. It can only be burned by the token owner."
        );
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}

    function _msgSender()
        internal
        view
        virtual
        override(ERC2771ContextUpgradeable, ContextUpgradeable)
        returns (address)
    {
        return super._msgSender();
    }

    function _msgData()
        internal
        view
        virtual
        override(ERC2771ContextUpgradeable, ContextUpgradeable)
        returns (bytes calldata)
    {
        return super._msgData();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
