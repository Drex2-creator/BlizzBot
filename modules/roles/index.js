const {
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const { roleChannelId } = require("../../config/config");
const companyImageUrl = "https://i.imgur.com/MkbV9hT.png";

module.exports = {
  init: (client) => {
    client.once("ready", async () => {
      const channel = await client.channels.fetch(roleChannelId);
      if (channel) {
        const embed = new EmbedBuilder()
          .setColor("#0099ff")
          .setTitle("Selecciona tu juego de World of Warcraft")
          .setDescription(
            "Haz clic en el botón correspondiente para obtener el rol de tu juego preferido."
          )
          .setFooter({ text: "BlizzShop®" })
          .setImage(companyImageUrl); // Añadir imagen de la empresa

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("role_wow_retail")
            .setLabel("WoW Retail")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("role_wow_sod")
            .setLabel("WoW SoD")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("role_wow_cata")
            .setLabel("WoW Cata")
            .setStyle(ButtonStyle.Danger)
        );

        await channel.send({ embeds: [embed], components: [row] });
      }
    });

    client.on("interactionCreate", async (interaction) => {
      if (!interaction.isButton()) return;

      const roleMap = {
        role_wow_retail: "WoW Retail",
        role_wow_sod: "WoW SoD",
        role_wow_cata: "WoW Cata",
      };

      const roleName = roleMap[interaction.customId];
      if (!roleName) return;

      const role = interaction.guild.roles.cache.find(
        (r) => r.name === roleName
      );
      if (!role) {
        return interaction.reply({
          content: `El rol ${roleName} no existe. Por favor, contacta a un administrador.`,
          ephemeral: true,
        });
      }

      const member = interaction.member;
      if (member.roles.cache.has(role.id)) {
        await member.roles.remove(role);
        await interaction.reply({
          content: `Se ha removido el rol ${roleName}.`,
          ephemeral: true,
        });
      } else {
        await member.roles.add(role);
        await interaction.reply({
          content: `Se te ha asignado el rol ${roleName}.`,
          ephemeral: true,
        });
      }
    });
  },
};
