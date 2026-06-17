const { SlashCommandBuilder } = require("discord.js");
const { loadData, saveData } = require("../../data/storage");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("show")
        .setDescription("shows the list")
        .addStringOption(option => option.setName("list-name").setDescription("the list you want to show")),
    async execute(interaction) {
        const data = loadData();

        const list = interaction.options.getString("list-name");
        let incomplete = ``;
        let complete = ``;

        data[list].forEach((item, index) => {
            if (item.completed) {
                complete +=
                    `${index + 1}. ~~${item.content}~~\n`;
            } else {
                incomplete +=
                    `${index + 1}. ${item.content}\n`;
            }
        });
        
        await interaction.reply(`\n**${list}**\n${complete}${incomplete}`);
    }
};