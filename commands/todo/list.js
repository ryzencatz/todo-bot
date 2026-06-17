const { SlashCommandBuilder } = require("discord.js");
const { loadData, saveData } = require("../../data/storage");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("list")
        .setDescription("does stuff related to lists")
        .addSubcommand(subcommand => 
            subcommand
            .setName("create")
            .setDescription("creates a new list")
            .addStringOption(option => 
                option
                .setName("list-name")
                .setDescription("adds a list name to identify the list")
                .setRequired(true)
            )
        ),
    async execute(interaction) {
        const data = loadData();

        if (interaction.options.getSubcommand() === "create") {
            const listname = interaction.options.getString("list-name");
            data[listname] = [];

            saveData(data);

            await interaction.reply(`created a new list called ${listname}!`);
        }
    },
};