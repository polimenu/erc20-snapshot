"use strict";

const Web3 = require("web3");
const Parameters = require("./parameters").get();



module.exports.getContract = (provider, contractAddress) => {
  const web3 = new Web3(new Web3.providers.HttpProvider(provider);
  const contract = web3.eth.Contract(Parameters.abi, contractAddress);
  return contract;
};
