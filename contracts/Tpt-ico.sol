// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Tp-token.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract Tptico {
    using Address for address payable;

    Tptoken private _tptoken;
    string private _name;
    uint256 private _timeInit;

    event Bought(address buyer, uint256 amount);
    event Refunded(address buyer, uint256 amount);
    event Withdrew(address owner, uint256 amount);

    constructor(address tptokenAdress_, string memory name_) {
        _tptoken = Tptoken(tptokenAdress_);
        _name = name_;
        _timeInit = block.timestamp;
    }


    receive() external payable {
        _buyTokens();
    }

    function buyTokens() external payable {
        _buyTokens();
    }

    function _buyTokens() private {
        require(_tptoken.allowance(_tptoken.owner(), address(this)) > 0, "Tptico: no more token to buy");
        require(block.timestamp < (_timeInit + 15 days), "Tptico: sorry the ico is closed");
        uint256 tokenValue = msg.value * (10**9);
        if (tokenValue > _tptoken.allowance(_tptoken.owner(), address(this))) {
            uint256 rest = tokenValue - _tptoken.allowance(_tptoken.owner(), address(this));
            tokenValue = tokenValue - rest;
            payable(msg.sender).sendValue(rest / (10**9));

            emit Refunded(msg.sender, rest / (10**9));
        }
        _tptoken.transferFrom(_tptoken.owner(), msg.sender, tokenValue);
        emit Bought(msg.sender, tokenValue);
    }

    function withdraw() external payable {
        require(msg.sender == _tptoken.owner(), "Tptico: only owner can withdraw");
        require(block.timestamp >= (_timeInit + 15 days), "Tptico: sorry be more patient");
        uint256 balance = address(this).balance;
        payable(_tptoken.owner()).sendValue(address(this).balance);
        emit Withdrew(_tptoken.owner(), balance);
    }

    function name() public view returns (string memory) {
        return _tptoken.name();
    }
}
