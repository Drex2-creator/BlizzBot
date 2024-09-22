const Price = require("../../../models/priceModel.js");

async function getGoldPrices(region) {
  try {
    const price = await Price.findOne({ region });
    console.log("Gold prices", price);
    if (!price) {
      throw new Error(`No prices found for region: ${region}`);
    }
    return {
      usd: price.usd,
      ves: price.ves,
      cop: price.cop, // Aquí estaba el error, ahora está corregido
    };
  } catch (error) {
    console.error("Error fetching gold prices:", error);
    throw error;
  }
}

module.exports = getGoldPrices;
