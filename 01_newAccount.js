/**
 * @fileoverview Allows users to generate an EVM compatible wallet.
 * Run CMD: node 01_newAccount.js
 */

const {
  generateMnemonic,
  mnemonicToEntropy,
} = require("ethereum-cryptography/bip39");
const { wordlist } = require("ethereum-cryptography/bip39/wordlists/english");
const { HDKey } = require("ethereum-cryptography/hdkey");
const { getPublicKey } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { bytesToHex } = require("ethereum-cryptography/utils");
const { writeFileSync } = require("fs");

/**
 * Generates a 24 word mnemoic phrase and returns both the mnemoic list of words and entropy array.
 */
function _generateMnemonic() {
  const strength = 256;
  const mnemonic = generateMnemonic(wordlist, strength);
  const entropy = mnemonicToEntropy(mnemonic, wordlist);

  return { mnemonic, entropy };
}

/**
 * Returns the Hierarchical Deterministic (HD) root key, which can be used to generate the entire tree of key pairs.
 */
function _getHdRootKey(_mnemonic) {
  return HDKey.fromMasterSeed(_mnemonic);
}

/**
 * Leverages the HD root key to return a private key at the specified index from it's entire tree of key pairs.
 */
function _generatePrivateKey(_hdRootKey, _accountIndex) {
  return _hdRootKey.deriveChild(_accountIndex).privateKey;
}

/**
 * Uses ECSDA to derive a Public Key from a specified Private Key.
 */
function _getPublicKey(_privateKey) {
  return getPublicKey(_privateKey);
}

/**
 * Calculates the Ethereum account address from the specified public key by applying the Keccak-256 hashing algorithm
 * to the public key and returning the last 20 bytes of the result.
 */
function _getEthAddress(_publicKey) {
  return keccak256(_publicKey).slice(-20);
}

function _store(_privateKey, _publicKey, _address) {
  const accountOne = {
    privateKey: _privateKey,
    publicKey: _publicKey,
    address: _address,
  };

  const accountOneData = JSON.stringify(accountOne);
  writeFileSync("newAccount_0.json", accountOneData);
}

/**
 * Call this function to generate a new wallet mnemonic and get the first account from it.
 */
async function main() {
  const { mnemonic, entropy } = _generateMnemonic();
  console.log(`WARNING! Never disclose your Seed Phrase:\n ${mnemonic}\n`);

  const hdRootKey = _getHdRootKey(entropy);
  const accountOneIndex = 0;
  const accountOnePrivateKey = _generatePrivateKey(hdRootKey, accountOneIndex);
  const accountOnePublicKey = _getPublicKey(accountOnePrivateKey);
  const accountOneAddress = _getEthAddress(accountOnePublicKey);

  _store(accountOnePrivateKey, accountOnePublicKey, accountOneAddress);

  console.log(
    `Account One Private Key: \t0x${bytesToHex(accountOnePrivateKey)}`
  );
  console.log(`Account One Public Key: \t0x${bytesToHex(accountOnePublicKey)}`);
  console.log(
    `Account One Wallet address: \t0x${bytesToHex(accountOneAddress)}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
