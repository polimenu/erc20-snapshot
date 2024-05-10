"use strict";

const path = require("path");
const abi = require("./abi");

const parameters = {
  abi: abi.getABI(),
  abiERC1155: abi.getERC1155ABI(),
  knownTypes: path.join(process.cwd(), "/.cache/known-types.json"),
  outputFileNameCSV: path.join(process.cwd(), "./balances/{token}.csv"),
  outputFileNameJSON: path.join(process.cwd(), "./balances/{token}.json"),
  eventsDownloadFolder: path.join(process.cwd(), "./tx/{token}/"),
  eventsDownloadFilePath: path.join(process.cwd(), "./tx/{token}/{blockNumber}.json")
};

module.exports.get = () => {
  return parameters;
};
