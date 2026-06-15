const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];

// get the command folders
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath);

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] the command at ${filePath} is missing either a required "data" or "execute" property (or both).`);
        }
    }
}

// make instance of REST module and set the token
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// deploy commands!
(async () => {
    try {
        console.log(`started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID, 
                process.env.GUILD_ID
            ), 
            { body: commands }
        );

        console.log("success!");
    } catch (error) { 
        console.error(error);
    }
})();