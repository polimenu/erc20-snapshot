"use strict";


const BlockReader = require("./block-reader");
const FileHelper = require("../file-helper");
const LastDownloadedBlock = require("./last-downloaded-block");
const Parameters = require("../parameters").get();

const { promisify } = require("util");
const { ethers } = require("ethers");

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
  const pastEvents = await contract.queryFilter(contract.filters.Transfer, start, end);

  if (pastEvents.length) {
    console.info("Successfully imported ", pastEvents.length, " events");
    const parsedEvents = pastEvents.map(e => {
      return {
        from: e.args[0],
        to: e.args[1],
        value: e.args[2].toString(),
        transactionHash: e.transactionHash,
        blockNumber: e.blockNumber
      }
    });

    const group = groupBy(parsedEvents, "blockNumber");

    for (let key in group) {
      if (group.hasOwnProperty(key)) {
        const blockNumber = key;
        const data = group[key];

        const file = Parameters.eventsDownloadFilePath.replace(/{token}/g, contractAddress).replace(/{blockNumber}/g, blockNumber);

        FileHelper.writeFile(file, data);
      }
    }
  }

};

module.exports.get = async (config) => {
  const provider = new ethers.JsonRpcProvider(config.provider);
  const contract = new ethers.Contract(config.contractAddress, Parameters.abi, provider);
  const name = await contract.name();
  const symbol = await contract.symbol();
  const decimals = Number(await contract.decimals());
  const blockHeight = await provider.getBlockNumber();
  var fromBlock = parseInt(config.fromBlock) || 0;
  const blocksPerBatch = parseInt(config.blocksPerBatch) || 0;
  const delay = parseInt(config.delay) || 0;
  const toBlock = config.toBlock === "latest" ? blockHeight : config.toBlock;

  const lastDownloadedBlock = await LastDownloadedBlock.get(config.contractAddress);

  if (lastDownloadedBlock) {
    console.log("Resuming from the last downloaded block #", lastDownloadedBlock);
    fromBlock = lastDownloadedBlock + 1;
  }

  console.log("From %d to %d", fromBlock, toBlock);

  let start = fromBlock;
  let end = fromBlock + blocksPerBatch;
  let i = 0;

  while (start < toBlock) {
    i++;

    if (end > toBlock) {
      end = toBlock;
    }

    if (delay) {
      await sleep(delay);
    }

    console.log("Batch", i + 1, " From", start, "to", end);

    await tryGetEvents(contract, start, end, config.contractAddress);

    start = end + 1;
    end = start + blocksPerBatch;

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






module.exports.getERC1155 = async (config) => {
  const provider = new ethers.JsonRpcProvider(config.provider);
  const contract = new ethers.Contract(config.contractAddress, Parameters.abiERC1155, provider);
  const name = config.name;
  const id = config.id;
  const decimals = 0;
  const blockHeight = await provider.getBlockNumber();
  var fromBlock = parseInt(config.fromBlock) || 0;
  const blocksPerBatch = parseInt(config.blocksPerBatch) || 0;
  const delay = parseInt(config.delay) || 0;
  const toBlock = config.toBlock === "latest" ? blockHeight : config.toBlock;

  const lastDownloadedBlock = await LastDownloadedBlock.get(config.contractAddress + "#" + id.toString());

  if (lastDownloadedBlock) {
    console.log("Resuming from the last downloaded block #", lastDownloadedBlock);
    fromBlock = lastDownloadedBlock + 1;
  }

  console.log("From %d to %d", fromBlock, toBlock);

  let start = fromBlock;
  let end = fromBlock + blocksPerBatch;
  let i = 0;

  while (start < toBlock) {
    i++;

    if (end > toBlock) {
      end = toBlock;
    }

    if (delay) {
      await sleep(delay);
    }

    console.log("Batch", i + 1, " From", start, "to", end);

    await tryGetERC1155Events(contract, id, start, end, config.contractAddress);

    start = end + 1;
    end = start + blocksPerBatch;

  }

  const events = await BlockReader.getEvents(config.contractAddress + "#" + id.toString());

  const data = {
    name,
    symbol: name,
    id,
    decimals,
    events: events
  };

  return data;
};


const tryGetERC1155Events = async (contract, id, start, end, contractAddress) => {
  const pastEvents = (await contract.queryFilter(contract.filters.TransferSingle, start, end)).filter(e => Number(e.args[3]) == id);

  if (pastEvents.length) {
    console.info("Successfully imported ", pastEvents.length, " events");
    const parsedEvents = pastEvents.map(e => {
      return {
        from: e.args[1],
        to: e.args[2],
        id: Number(e.args[3]),
        value: 1,
        transactionHash: e.transactionHash,
        blockNumber: e.blockNumber
      }
    });

    const group = groupBy(parsedEvents, "blockNumber");

    for (let key in group) {
      if (group.hasOwnProperty(key)) {
        const blockNumber = key;
        const data = group[key];

        const file = Parameters.eventsDownloadFilePath.replace(/{token}/g, contractAddress + "#" + id.toString()).replace(/{blockNumber}/g, blockNumber);

        FileHelper.writeFile(file, data);
      }
    }
  }

};