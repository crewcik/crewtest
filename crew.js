const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction, Partials.GuildScheduledEvent, Partials.User, Partials.ThreadMember]});
const ayarlar = require('./crew-ayarlar');
const moment = require('moment');
const fs = require('fs');
const { readdirSync } = require('fs');
const { join } = require('path');

let token = ayarlar.token;
let prefix = ayarlar.prefix;
let crew = ayarlar.crew;

const crew_log = consol => { console.log(`${moment().format("DD-MM-YYYY HH:mm:ss")} : ${consol}`) } 

client.commands = new Collection();
const commandFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith(".js"))
for (const file of commandFiles) {
    const command = require(join(__dirname, "commands", `${file}`))
    client.commands.set(command.kod, command);
    crew_log(`${file} - Yüklendi!`)
}

client.on('messageCreate', async(message) => {
    if (message.author.bot) return message.react('😒');
    if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        if (!client.commands.has(command)) return;
        try {
            client.commands.get(command).run(client, message, args);
        } catch (e) {
            crew_log(e)
        }
    }
})

client.on('ready', () => {
    crew_log(`${client.user.tag}, Aktif edildi.`)
    client.user.setActivity('Crew')
})

client.login(token)