"use strict";

const Web3 = require("web3");

const BlockByBlock = require("./block-by-block");
const BlockReader = require("./block-reader");
const FileHelper = require("../file-helper");
const LastDownloadedBlock = require("./last-downloaded-block");
const Parameters = require("../parameters").get();

const { promisify } = require("util");

const sleep = promisify(setTimeout);


const groupBy = (objectArray, property) => {
  return objectArray.reduce((acc, obj) => {
    var key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
};

const tryGetEvents = async (contract, start, end, contractAddress) => {
  try {
    const pastEvents = await contract.getPastEvents("Transfer", { fromBlock: start, toBlock: end });

    if (pastEvents.length) {
      console.info("Successfully imported ", pastEvents.length, " events");
    }

    const group = groupBy(pastEvents, "blockNumber");

    for (let key in group) {
      if (group.hasOwnProperty(key)) {
        const blockNumber = key;
        const data = group[key];

        const file = Parameters.eventsDownloadFilePath.replace(/{token}/g, contractAddress).replace(/{blockNumber}/g, blockNumber);

        FileHelper.writeFile(file, data);
      }
    }
  } catch (e) {
    console.log("Could not get events due to an error. Now checking block by block.", e);
    await BlockByBlock.tryBlockByBlock(contract, start, end, contractAddress);
  }
};

module.exports.get = async (config) => {
  const web3 = new Web3(new Web3.providers.HttpProvider((config || {}).provider || "http://localhost:8545"));
  const contract = web3.eth.Contract(Parameters.abi, config.contractAddress)
  const name = await contract.methods.name().call();
  const symbol = await contract.methods.symbol().call();
  const decimals = await contract.methods.decimals().call();
  const blockHeight = await web3.eth.getBlockNumber();
  var fromBlock = parseInt(config.fromBlock) || 0;
  const blocksPerBatch = parseInt(config.blocksPerBatch) || 0;
  const delay = parseInt(config.delay) || 0;
  const toBlock = blockHeight;

  const lastDownloadedBlock = await LastDownloadedBlock.get(config.contractAddress);

  if (lastDownloadedBlock) {
    console.log("Resuming from the last downloaded block #", lastDownloadedBlock);
    fromBlock = lastDownloadedBlock + 1;
  }

  console.log("From %d to %d", fromBlock, toBlock);

  let start = fromBlock;
  let end = fromBlock + blocksPerBatch;
  let i = 0;

  while (end < toBlock) {
    i++;

    if (delay) {
      await sleep(delay);
    }

    console.log("Batch", i + 1, " From", start, "to", end);

    await tryGetEvents(contract, start, end, config.contractAddress);

    start = end + 1;
    end = start + blocksPerBatch;

    if (end > toBlock) {
      end = toBlock;
    }
  }

  const events = await BlockReader.getEvents(config.contractAddress);

  const data = {
    name,
    symbol,
    decimals,
    events: events
  };

  return data;
};
