# Hardhat
 
 ```shell
 npx hardhat help
 npx hardhat test
 REPORT_GAS=true npx hardhat test
 npx hardhat node
 npx hardhat ignition deploy ./ignition/modules/MiniAppGallery.js --network localhost
 ```
 
## Deploy UniqueUserSignup
npx hardhat ignition deploy ./ignition/modules/UniqueUserSignup.js --network localhost

## Verify Contract
npx hardhat verify [CONTRACT_ADDRESS] [...CONSTRUCTOR_ARGS] --network celo