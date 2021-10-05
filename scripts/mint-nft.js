require("dotenv").config();
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const contract = require("../artifacts/contracts/myNFT.sol/MyNFT.json");

const API_URL = process.env.ALCHEMY_API;

const web3 = createAlchemyWeb3(API_URL);

console.log(JSON.stringify(contract.abi));
