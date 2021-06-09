// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
*@dev tptoken is {Ownable}, {ERC20}
 */

contract Tptoken is Ownable, ERC20 {

        /**
     * @dev Sets the values for {name} and {symbol}.
     *
     * The default value of {decimals} is 18. To select a different value for
     * {decimals} you should overload it.
     *
     * All two of these values are immutable: they can only be set once during
     * construction.
     */
     
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 totalSupply_
    ) ERC20(name_, symbol_) {
        _mint(owner(), totalSupply_);
    }
}
