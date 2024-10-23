// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

contract Trade {

    // Struct to represent a stock
    struct Stock {
        string name;     // Name of the stock
        uint256 quantity; // Quantity of the stock
    }

    // Mapping to store stock data by stock name
    mapping(string => Stock) public stocks;

    // Array to keep track of stock names (since mappings are not iterable)
    string[] public stockNames;

    // Function to input stock names and corresponding quantities
    function addStock(string memory _name, uint256 _quantity) public {
        // If it's a new stock, add the name to the stockNames array
        if (stocks[_name].quantity == 0) {
            stockNames.push(_name);
        }
        // Update the stock details in the mapping
        stocks[_name] = Stock(_name, _quantity);
    }

    // Function to return all stock names and their quantities
    function getAllStocks() public view returns (string[] memory, uint256[] memory) {
        uint256 length = stockNames.length;

        // Create arrays to hold stock names and their quantities
        string[] memory names = new string[](length);
        uint256[] memory quantities = new uint256[](length);

        // Loop through the stockNames array and get corresponding stock data from the mapping
        for (uint256 i = 0; i < length; i++) {
            string memory stockName = stockNames[i];
            names[i] = stocks[stockName].name;
            quantities[i] = stocks[stockName].quantity;
        }

        return (names, quantities);
    }

    // Function to get the quantity of a specific stock by its name
    function getStockQuantity(string memory _name) public view returns (uint256) {
        return stocks[_name].quantity;
    }
}
