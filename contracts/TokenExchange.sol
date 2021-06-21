//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {ExchangeHelper} from "./ExchangeHelper.sol";

contract TokenExchange is Ownable {
    address private tokenA;
    address private tokenB;
    uint256 private price;
    uint8 private _decimals = 5;

    constructor(
        address _tokenAAddress,
        address _tokenBAddress,
        uint256 _price
    ) {
        tokenA = _tokenAAddress;
        tokenB = _tokenBAddress;
        price = _price;
    }

    modifier recognizedToken(address _tokenAddress) {
        require(
            tokenA == _tokenAddress || tokenB == _tokenAddress,
            "TokenExchange: Token address not recognized."
        );
        _;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function updatePrice(uint256 _newPrice) public onlyOwner {
        price = _newPrice;
    }

    function getPrice() public view returns (uint256) {
        return price;
    }

    function deposit(address _tokenAddress, uint256 _amount)
        public
        onlyOwner
        recognizedToken(_tokenAddress)
    {
        ERC20(_tokenAddress).transferFrom(msg.sender, address(this), _amount);
    }

    function withdraw(address _tokenAddress, uint256 _amount)
        public
        onlyOwner
        recognizedToken(_tokenAddress)
    {
        ERC20(_tokenAddress).transfer(msg.sender, _amount);
    }

    function calculateExchangeAmount(uint256 _amount, bool _isBuy)
        public
        view
        returns (uint256)
    {
        return
            ExchangeHelper.exchange({
                amount: _amount,
                exRate: price,
                exRateDecimals: _decimals,
                tokenFromDecimals: ERC20(tokenA).decimals(),
                tokenToDecimals: ERC20(tokenB).decimals(),
                isBuy: _isBuy
            });
    }

    function exchange(address _tokenAddress, uint256 _amount)
        public
        recognizedToken(_tokenAddress)
    {
        uint256 amountToExchange;
        ERC20 tokenAInstance = ERC20(tokenA);
        ERC20 tokenBInstance = ERC20(tokenB);

        if (_tokenAddress == tokenA) {
            amountToExchange = calculateExchangeAmount(_amount, true);

            require(
                tokenAInstance.transferFrom(msg.sender, address(this), _amount),
                "TokenExchange: Failed to transfer TA from user to contract"
            );
            require(
                tokenBInstance.transfer(msg.sender, amountToExchange),
                "TokenExchange: Failed to transfer TB to user"
            );
        } else {
            amountToExchange = calculateExchangeAmount(_amount, false);

            require(
                tokenBInstance.transferFrom(msg.sender, address(this), _amount),
                "TokenExchange: Failed to transfer TB from user to contract"
            );

            require(
                tokenAInstance.transfer(msg.sender, amountToExchange),
                "TokenExchange: Failed to transfer TA to user"
            );
        }
    }
}
