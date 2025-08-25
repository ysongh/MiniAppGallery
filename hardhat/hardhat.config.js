require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    base: {
      url: `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_APIKEY}`,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 8453
    },
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 44787
    },
    celoSepolia: {
      url: "https://forno.celo-sepolia.celo-testnet.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11142220
    },
    celo: {
      url: "https://forno.celo.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 42220
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
    customChains: [
      {
        network: 'base',
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org"
        }
      },
      {
        network: "celo",
        chainId: 42220,
        urls: {
          apiURL: "https://api.celoscan.io/api",
          browserURL: "https://celoscan.io/",
        },
      },
    ],
  },
  paths: {
    artifacts: '../react/src/artifacts',
    cache: '../react/src/cache',
  }
};
