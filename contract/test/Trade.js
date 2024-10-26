const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("Trade", function () {
  async function deployTradeContractFixture() {
    const Trade = await ethers.getContractFactory("Trade");
    const trade = await Trade.deploy();
    return { trade };
  }

  describe("getAllStocks", function () {
    it("Should return all stocks with correct quantities", async function () {
      const { trade } = await loadFixture(deployTradeContractFixture);

      const stockItems = ["BTC", "ETH", "BNB"];
      const quantities = [5, 10, 20];

      for (let i = 0; i < stockItems.length; i++) {
        await trade.addStock(stockItems[i], quantities[i]);
      }

      const [names, amounts] = await trade.getAllStocks();

      // Check names match
      expect(names).to.have.members(stockItems);
      // Check quantities match
      expect(amounts.map(q => q.toNumber())).to.have.members(quantities);
    });

    it("Should return empty arrays if no stocks are present", async function () {
      const { trade } = await loadFixture(deployTradeContractFixture);

      const [names, quantities] = await trade.getAllStocks();
      expect(names.length).to.equal(0);
      expect(quantities.length).to.equal(0);
    });
  });
});
