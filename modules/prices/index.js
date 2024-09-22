const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const { priceChannelId } = require("../../config/config.js");
const getGoldPrices = require("./utils/getGoldPrices");

module.exports = {
  init: (client) => {
    client.buttons.set("us_rates", {
      execute: async (interaction) => {
        try {
          const prices = await getGoldPrices("US");
          const embed = createPriceEmbed("US", prices);
          if (!interaction.replied) {
            await interaction.reply({ embeds: [embed], ephemeral: true });
          } else {
            console.log("Interaction already acknowledged.");
          }
        } catch (error) {
          console.error("Error fetching US rates:", error);
          await interaction.reply({
            content:
              "An error occurred while fetching the rates. Please try again later.",
            ephemeral: true,
          });
        }
      },
    });

    client.buttons.set("eu_rates", {
      execute: async (interaction) => {
        try {
          const prices = await getGoldPrices("EU");
          const embed = createPriceEmbed("EU", prices);
          await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
          console.error("Error fetching EU rates:", error);
          await interaction.reply({
            content:
              "An error occurred while fetching the rates. Please try again later.",
            ephemeral: true,
          });
        }
      },
    });

    client.once("ready", async () => {
      const channel = await client.channels.fetch(priceChannelId);
      if (channel) {
        const embed = new EmbedBuilder()
          .setColor("#9B59B6")
          .setTitle("World of Warcraft Retail Gold Prices")
          .setDescription(
            "Click on the button for your region to see the rate we purchase for."
          )
          .addFields({
            name: "Click here to view payment options:",
            value: " | payment",
          })
          .setThumbnail("https://example.com/dhab_services_logo.png")
          .setFooter({ text: "Dhab®" });

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("us_rates")
            .setLabel("WoW DF Rates US")
            .setStyle(ButtonStyle.Success)
            .setEmoji("🇺🇸"),
          new ButtonBuilder()
            .setCustomId("eu_rates")
            .setLabel("WoW DF Rates EU")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("🇪🇺")
        );

        await channel.send({ embeds: [embed], components: [row] });
      }
    });
  },
};

function createPriceEmbed(region, prices) {
  return new EmbedBuilder()
    .setColor("#9B59B6")
    .setTitle(`Precio por 100K`)
    .setDescription(`${region} Servers`)
    .addFields(
      { name: "USD", value: `${String(prices.usd)} USD 🇺🇸`, inline: true },
      { name: "VES", value: `${String(prices.ves)} VES 🇻🇪`, inline: true },
      { name: "COP", value: `${String(prices.cop)} COP 🇨🇴`, inline: true }
    )
    .setThumbnail("https://i.imgur.com/x05RAns.png")
    .setFooter({ text: "BlizzShop®" });
}
