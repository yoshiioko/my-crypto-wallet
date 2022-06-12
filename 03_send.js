/**
 * @fileoverview Allows the user to restore their wallet using a mnemonic seed phrase
 * Run CMD: node 03_send.js "receiverAddress" "ammount"
 */

const { getDefaultProvider, Wallet, utils } = require("ethers");
const { readFileSync } = require("fs");

async function main(_receiverAddress, _ethAmount) {
  const network = "rinkeby";
  const provider = getDefaultProvider(network);

  const accountRawData = readFileSync("0_newAccount.json", "utf8");
  const accountData = JSON.parse(accountRawData);

  const privateKey = Object.values(accountData.privateKey);

  const signer = new Wallet(privateKey, provider);
  console.log(
    `If tx fails due to insufficient funds, fund this account with Ether: ${signer.address}\n`
  );

  const transaction = await signer.sendTransaction({
    to: _receiverAddress,
    value: utils.parseEther(_ethAmount),
  });

  console.log(transaction);
}

main(process.argv[2], process.argv[3])
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
