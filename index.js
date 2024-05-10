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

module.exports.getSnapshot = async (config) => {
  const format = "json";
  const result = await Events.get(config);

  console.log("Calculating balances of %s (%s)", result.name, result.symbol);
  return Balances.createBalances(result);

  //console.log("Exporting balances");
  //await Export.exportBalances(result.symbol, balances, format);
};
