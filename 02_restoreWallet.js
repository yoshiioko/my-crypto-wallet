/**
 * @fileoverview Allows the user to restore their wallet using a mnemonic seed phrase
 * Run CMD: node 02_newAccount.js "Your Seed Phrase Here" 0 (e.g. this returns EVM account at index 0)
 */

const { mnemonicToEntropy } = require("ethereum-cryptography/bip39");
const { wordlist } = require("ethereum-cryptography/bip39/wordlists/english");
const { HDKey } = require("ethereum-cryptography/hdkey");
const { getPublicKey } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { bytesToHex } = require("ethereum-cryptography/utils");

/**
 * Uses the specified mnemonic seed pharse to restore the account and return the EVM account at the
 * specified index.
 */
async function main(_mnemonic, _accountIndex) {
  const entropy = mnemonicToEntropy(_mnemonic, wordlist);
  const hdRootKey = HDKey.fromMasterSeed(entropy);
  const privateKey = hdRootKey.deriveChild(parseInt(_accountIndex)).privateKey;
  const publicKey = getPublicKey(privateKey);
  const address = keccak256(publicKey).slice(-20);

  console.log(
    `Account ${_accountIndex} Wallet Address: 0x${bytesToHex(address)}`
  );
}

main(process.argv[2], process.argv[3])
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
