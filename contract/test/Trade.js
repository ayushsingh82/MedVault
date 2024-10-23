const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("Trade", function () {
  // Fixture to deploy the contract
  async function deployTradeContractFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Trade = await ethers.getContractFactory("Trade");
    const trade = await Trade.deploy();

    return { trade, owner, otherAccount };
  }

  describe("addStock", function () {
    it("Should add trade with correct quantities", async function () {
      const { trade } = await loadFixture(deployTradeContractFixture);

      const stockItems = ["BTC", "ETH"];
      const quantities = [5, 10];

      // Call the addStock function
      for (let i = 0; i < stockItems.length; i++) {
        await trade.addStock(stockItems[i], quantities[i]);
      }

      // Validate the trade quantities
      expect(await trade.getStockQuantity(stockItems[0])).to.equal(quantities[0]);
      expect(await trade.getStockQuantity(stockItems[1])).to.equal(quantities[1]);
    });

    it("Should update the quantity of an existing stock", async function () {
      const { trade } = await loadFixture(deployTradeContractFixture);

      // Add initial trade
      await trade.addStock("BTC", 5);

      // Update the trade for the same stock
      await trade.addStock("BTC", 15);

      // Validate the updated quantity
      expect(await trade.getStockQuantity("BTC")).to.equal(15);
    });
  });

  describe("getAllStocks", function () {
    it("Should return all stocks with correct quantities", async function () {
      const { trade } = await loadFixture(deployTradeContractFixture);

      const stockItems = ["BTC", "ETH", "BNB"];
      const quantities = [5, 10, 20];

      // Add trades
      for (let i = 0; i < stockItems.length; i++) {
        await trade.addStock(stockItems[i], quantities[i]);
      }

      // Retrieve all stocks
      const [names, amounts] = await trade.getAllStocks();

      // Validate the trade data
      expect(names).to.deep.equal(stockItems);
      expect(amounts.map(q => q.toNumber())).to.deep.equal(quantities);
    });

    it("Should return empty arrays if no stocks are present", async function () {
      const { trade } = await loadFixture(deployTradeContractFixture);

      // Retrieve all stocks when none are added
      const [names, quantities] = await trade.getAllStocks();

      // Validate that arrays are empty
      expect(names.length).to.equal(0);
      expect(quantities.length).to.equal(0);
    });
  });

  describe("getStockQuantity", function () {
    it("Should return the correct quantity of a specific stock", async function () {
      const { trade } = await loadFixture(deployTradeContractFixture);

      // Add trade
      await trade.addStock("BTC", 10);

      // Validate the quantity of the specific stock
      expect(await trade.getStockQuantity("BTC")).to.equal(10);
    });

    it("Should return 0 for a stock that has not been input", async function () {
      const { trade } = await loadFixture(deployTradeContractFixture);

      // Test for a stock that doesn't exist
      expect(await trade.getStockQuantity("Unknown")).to.equal(0);
    });
  });
});
