// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./MembershipNFT.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract MembershipNFTFactory {
    address public immutable mercleAddress;
    address public immutable tokenImplementation;

    address[] public nftsProxies;

    constructor(address _mercleAddress, address _trustedForwarder) {
        mercleAddress = _mercleAddress;
        tokenImplementation = address(new MembershipNFT(_trustedForwarder));
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
                    MembershipNFT(address(0)).initialize.selector,
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
