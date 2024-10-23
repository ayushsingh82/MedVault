require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    sapphire: {
      url:"https://testnet.sapphire.oasis.io",
      chainId:0x5aff,
    },
  },
};
