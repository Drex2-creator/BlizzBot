require("dotenv").config();

module.exports = {
  token: process.env.DISCORD_TOKEN,
  priceChannelId: "1287926439395721216",
  ticketChannelId: "727579109739462736",
  roleChannelId: "1287963198313599030",
  adminChannelId: process.env.ADMIN_CHANNEL_ID,
  orderChannelId: process.env.ORDER_CHANNEL_ID,
  toggleChannelId: process.env.CHANNEL_TO_TOGGLE_ID,
  mongoURI:
    "mongodb+srv://Drexleer:laprin123@levelupx.96lz0.mongodb.net/?retryWrites=true&w=majority&appName=LevelUpx",
};
