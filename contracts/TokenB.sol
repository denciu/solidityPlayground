// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract TokenB is ERC20PresetMinterPauser {
    constructor(string memory _name, string memory _symbol)
        ERC20PresetMinterPauser(_name, _symbol)
    {
        _mint(msg.sender, 10 ether);
    }

    function faucet() public {
        _mint(msg.sender, 1 ether);
    }
}
