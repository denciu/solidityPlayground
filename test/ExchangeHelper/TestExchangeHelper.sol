// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;

import {Assert} from "truffle/Assert.sol";
import {ExchangeHelper} from "../../contracts/ExchangeHelper.sol";

contract TestExchangeHelper {
    function testCalculateDecimalDiff() public {
        int8 result;
        result = ExchangeHelper.calculateDecimalDiff(10, 0, 10);
        Assert.equal(result, 20, "positive diff");
        result = ExchangeHelper.calculateDecimalDiff(10, 20, 10);
        Assert.equal(result, 0, "zero diff");
        result = ExchangeHelper.calculateDecimalDiff(10, 30, 10);
        Assert.equal(result, -10, "negative diff");
    }

    function testApplyDecimals() public {
        uint256 result;
        result = ExchangeHelper.applyDecimals(1, 1);
        Assert.equal(result, 10, "positive diff");
        result = ExchangeHelper.applyDecimals(1, 0);
        Assert.equal(result, 1, "zero diff");
        result = ExchangeHelper.applyDecimals(10, -1);
        Assert.equal(result, 1, "negative diff");
        result = ExchangeHelper.applyDecimals(1, -1);
        Assert.equal(result, 0, "returns fraction");
    }

    function testCalculateSellPrice() public {
        uint256 result;
        result = ExchangeHelper.exchange(100, 200, 2, 2, 3, false);
        Assert.equal(result, 2 * 10**3, "with positive decimals diff");

        result = ExchangeHelper.exchange(2000000, 200, 2, 4, 2, false);
        Assert.equal(result, 4 * 10**4, "with zero decimals diff");

        result = ExchangeHelper.exchange(2000000, 200, 2, 6, 2, false);
        Assert.equal(result, 4 * 10**2, "with negative decimals diff");

        result = ExchangeHelper.exchange(7 * (10**18), 3333, 4, 18, 18, false);
        Assert.equal(
            result,
            23331 * (10**14),
            "with params that dont divide evenly"
        );

        result = ExchangeHelper.exchange(100, 3 * (10**9), 9, 2, 18, false);
        Assert.equal(result, 3 * 10**18, "with big decimal diff");

        result = ExchangeHelper.exchange(3350, 456, 2, 2, 2, false);
        Assert.equal(result, 15276, "simulate 33.50 euro => pln exchange");
    }

    function testCalculateBuyPrice() public {
        uint256 result;
        result = ExchangeHelper.exchange(1000, 200, 2, 2, 3, true);
        Assert.equal(result, 50, "with positive decimals diff");

        result = ExchangeHelper.exchange(1000, 2000, 3, 3, 2, true);
        Assert.equal(result, 5000, "with negative decimals diff");

        result = ExchangeHelper.exchange(
            10 * (10**18),
            3 * (10**9),
            9,
            18,
            18,
            true
        );
        Assert.equal(
            result,
            3333333333333333333,
            "with params that dont divide evenly"
        );

        result = ExchangeHelper.exchange(
            5 * (10**18),
            3 * (10**9),
            9,
            2,
            18,
            true
        );
        Assert.equal(result, 166, "with big decimals diff");
    }
}
