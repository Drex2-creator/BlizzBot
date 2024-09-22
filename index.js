const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { token } = require("./config/config");
const fs = require("fs");
const path = require("path");
const app = require("./server");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.buttons = new Collection();
client.commands = new Collection();
client.modals = new Collection(); // Colección para modales si usas varios

// Function to recursively load modules
function loadModules(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dir, file.name);

    if (file.isDirectory()) {
      loadModules(filePath);
    } else if (file.name.endsWith(".js")) {
      const module = require(filePath);
      if (typeof module.init === "function") {
        module.init(client); // Pasamos el cliente al módulo
      }
    }
  }
}

// Load all modules
loadModules(path.join(__dirname, "modules"));

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Centraliza la gestión de interacciones
client.on("interactionCreate", async (interaction) => {
  try {
    if (interaction.isButton()) {
      const button = client.buttons.get(interaction.customId);
      if (button) await button.execute(interaction);
    } else if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (command) await command.execute(interaction);
    } else if (interaction.isModalSubmit()) {
      const modal = client.modals.get(interaction.customId);
      if (modal) await modal.execute(interaction);
    }
  } catch (error) {
    console.error("Error handling interaction:", error);
    if (!interaction.replied) {
      await interaction.reply({
        content: "There was an error processing your interaction.",
        ephemeral: true,
      });
    }
  }
});

client.login(token);
