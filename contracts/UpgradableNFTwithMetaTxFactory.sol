// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./UpgradableNFTwithMetaTx.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract UpgradableNFTwithMetaTxFactory {
    address public immutable tokenImplementation;

    address[] public nftsProxies;

    constructor(address _trustedForwarder) {
        tokenImplementation = address(
            new UpgradableNFTwithMetaTx(_trustedForwarder)
        );
    }

    function deployContract(
        address _creator,
        string memory _name,
        string memory _symbol,
        string memory _description
    ) public returns (address) {
        // address tokenImplementation = address(new UpgradableNFT());
        address proxyAddress = address(
            new ERC1967Proxy(
                tokenImplementation,
                abi.encodeWithSelector(
                    UpgradableNFTwithMetaTx(address(0)).initialize.selector,
                    _creator,
                    _name,
                    _symbol,
                    _description
                )
            )
        );

        nftsProxies.push(proxyAddress);
        return proxyAddress;
    }

    function getNft(uint256 index) public view returns (address) {
        return nftsProxies[index];
    }
}
