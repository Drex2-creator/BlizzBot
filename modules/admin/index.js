const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const { ADMIN_CHANNEL_ID, LOGO_URL } = require("./constants");
const {
  handleUpdatePrices,
  createUpdatePricesModal,
} = require("./functions/updatePrices");

module.exports = {
  init: (client) => {
    client.once("ready", async () => {
      const channel = await client.channels.fetch(ADMIN_CHANNEL_ID);
      if (channel) {
        await sendAdminPanel(channel);
      }
    });

    // Registrar botones
    client.buttons.set("update_prices", {
      execute: async (interaction) => {
        const modal = createUpdatePricesModal();
        await interaction.showModal(modal);
      },
    });

    // Registrar modales
    client.modals.set("updatePricesModal", {
      execute: async (interaction) => {
        await handleUpdatePrices(interaction);
      },
    });
  },
};

async function sendAdminPanel(channel) {
  const embed = new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("Panel de Administrador")
    .setDescription("Selecciona una acción:")
    .setThumbnail(LOGO_URL)
    .setFooter({ text: "BlizzShop®", iconURL: LOGO_URL });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("update_prices")
      .setLabel("Actualizar Precios")
      .setStyle(ButtonStyle.Success)
  );

  await channel.send({ embeds: [embed], components: [row] });
}
