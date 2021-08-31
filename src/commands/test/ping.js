module.exports = {
	name: 'ping',
	aliases: ['pi', 'pong', 'po'],
	name_big: '| PING |',
	desc: 'Pings the bot',
	async exec(client, message, args, bot) {
		const msg = await message.channel.send({ content: 'Pinging' });

		const latency = msg.createdTimestamp - message.createdTimestamp;
		const choices = [
			'Woah, is that my ping?',
			'I think im running smoothly, but tell me if I am!',
			'Pong!',
			'I Hope it is not bad!',
		];
		const response = choices[Math.floor(Math.random() * choices.length)];

		msg.edit({
			content: `${response} - Bot Latency: \`${latency}ms\`, API Latency: \`${Math.round(
				client.ws.ping,
			)}ms\``,
		});
	},
};
