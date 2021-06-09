// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Tp-token.sol";
import "@openzeppelin/contracts/utils/Address.sol";

/**
 * @title ico contract
 *
 *@notice contract allow to buy tokens from {Tptoken} contract
 *
 */

contract Tptico {
    using Address for address payable;

    Tptoken private _tptoken;
    string private _name;
    uint256 private _timeInit;
    /**
@notice Bought event is emitted when address buy tokens 
 */
    event Bought(address buyer, uint256 amount);
    /**
@notice Refunded event is emitted too much ethers are send in the ico  
 */
    event Refunded(address buyer, uint256 amount);
    /**
@notice Withdrew event is emitted when the owner withdraw the ethers from the ico
 */
    event Withdrew(address owner, uint256 amount);

    constructor(address tptokenAdress_, string memory name_) {
        _tptoken = Tptoken(tptokenAdress_);
        _name = name_;
        _timeInit = block.timestamp;
    }

    /**
     *@notice payable from metamask
     */

    receive() external payable {
        _buyTokens();
    }

    /**
     *@notice to buy tokens
     */
    function buyTokens() external payable {
        _buyTokens();
    }

    /**
     *@notice private buyToken function used in payable functions
     *@dev require the allowance of the ico > 0
     *@dev require the transaction to be in the time of the ico
     */
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

    /**
     *@notice the owner of the ERC20 can withdraw the ethers
     *@dev require only owner
     *@dev require the ico is ended
     */
    function withdraw() external payable {
        require(msg.sender == _tptoken.owner(), "Tptico: only owner can withdraw");
        require(block.timestamp >= (_timeInit + 15 days), "Tptico: sorry be more patient");
        uint256 balance = address(this).balance;
        payable(_tptoken.owner()).sendValue(address(this).balance);
        emit Withdrew(_tptoken.owner(), balance);
    }

    /**
     *@notice  get the name of the ico
     *@dev returns the name of the ico
     */

    function name() public view returns (string memory) {
        return _tptoken.name();
    }
}
