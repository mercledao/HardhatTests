# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js

// make sure to delete cache and artifacts folder and recomplie the project for verification

npx hardhat compile --force
npx hardhat export-abi

// Verify factory
npx hardhat verify --network goerli  0xbBb8fEFe0E02C44A3E286BBA34c33ad4827f8459 --constructor-args scripts/verifier/MembershipNFTFactoryVerifierArgs.js


// Verify Nft implementation
// get this proxy address from the deployed factory (deploy an nft from the factory and use that address)
npx hardhat verify --network goerli  0xF7831E3aDb91512b6a72b5A76499BE7F1917B8fF --constructor-args scripts/verifier/MembershipNFTVerifierArgs.js


```
