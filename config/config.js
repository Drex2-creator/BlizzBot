require("dotenv").config();

module.exports = {
  token: process.env.DISCORD_TOKEN,
  priceChannelId: "1015087640535650387",
  ticketChannelId: process.env.TICKET_CHANNEL_ID,
  roleChannelId: process.env.ROLE_CHANNEL_ID,
  adminChannelId: process.env.ADMIN_CHANNEL_ID,
  orderChannelId: process.env.ORDER_CHANNEL_ID,
  toggleChannelId: process.env.CHANNEL_TO_TOGGLE_ID,
  mongoURI:
    "mongodb+srv://Drexleer:laprin123@levelupx.96lz0.mongodb.net/?retryWrites=true&w=majority&appName=LevelUpx",
};
