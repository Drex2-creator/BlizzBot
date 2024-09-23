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
const { sendCustomMessage } = require("./functions/sendMessage");

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
    // Enviar un mensaje personalizado
    client.buttons.set("send_welcome_message", {
      execute: async (interaction) => {
        const welcomeChannelId = "727579109529616452";
        await sendCustomMessage(client, welcomeChannelId);
        await interaction.reply({
          content: "Mensaje de bienvenida enviado con éxito!",
          ephemeral: true,
        });
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
      .setLabel("Actualizar Precios♻️")
      .setStyle(ButtonStyle.Success),
    // Añade este nuevo botón
    new ButtonBuilder()
      .setCustomId("send_welcome_message")
      .setLabel("ACTIVO🟢")
      .setStyle(ButtonStyle.Primary)
  );

  await channel.send({ embeds: [embed], components: [row] });
}
