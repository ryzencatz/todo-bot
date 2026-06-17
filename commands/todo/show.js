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
        let output = `\n**${list}**\n`; 

        data[list].forEach((item, index) => {
            if (item.completed) {
                output +=
                    `${index + 1}. ~~${item.content}~~\n`;
            } else {
                output +=
                    `${index + 1}. ${item.content}\n`;
            }
        });

        await interaction.reply(`${output}\n`);
    }
};