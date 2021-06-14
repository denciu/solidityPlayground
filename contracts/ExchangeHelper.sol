//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;

library ExchangeHelper {
    function calculateDecimalDiff(
        uint8 tokenFromDecimals,
        uint8 tokenToDecimals,
        uint8 exRateDecimals
    ) internal pure returns (int8) {
        return
            int8(tokenFromDecimals) -
            int8(tokenToDecimals) +
            int8(exRateDecimals);
    }

    function applyDecimals(uint256 amount, int8 decimal)
        internal
        pure
        returns (uint256)
    {
        if (decimal < 0) {
            return amount / 10**uint8(-decimal);
        } else {
            return amount * 10**uint8(decimal);
        }
    }

    function exchange(
        uint256 amount,
        uint256 exRate,
        uint8 exRateDecimals,
        uint8 tokenFromDecimals,
        uint8 tokenToDecimals,
        bool isBuy
    ) internal pure returns (uint256) {
        uint256 exchangedAmount;
        int8 decimalDiff =
            calculateDecimalDiff(
                tokenFromDecimals,
                tokenToDecimals,
                exRateDecimals
            );

        if (isBuy) {
            exchangedAmount = applyDecimals(amount, decimalDiff) / exRate;
        } else {
            exchangedAmount = applyDecimals(amount * exRate, -decimalDiff);
        }

        require(exchangedAmount > 0, "ExchangeHelper: Exchange would return 0");
        return exchangedAmount;
    }
}
