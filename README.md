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

npx hardhat verify --network goerli  0xbBb8fEFe0E02C44A3E286BBA34c33ad4827f8459 --constructor-args scripts/verifier/MembershipNFTFactoryVerifierArgs.js
```
