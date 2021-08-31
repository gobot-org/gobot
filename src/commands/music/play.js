module.exports = {
	name: 'play',
	aliases: ['pl'],
	name_big: '| PLAY |',
	desc: 'Plays a song from Youtube, SoundCloud or Spotify!',
	exec: async (client, message, args, bot) => {
		if (!message.member.voice.channel)
			return bot.createMessage(
				'error',
				'~ Error! ~',
				'You are not in a voice channel!',
			);

		client.distube.play(message, args.join(' '));
		bot.createMessage(
			'warning',
			'Please wait...',
			'Please wait while I search the song.',
		);
	},
};
