// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract VerifyTypedSign {
    struct Domain {
        string name;
        string version;
        address verifyingContract;
        uint256 chainId;
    }
    struct Reward {
        bytes12 id;
        string name;
        string description;
        string image;
        uint256 xp;
        address to;
        address delegate;
        uint256 requestAt;
    }
    struct AttestClaim {
        bytes delegateSign;
        address from;
        uint256 issueAt;
        // is optional. empty array must still be passed here
        Reward[] miscClaims;
    }

    function verifyClaimRequest(
        Domain calldata domain,
        Reward calldata claimRequest,
        bytes memory sign
    ) public pure returns (address, bool) {
        bytes32 digest = hashTypedDataV4(domain, claimRequest);
        address signer = ECDSA.recover(digest, sign);
        return (signer, signer == claimRequest.delegate);
    }

    function hashTypedDataV4(
        Domain calldata domain,
        Reward calldata claimRequest
    ) internal pure returns (bytes32) {
        return
            ECDSA.toTypedDataHash(
                keccak256(
                    abi.encode(
                        keccak256(
                            "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                        ),
                        keccak256(abi.encodePacked(domain.name)),
                        keccak256(abi.encodePacked(domain.version)),
                        5,
                        address(0xFF236D360d16707f22b22285Cb24900D62CaFD4F)
                    )
                ),
                _keccak256Reward(claimRequest)
            );
    }

    function verifyAttestedByMercle(
        Domain calldata domain,
        AttestClaim calldata claimRequest,
        bytes memory sign
    ) public pure returns (address, bool) {
        bytes32 digest = hashTypedDataV4AttestedByMercle(domain, claimRequest);
        address signer = ECDSA.recover(digest, sign);
        return (signer, signer == claimRequest.from);
    }

    function hashTypedDataV4AttestedByMercle(
        Domain calldata domain,
        AttestClaim calldata claimRequest
    ) internal pure returns (bytes32) {
        return
            ECDSA.toTypedDataHash(
                keccak256(
                    abi.encode(
                        keccak256(
                            "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                        ),
                        keccak256(abi.encodePacked(domain.name)),
                        keccak256(abi.encodePacked(domain.version)),
                        5,
                        address(0xFF236D360d16707f22b22285Cb24900D62CaFD4F)
                    )
                ),
                _keccak256AttestClaim(claimRequest)
            );
    }

    function _keccak256Reward(Reward calldata reward)
        internal
        pure
        returns (bytes32)
    {
        return
            keccak256(
                abi.encode(
                    /**
                     * Make sure to match order of variables as in the types array used with ethers.js
                     */
                    keccak256(
                        "Reward(bytes12 id,string name,string description,string image,uint256 xp,address to,address delegate,uint256 requestAt)"
                    ),
                    reward.id,
                    keccak256(abi.encodePacked(reward.name)),
                    keccak256(abi.encodePacked(reward.description)),
                    keccak256(abi.encodePacked(reward.image)),
                    reward.xp,
                    reward.to,
                    reward.delegate,
                    reward.requestAt
                )
            );
    }

    function _keccak256AttestClaim(AttestClaim calldata attestClaim)
        internal
        pure
        returns (bytes32)
    {
        bytes32[] memory encodedRewards = new bytes32[](
            attestClaim.miscClaims.length
        );
        for (uint256 i = 0; i < attestClaim.miscClaims.length; i++) {
            encodedRewards[i] = _keccak256Reward(attestClaim.miscClaims[i]);
        }
        return
            keccak256(
                attestClaim.miscClaims.length > 0
                    ? abi.encode(
                        /**
                         * Make sure to match order of variables as in the types array used with ethers.js
                         */
                        keccak256(
                            "AttestClaim(bytes delegateSign,address from,uint256 issueAt,Reward[] miscClaims)Reward(bytes12 id,string name,string description,string image,uint256 xp,address to,address delegate,uint256 requestAt)"
                        ),
                        keccak256(abi.encodePacked(attestClaim.delegateSign)),
                        attestClaim.from,
                        attestClaim.issueAt,
                        keccak256(abi.encodePacked(encodedRewards))
                    )
                    : abi.encode(
                        keccak256(
                            "AttestClaim(bytes delegateSign,address from,uint256 issueAt)"
                        ),
                        keccak256(abi.encodePacked(attestClaim.delegateSign)),
                        attestClaim.from,
                        attestClaim.issueAt
                    )
            );
    }
}
