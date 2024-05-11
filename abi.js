"use strict";

const { readFileSync } = require("fs");
const path = require("path");

const abi = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        name: "value",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  }
];

module.exports.getABI = () => {
  return abi;
};

module.exports.getERC1155ABI = () => {
  return JSON.parse(readFileSync(path.resolve(__dirname, "./ERC1155Abi.json")).toString());;
}