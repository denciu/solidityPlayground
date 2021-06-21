# Token XChange

## Setup
Make sure to have `truffle` installed globally.

Run `npm install` to start things rollin

TS will complain until you compile the project with `npm run compile`.

Before running tests remember to turn on Ganache or `truffle develop`.

Run `npm run clean` to get rid of compiled files.

## Project
Token Xchange is a simple on chain RFC20 token swap with front end layer.
- Market maker can deposit/withdraw one of two tokens to the exchange pool
- Users can exchange one token to the other using fixed exchange rate

Frontend is build in React + TS + Ethers.js to interact with Smart Contracts.

Stack: Truffle / Solidity / React / Typescript
