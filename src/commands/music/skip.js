module.exports = {
	name: 'skip',
	aliases: ['sk'],
	name_big: '| SKIP |',
	desc: 'Skips the song that is currently playing.',
	exec: async (client, message, args, bot) => {
		if (!message.member.voice.channel)
			return bot.createMessage(
				'error',
				'~ Error! ~',
				'You are not in a voice channel!',
			);

		let queue = await client.distube.getQueue(message);

		if (queue) {
			client.distube.skip(message);

			bot.createMessage(
				'sucess',
				'Sucess!',
				'I have successfully skipped the song.',
			);
		} else if (!queue) {
			return bot.createMessage(
				'error',
				'~ Error! ~',
				'There is no music currently playing...',
			);
		}
	},
};
