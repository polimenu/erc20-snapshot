#!/usr/bin/env node
"use strict";

const Balances = require("./balances");
const Events = require("./events/blockchain");
//const Export = require("./export");
/*config params
{
  provider,
  contractAddress,
  fromBlock,
  toBlock,
  blocksPerBatch,
  delay,
  checkIfContract
}
*/

module.exports.getERC20Holders = async (config) => {

  const result = await Events.get(config);

  console.log("Calculating balances of %s (%s)", result.name, result.symbol);
  return Balances.createBalances(result);

};


module.exports.getERC1555Holders = async (config) => {

  const result = await Events.getERC1155(config);

  console.log("Calculating balances of %s (%s)", result.name, result.symbol);
  return Balances.createBalances(result);

};