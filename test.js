const { getERC20Holders, getERC1555Holders } = require(".")

const RPC = "https://arb-mainnet.g.alchemy.com/v2/xFMWBxkb3FXJiEUuAvUaLPC0f9xnCkPP"; //"https://arbitrum-mainnet.infura.io/v3/67faae845064420994c4086ae05cac48";
const INIT_BLOCK = 131952732;
const END_BLOCK = 356032073;

const test = async () => {
    const mUSDCsnapshot = await getERC20Holders({
        provider: RPC,
        contractAddress: "0x2eE1Fc67bEC816F3DAe2d2c9409483BEf49F181B", //mUSDC
        fromBlock: INIT_BLOCK,
        toBlock: END_BLOCK,
        blocksPerBatch: 500000,
        delay: 0,
        checkIfContract: false
    })


    const mWETHsnapshot = await getERC20Holders({
        provider: RPC,
        contractAddress: "0x01FC279A6339487c4688dF87714609b2138A4d71", //mWETH
        fromBlock: INIT_BLOCK,
        toBlock: END_BLOCK,
        blocksPerBatch: 500000,
        delay: 0,
        checkIfContract: false
    })



    const mWBTCsnapshot = await getERC20Holders({
        provider: RPC,
        contractAddress: "0xBD5EB7fD3783f504c08Be0a44177BddeE82F991D", //mWBTC
        fromBlock: INIT_BLOCK,
        toBlock: END_BLOCK,
        blocksPerBatch: 500000,
        delay: 0,
        checkIfContract: false
    })

    const addresses = [
        ...new Set([
            ...mUSDCsnapshot.map((h) => h.wallet),
            ...mWETHsnapshot.map((h) => h.wallet),
            ...mWBTCsnapshot.map((h) => h.wallet)
        ])
    ];
    console.log("Total unique addresses:", addresses.length);

    const addressesWithBalance = addresses.map((address) => {
        return {
            wallet: address,
            mUSDC: mUSDCsnapshot.find((h) => h.wallet === address)?.balance || 0,
            mWETH: mWETHsnapshot.find((h) => h.wallet === address)?.balance || 0,
            mWBTC: mWBTCsnapshot.find((h) => h.wallet === address)?.balance || 0
        }
    }
    );

    console.log("address|mUSDC|mWETH|mWBTC");
    addressesWithBalance.forEach((h) => {
        console.log(`${h.wallet}|${h.mUSDC}|${h.mWETH}|${h.mWBTC}`);
    });


    /*const snapshot = await getERC1555Holders({
        provider: RPC,
        contractAddress: "0xC439d29ee3C7fa237da928AD3A3D6aEcA9aA0717",
        name: "muchoBadge",
        id: 5,
        fromBlock: INIT_BLOCK,
        toBlock: "latest",
        blocksPerBatch: 2500000,
        delay: 0,
        checkIfContract: false
    })*/

    return mUSDCsnapshot;
}

test();