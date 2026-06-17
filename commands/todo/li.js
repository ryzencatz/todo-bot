const { SlashCommandBuilder } = require("discord.js");
const { loadData, saveData } = require("../../data/storage");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("li")
        .setDescription("does stuff related to list items")
        .addSubcommand( subcommand => 
            subcommand
            .setName("add")
            .setDescription("adds a list item")
            .addStringOption( option =>
                option
                .setName("content")
                .setDescription("the content of the list item")
                .setRequired(true)
            )
            .addStringOption( option => 
                option
                .setName("list-name")
                .setDescription("the name of the list that the li is in")
                .setRequired(true)
            )
        )
        .addSubcommand( subcommand => 
            subcommand
            .setName("toggle-complete")
            .setDescription("mark a li as complete if incomplete and vice versa")
            .addIntegerOption( option =>
                option
                .setName("li-num")
                .setDescription("the number of the list item to mark as complete")
                .setRequired(true)
            )
            .addStringOption( option => 
                option
                .setName("list-name")
                .setDescription("the name of the list that the li is in")
                .setRequired(true)
            )
        ),
    async execute(interaction) {
        const data = loadData();

        if (interaction.options.getSubcommand() === "add") {
            return;
        } else if (interaction.options.getSubcommand() === "toggle-complete") {
            index = interaction.options.getInteger("li-num") - 1;
            listname = interaction.options.getString("list-name");

            if (data[listname][index][completed] === false) {
                data[listname][index][completed] === true;
            } else if (data[listname][index][completed] === true) {
                data[listname][index][completed] === false;
            }

            saveData(data);
            await interaction.reply(`marked ${data[listname][index][content]} as ${data[listname][index][completed]}!`);
        }
    }
};