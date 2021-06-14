# Truffle + TS setup

## Setup
Make sure to have `truffle` installed globally, if you don't run `npm i -g truffle`.

Run `npm install` to start things rollin

TS will complain until you compile the project with `npm run compile`.

Before running tests remember to turn on Ganache or `truffle develop`.

Run `npm run clean` to get rid of compiled files.

## Notes about setup
1. To make `truffle test` with `import {} from` style imports in TS files, `ts-node` needs to be installed and required in `truffle-config.js`,
2. According to `typechain` docs typings are already preinstalled but they don't work properly, so `truffle-typings` needs to be installed and set in 'types' of `tsconfig.json` instead of `truffle-contracts`.
3. `@openzeppelin/test-helpers` doesn't have types yet but I fixed something up that will make TS happy.

## General GOTCHAs to remember when writing tests:
- there's no need to run migration before tests, truffle is doing it for us,
- due to lack of `bn-chai` ts support best way to make assertions on BNs is to cast them `.toString()` and then compare. Math on BNs however needs to be done using BNs methods like BN.add(BN),
- `typechain` doesn't compile libraries that don't expose any public functions which makes TS unhappy but we can live without it,
- `trufle test` resets blockchains state only between `contract(() => {})` blocks, not between `describe` or `it` blocks, so state reset needs to be done by redeploying contracts with `contract.new()`, ideally in `beforeEach` block,
- expecting revert is possible in `.sol` tests. Instead of:
```sol
  result = subtract(0,1);
  Assert.equal(this won't work as revert will happen...);
```
Just wrap your function in `try/catch` - in `try` block make assertion that would fail, and in `catch` block fire assertion that would succeed. You can even assert on revert message!

```sol
try this.subtract(0,1) {
	// If somehow it would work we want this test to fail as we expect revert
	Assert.equal(true, false, "subtract should revert");
} catch Error(string memory reason) {
	Assert.equal(
		reason,
        "Some revert message if you wish",
        "subtract should revert"
    );
}
```


