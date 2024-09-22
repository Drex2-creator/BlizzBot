const mongoose = require("mongoose");
const Price = require("../../../models/priceModel.js");
const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

async function handleUpdatePrices(interaction) {
  // Defer the reply to give more time to process
  await interaction.deferReply({ ephemeral: true });

  const region = interaction.fields.getTextInputValue("region");
  const usd = interaction.fields.getTextInputValue("usd");
  const ves = interaction.fields.getTextInputValue("ves");
  const cop = interaction.fields.getTextInputValue("cop");

  if (!region || !usd || !ves || !cop) {
    await interaction.editReply("Por favor, complete todos los campos.");
    return;
  }

  if (region !== "US" && region !== "EU") {
    await interaction.editReply("La región debe ser US o EU.");
    return;
  }

  try {
    // Actualiza el precio o lo inserta si no existe
    const updatedPrice = await Price.findOneAndUpdate(
      { region },
      { usd, ves, cop },
      { upsert: true, new: true, runValidators: true }
    );

    // Si se actualiza exitosamente
    if (updatedPrice) {
      await interaction.editReply(
        `Precios para ${region} actualizados exitosamente:\nUSD: ${usd}\nVES: ${ves}\nCOP: ${cop}`
      );
    } else {
      await interaction.editReply(
        "No se pudo actualizar los precios. Por favor, inténtalo de nuevo."
      );
    }
  } catch (error) {
    console.error("Error al actualizar los precios:", error);
    // Edita la respuesta en lugar de hacer reply nuevamente
    await interaction.editReply(
      "Ocurrió un error al actualizar los precios. Por favor, inténtalo de nuevo más tarde."
    );
  }
}

function createUpdatePricesModal() {
  const modal = new ModalBuilder()
    .setCustomId("updatePricesModal")
    .setTitle("Actualizar Precios");

  const regionInput = new TextInputBuilder()
    .setCustomId("region")
    .setLabel("Región (US o EU)")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const usdInput = new TextInputBuilder()
    .setCustomId("usd")
    .setLabel("Precio en USD")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const vesInput = new TextInputBuilder()
    .setCustomId("ves")
    .setLabel("Precio en VES")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const copInput = new TextInputBuilder()
    .setCustomId("cop")
    .setLabel("Precio en COP")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  modal.addComponents(
    new ActionRowBuilder().addComponents(regionInput),
    new ActionRowBuilder().addComponents(usdInput),
    new ActionRowBuilder().addComponents(vesInput),
    new ActionRowBuilder().addComponents(copInput)
  );

  return modal;
}

module.exports = { handleUpdatePrices, createUpdatePricesModal };
