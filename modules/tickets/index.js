const {
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} = require("discord.js");
const { ticketChannelId } = require("../../config/config");
const staffRoleId = "1286006325234503750";

const TICKET_TYPES = [
  { label: "Venta de Oro - WoW Retail", value: "retail_gold" },
  { label: "Venta de Oro - WoW SoD", value: "sod_gold" },
  { label: "Venta de Oro - WoW Cata", value: "cata_gold" },
  { label: "Soporte General", value: "general_support" },
];

module.exports = {
  init: (client) => {
    client.buttons.set("create_ticket", {
      execute: async (interaction) => {
        const selectMenu = new StringSelectMenuBuilder()
          .setCustomId("ticket_type")
          .setPlaceholder("Selecciona el tipo de ticket")
          .addOptions(TICKET_TYPES);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.reply({
          content: "Por favor, selecciona el tipo de ticket que deseas abrir:",
          components: [row],
          ephemeral: true,
        });
      },
    });

    client.on("interactionCreate", async (interaction) => {
      if (!interaction.isStringSelectMenu()) return;

      if (interaction.customId === "ticket_type") {
        const ticketType = interaction.values[0];
        const member = interaction.member;
        const guild = interaction.guild;

        let category = guild.channels.cache.find(
          (c) => c.name === "Tickets" && c.type === ChannelType.GuildCategory
        );
        if (!category) {
          console.error('La categoría de canales "Tickets" no existe');
          return;
        }

        const channelName = `ticket-${member.user.username}-${ticketType}`;

        const staffRole = await guild.roles.fetch(staffRoleId);
        if (!staffRole) {
          console.error(`El rol de staff con ID ${staffRoleId} no existe.`);
          return interaction.update({
            content:
              "Ha ocurrido un error al crear el ticket. Por favor, contacta a un administrador.",
            components: [],
            ephemeral: true,
          });
        }

        try {
          const ticketChannel = await guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: category,
            permissionOverwrites: [
              {
                id: guild.id,
                deny: [PermissionFlagsBits.ViewChannel],
              },
              {
                id: member.id,
                allow: [
                  PermissionFlagsBits.ViewChannel,
                  PermissionFlagsBits.SendMessages,
                ],
              },
              {
                id: staffRole,
                allow: [
                  PermissionFlagsBits.ViewChannel,
                  PermissionFlagsBits.SendMessages,
                ],
              },
            ],
          });

          const closeButton = new ButtonBuilder()
            .setCustomId("close_ticket")
            .setLabel("Cerrar Ticket")
            .setStyle(ButtonStyle.Danger);

          const row = new ActionRowBuilder().addComponents(closeButton);

          const embed = new EmbedBuilder()
            .setColor("#00FF00")
            .setTitle(
              `Nuevo Ticket: ${
                TICKET_TYPES.find((t) => t.value === ticketType).label
              }`
            )
            .setDescription(
              `Bienvenido ${member}! Un miembro del personal estará contigo en breve.`
            )
            .addFields(
              {
                name: "Tipo de Ticket",
                value: TICKET_TYPES.find((t) => t.value === ticketType).label,
              },
              { name: "Creado por", value: member.user.tag }
            )
            .setTimestamp()
            .setFooter({ text: "BlizzShop® Support" });

          await ticketChannel.send({
            embeds: [embed],
            components: [row],
          });

          await interaction.update({
            content: `Su ticket ha sido creado en ${ticketChannel}`,
            components: [],
            ephemeral: true,
          });
        } catch (error) {
          console.error("Error al crear el canal del ticket:", error);
          await interaction.update({
            content:
              "Ha ocurrido un error al crear el ticket. Por favor, contacta a un administrador.",
            components: [],
            ephemeral: true,
          });
        }
      }
    });

    client.buttons.set("close_ticket", {
      execute: async (interaction) => {
        const member = interaction.member;
        const channel = interaction.channel;

        const staffRole = await interaction.guild.roles.fetch(staffRoleId);
        if (!staffRole) {
          console.error(`El rol de staff con ID ${staffRoleId} no existe.`);
          return interaction.reply({
            content:
              "Ha ocurrido un error al cerrar el ticket. Por favor, contacta a un administrador.",
            ephemeral: true,
          });
        }

        if (!member.roles.cache.has(staffRole.id)) {
          return interaction.reply({
            content: "No tienes permiso para cerrar este ticket.",
            ephemeral: true,
          });
        }

        await interaction.reply("Este ticket será cerrado en 5 segundos.");
        setTimeout(async () => {
          try {
            await channel.delete();
          } catch (error) {
            console.error("Error al eliminar el canal del ticket:", error);
            await interaction.followUp({
              content:
                "Ha ocurrido un error al cerrar el ticket. Por favor, ciérralo manualmente.",
              ephemeral: true,
            });
          }
        }, 5000);

        console.log(`Ticket cerrado: ${channel.name} por ${member.user.tag}`);
      },
    });

    client.once("ready", async () => {
      try {
        const channel = await client.channels.fetch(ticketChannelId);
        if (channel) {
          const embed = new EmbedBuilder()
            .setColor("#9B59B6")
            .setTitle("BlizzShop Soporte")
            .setDescription("Abre ticket para vender tu oro!!")
            .setThumbnail("https://i.imgur.com/x05RAns.png")
            .setFooter({ text: "BlizzShop®" });

          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("create_ticket")
              .setLabel("Abrir Ticket")
              .setStyle(ButtonStyle.Secondary)
              .setEmoji("📩")
          );

          await channel.send({
            embeds: [embed],
            components: [row],
          });
        }
      } catch (error) {
        console.error("Error al enviar el mensaje inicial:", error);
      }
    });
  },
};
