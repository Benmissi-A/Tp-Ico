// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "./Tp-token.sol";

/**
 * @title calculator contract
 *
 *@notice do simple operations for some tokens
 *
 */


contract Tpcalculator {
    Tptoken private _tptoken;

    event Calculated(string operator, int256 nb1, int256 nb2, int256 result);
    event Transfered(address sender, address recipient, int256 amount);

    constructor(address tptokenAdress_) {
        _tptoken = Tptoken(tptokenAdress_);
    }
/**
*@notice do addition in exchange of 1 token
 */
    function add(int256 a, int256 b) public {
        _tptoken.transferFrom(msg.sender, _tptoken.owner(), 1**18);
        emit Calculated("add", a, b, a + b);
    }
/**
*@notice do substraction in exchange of 1 token
 */
    function sub(int256 a, int256 b) public {
        _tptoken.transferFrom(msg.sender, _tptoken.owner(), 1**18);
        emit Calculated("sub", a, b, a - b);
    }

/**
*@notice do multiplication in exchange of 1 token
 */
    function mul(int256 a, int256 b) public {
        _tptoken.transferFrom(msg.sender, _tptoken.owner(), 1**18);
        emit Calculated("mul", a, b, a * b);
    }
/**
*@notice do division in exchange of 1 token
 */
    function div(int256 a, int256 b) public {
        require(b != 0, "Tpcalculator: can not divide by 0");
        _tptoken.transferFrom(msg.sender, _tptoken.owner(), 1**18);
        emit Calculated("div", a, b, a / b);
    }

/**
*@notice do modulo in exchange of 1 token
 */
    function mod(int256 a, int256 b) public {
        require(b != 0, "Tpcalculator: can not divide by 0");
        _tptoken.transferFrom(msg.sender, _tptoken.owner(), 1**18);
        emit Calculated("mod", a, b, a % b);
    }
}
