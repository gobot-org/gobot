module.exports = {
	name: 'stop',
	aliases: ['st'],
	name_big: '| STOP |',
	desc: 'Stops the song/playlist that is currently playing.',
	exec: async (client, message, args, bot) => {
		if (!message.member.voice.channel)
			return bot.createMessage(
				'error',
				'~ Error! ~',
				'You are not in a voice channel!',
			);

		let queue = await client.distube.getQueue(message);

		if (queue) {
			client.distube.stop(message);

			bot.createMessage(
				'sucess',
				'Sucess!',
				'I have successfully stopped the music.',
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
