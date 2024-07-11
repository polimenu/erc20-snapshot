const { getERC20Holders, getERC1555Holders } = require(".")

const RPC = "https://arbitrum-mainnet.infura.io/v3/67faae845064420994c4086ae05cac48";
const INIT_BLOCK = 84855604;

const test = async () => {
    /*const snapshot = await getERC20Holders({
        provider: RPC,
        contractAddress: "0x7AFdD87FbA836c7862aD7b90bCF50440bF878A3c",
        fromBlock: INIT_BLOCK,
        toBlock: 229342250,
        blocksPerBatch: 5000,
        delay: 0,
        checkIfContract: false
    })*/

    const snapshot = await getERC1555Holders({
        provider: RPC,
        contractAddress: "0xC439d29ee3C7fa237da928AD3A3D6aEcA9aA0717",
        name: "muchoBadge",
        id: 1,
        fromBlock: INIT_BLOCK,
        toBlock: "latest",
        blocksPerBatch: 250000,
        delay: 0,
        checkIfContract: false
    })

    return snapshot;
}

test();