const { EmbedBuilder } = require("discord.js");
const { LOGO_URL } = require("../constants");
const getGoldPrices = require("../../prices/utils/getGoldPrices");

async function sendCustomMessage(client, channelId) {
  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel) {
      console.error(`No se pudo encontrar el canal con ID: ${channelId}`);
      return;
    }

    // Obtener el precio actual de la base de datos
    const prices = await getGoldPrices("US");
    const usdPrice = prices.usd;

    const embed = new EmbedBuilder()
      .setColor("#FF5733")
      .setTitle("¡Bienvenido a BlizzShop!")
      .setDescription(
        "Estamos encantados de tenerte aquí. Explora nuestros productos y ofertas especiales."
      )
      .setThumbnail(LOGO_URL)
      .setTimestamp()
      .setFooter({ text: "BlizzShop®", iconURL: LOGO_URL })
      .addFields({
        name: "🔥 OFERTA ESPECIAL DEL DÍA 🔥",
        value: `\`\`\`diff\n+ ACTIVO COMPRANDO TODO TU ORO RETAIL\n- ${usdPrice}$ CADA 100k DE ORO\n\`\`\`\n**__¡Abre ticket en #vender ahora!__**`,
        inline: false,
      });

    // Enviar mensaje con mención a @everyone y el embed
    await channel.send({
      content: `@everyone`,
      embeds: [embed],
    });

    console.log(`Mensaje enviado al canal ${channelId}`);
  } catch (error) {
    console.error("Error al enviar el mensaje personalizado:", error);
  }
}

module.exports = { sendCustomMessage };
