# What is this?

A simple Node.js app that implements an EVM wallet using the libraries: ethereum-cryptography and ethers.js

# How to use it?

## Step 1:
Run:

node 01_newAccount.js

## Step 2:
 
node 02_restoreWallet.js "Seed Phrase From Step 1 Goes Here" 

Note: Wallet Addresses from Steps 1 & 2 should match exactly!

## Step 3:

node 03_send.js "Receiver Address" "Amount of Ether"

Note: This command will fail on first execution because your local account will have no funds. Step 3 will 
output the account that needs to be funded with Devnet Ether!


# Tutorial Link

https://blog.chain.link/how-to-build-a-crypto-wallet/
