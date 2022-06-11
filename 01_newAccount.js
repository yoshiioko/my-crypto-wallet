/**
 * @fileoverview Implements a function that allows a user to generate an EVM compatible wallet.
 * about its dependencies.
 * @package
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

function _generateMnemonic() {
  const strength = 256;
  const mnemonic = generateMnemonic(wordlist, strength);
  const entropy = mnemonicToEntropy(mnemonic, wordlist);

  return { mnemonic, entropy };
}

function _getHdRootKey(_mnemonic) {
  return HDKey.fromMasterSeed(_mnemonic);
}

function _generatePrivateKey(_hdRootKey, _accountIndex) {
  return _hdRootKey.deriveChild(_accountIndex).privateKey;
}

function _getPublicKey(_privateKey) {
  return getPublicKey(_privateKey);
}

function _getEthAddress(_publicKey) {
  return keccak256(_publicKey).slice(-20);
}

async function main() {
  const { mnemonic, entropy } = _generateMnemonic();
  console.log(`WARNING! Never disclose your Seed Phrase:\n ${mnemonic}`);

  const hdRootKey = _getHdRootKey(entropy);
  const accountOneIndex = 0;
  const accountOnePrivateKey = _generatePrivateKey(hdRootKey, accountOneIndex);
  const accountOnePublicKey = _getPublicKey(accountOnePrivateKey);
  const accountOneAddress = _getEthAddress(accountOnePublicKey);

  console.log(`Account One Private Key: 0x${bytesToHex(accountOnePrivateKey)}`);
  console.log(`Account One Public Key: 0x${bytesToHex(accountOnePublicKey)}`);
  console.log(`Account One Wallet address: 0x${bytesToHex(accountOneAddress)}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
