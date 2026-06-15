const fs = require("node:fs");
const path = require("node:path");
const { Client, Events, GatewayIntentBits, Collection, MessageFlags } = require("discord.js");

// making sure u ran the `--env-file=.env` part.
if (!process.env.DISCORD_TOKEN) {
  console.error('\nWARNING WARNING YOU\'RE GETTING HACKED\n\nno actually your token is not set\n');
  process.exit(1);
}

// create a new Client object aka the bot's connection to discord
const client = new Client({ intents: [GatewayIntentBits.Guilds] }); 

// creates a commands property in client and assigns the value as a Collection object
client.commands = new Collection();

// load command files in a much more compact way compared to just "require"-ing them manually (dynamic command loading)
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder); 
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js')); 
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file); 
        const command = require(filePath); 
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// executes the command when user types it in
client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return; 

    // gets the corresponding command file for the given commandName and gives an error if none is found
	const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`); 
        return;
    }

    // calls the execute method in the command file
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);

        // basically just telling the user that something went wrong
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ 
                content: "There was an error while executing this command.",
                flags: MessageFlags.Ephemeral,
            });
        } else {
            await interaction.reply({
                content: "There was an error while executing this command.",
                flags: MessageFlags.Ephemeral,
            });
        }
    }
});

// run when bot is ready 
client.once(Events.ClientReady, (readyClient) => {
    console.log(`ready! logged in as ${readyClient.user.tag}`);
});

// log in!
client.login(process.env.DISCORD_TOKEN);