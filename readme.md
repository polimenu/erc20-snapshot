# Token Snapshot: Create ERC20 Token Snapshot

This command-line utility creates a snapshot of any ERC20 token and returns ist as an object. 
Fork from erc20-snapshot, which exports it as a file.
Use your own fully synced Ethereum node or any _Ethereum node as a service_ like Infura.

- Works without a local Ethereum node.
- Automatically resumes the next time upon failure.
- Tested to work with Infura.

## Getting Started

```
yarn add erc20-snapshot-module
```

### How to Use Token Snapshot?

Call it via:
```
getSnapshot({
  provider,
  contractAddress,
  fromBlock,
  toBlock,
  blocksPerBatch,
  delay,
  checkIfContract
})
```

## Configuration Parameters

```json
{
  "provider": "https://mainnet.infura.io/v3/<key>",
  "contractAddress": "",
  "fromBlock": 0,
  "toBlock": "latest",
  "format": "json",
  "blocksPerBatch": 2500,
  "delay": 0,
  "checkIfContract": "yes"
}
```

### provider

Enter your fully synced Ethereum node. Could be a local node or remote services like Infura.

### contractAddress

Address of your ERC20 token.

### fromBlock

The block height to scan from. To save time, enter the block number of the transaction your token was created on.

### toBlock

The block height to end the scan at.

### blocksPerBatch

The number of blocks to query per batch.

If you are using remote service like Infura, keep this number relative low (2000-5000) to avoid rate limits. If you are using a dedicated Ethereum node, you can increase this number to suit your needs.

### delay

The delay (in ms) between each request in the loop. Tweak this if you are experiencing rate limit from your provider.

### checkIfContract

Checks each address to determine whether it is a smart contract or an Ethereum wallet.

## You May Also Like

- [Vyper ERC20 Contracts](https://github.com/binodnp/vyper-erc20)
- [Vyper Crowdsale Contracts](https://github.com/binodnp/vyper-crowdsale)
- [Solidoc: Solidity Documentation Generator](https://github.com/CYBRToken/solidoc)
- [SolFlattener: Solidity Flattener](https://github.com/CYBRToken/sol-flattener)
- [Vesting Schedule](https://github.com/binodnp/vesting-schedule)
