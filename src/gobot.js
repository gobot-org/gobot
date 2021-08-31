// =============================================================================================

const keepAlive = require('./server.js');
keepAlive();

// =============================================================================================

require('dotenv').config();

// =============================================================================================

const Discord = require('discord.js');
const DisTube = require('distube');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { SpotifyPlugin } = require('@distube/spotify');
const client = new Discord.Client({
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
	intents: ['GUILDS', 'GUILD_VOICE_STATES', 'GUILD_MESSAGES'],
});

console.log('* Starting Bot.');
const bot = require('./events/bot.js');
const Bot = new bot.Bot(client);

// =============================================================================================

const fs = require('fs');
const mongoose = require('mongoose');

// =============================================================================================

const prefixSchema = require('./models/prefix');

// =============================================================================================

client.Commands = new Discord.Collection();

// =============================================================================================

const prefix = process.env.PREFIX;
let botMSG;

Bot.startDatabases(mongoose);

client.prefix = async function (message) {
	let custom;

	const data = await prefixSchema
		.findOne({ Guild: message.guild.id })
		.catch(err => console.log(err));

	if (data) {
		custom = data.Prefix;
	} else {
		custom = prefix;
	}
	return custom;
};

console.log("* Starting Bot's Music System.");

client.distube = new DisTube.default(client, {
	searchSongs: 1,
	searchCooldown: 30,
	leaveOnEmpty: true,
	emptyCooldown: 2,
	leaveOnFinish: true,
	leaveOnStop: true,
	plugins: [new SoundCloudPlugin(), new SpotifyPlugin()],
});

// =============================================================================================

console.log('** Searching for commands in ./commands...');

const dir = fs.readdirSync('./src/commands').filter(dir => dir);

console.log('** Found files in ./commands! Starting to load them...');

for (const directory of dir) {
	fs.lstat(`./src/commands/${directory}`, (err, status) => {
		if (status.isDirectory()) {
			const commandFiles = fs
				.readdirSync(`./src/commands/${directory}`)
				.filter(file => file.endsWith('.js'));
			console.log(`*** Starting to loading folder ${directory}...`);
			for (const file of commandFiles) {
				const command = require(`./commands/${directory}/${file}`);
				console.log(`*** Loading ${file}...`);

				console.log(`*** ${file} Loaded!`);
				client.Commands.set(command.name, command);
			}
		}
	});
}

// =============================================================================================

client.once('ready', () => {
	console.log('**** Bot is ready!');
	console.log('***** Any errors that happen would be displayed here.');
});

client.on('messageCreate', async message => {
	const pre = await client.prefix(message);
	if (!message.content.startsWith(pre) || message.author.bot) return;

	const botMsg = new bot.Bot(client, message);

	const args = message.content.slice(pre.length).split(/ +/);
	const cmd = args.shift().toLowerCase();

	botMSG = new bot.Bot(client, message);

	const command =
		client.Commands.get(cmd) ||
		client.Commands.find(a => a.aliases && a.aliases.includes(cmd));

	if (command) command.exec(client, message, args, botMsg);
});

// =============================================================================================

const status = queue =>
	`Volume: \`${queue.volume}%\` | Filter: \`${
		queue.filter || 'Off'
	}\` | Loop: \`${
		queue.repeatMode
			? queue.repeatMode == 2
				? 'Playlist Level'
				: 'Song Level'
			: 'Off'
	}\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``;

client.distube
	.on('playSong', (queue, song) => {
		let msg = `Song: \`${song.name}\`\nSong Duration: \`${
			song.formattedDuration
		}\`\n${status(queue)}`;
		if (song.playlist) {
			msg = `Playlist: ${song.playlist.name}\n${msg}`;
			return botMSG.createMessage(
				'sucess',
				'Started Playing Playlist:',
				msg,
			);
		}
		botMSG.createMessage('sucess', 'Started Playing:', msg);
	})
	.on('addSong', (queue, song) => {
		if (song.playlist) {
			return botMSG.createMessage(
				'sucess',
				'Added...',
				`Added ${song.name} - \`${song.formattedDuration}\` to the queue`,
			);
		}
	})
	.on('searchResult', result => {
		let i = 0;
		botMSG.createMessage(
			`warning', 'Choose...', '**Please choose an option from below:**\n${result
				.map(
					song =>
						`**${++i}**. ${song.name} - \`${
							song.formattedDuration
						}\``,
				)
				.join(
					'\n',
				)}\n***Enter anything else or wait 60 seconds to cancel***`,
		);
	})
	.on('searchCancel', () =>
		botMSG.createMessage(
			'warning',
			'Aww Man!',
			'The search was cancelled!',
		),
	)
	.on('error', e => {
		console.log(`***** ~ Error ~\n${e}`);
		botMSG.createMessage(
			'error',
			'~ Error! ~',
			`An error was encountered! Please contact the Developer about this error.\nError Code: ${e}`,
		);
	});

client.login(process.env.BOT_TOKEN);

// =============================================================================================
