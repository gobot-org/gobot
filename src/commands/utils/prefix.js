const prefixSchema = require('../../models/prefix');

module.exports = {
	name: 'prefix',
	aliases: ['pre', 'pr'],
	name_big: '| PREFIX |',
	desc: "Changes the server's prefix.",
	requires: ['MANAGE_SERVER'],
	async exec(client, message, args, bot) {
		if (!message.member.permissions.has(this.requires[0]))
			return bot.createMessage(
				'error',
				'***** ~ Error! ~',
				`***** You do not have the perm: **${this.requires[0]}!**`,
			);

		const res = await args.join(' ');
		if (!res) {
			let realData;
			const data = await prefixSchema
				.findOne({ Guild: message.guild.id })
				.catch(err => console.log(err));

			if (data) {
				return bot.createMessage(
					'none/default',
					'Prefix:',
					`The prefix in this guild (\`${message.guild.name}\`) is: **${data.Prefix}** `,
				);
			} else {
				return bot.createMessage(
					'none/default',
					'Prefix:',
					`The prefix in this guild (\`${message.guild.name}\`) is: **?** `,
				);
			}
		}

		if (res === 'reset') {
			prefixSchema.findOne(
				{ Guild: message.guild.id },
				async (err, data) => {
					if (!data) {
						console.log(res);
						bot.createMessage(
							'error',
							`Are you sure you want to change the server's prefix?`,
							`If you are gonna do it then do (your-prefix)prefix ?`,
						);
					} else {
						bot.createMessage(
							'warning',
							`? ? ?`,
							`Server\'s prefix is already in its **default state!?**`,
						);
					}
				},
			);
		} else {
			prefixSchema.findOne(
				{ Guild: message.guild.id },
				async (err, data) => {
					if (err)
						throw console.log(
							`***** ~ Error! ~\n***** Something bad happening when doing the command!`,
						);

					if (data) {
						prefixSchema.findOneAndDelete({
							Guild: message.guild.id,
						});
						data = new prefixSchema({
							Guild: message.guild.id,
							Prefix: res,
						});
						data.save();
						bot.createMessage(
							'sucess',
							`Sucessfully changed server\'s prefix!`,
							`Server\'s prefix has been changed to:\n**${res} !**`,
						);
					} else {
						data = new prefixSchema({
							Guild: message.guild.id,
							Prefix: res,
						});
						data.save();
						bot.createMessage(
							'sucess',
							`Sucessfully set server\'s prefix!`,
							`Server\'s prefix has been set to:\n**${res} !**`,
						);
					}
				},
			);
		}
	},
};
