const { MessageEmbed } = require('discord.js');
const { Message } = require('discord.js');

class Bot {
	constructor(client, message) {
		this.client = client;
		this.message = message;
		this.userID = process.env.USER_ID;
	}

	/**
	 * @param {Message} message
	 * @description Creates a new message
	 * @returns A New Message
	 */
	createPlainMessage(message, extraArgs) {
		if (extraArgs !== undefined) {
			return this.message.channel.send({ content: message, extraArgs });
		} else {
			return this.message.channel.send({ content: message });
		}
	}

	/**
	 * @param {Hexadecimal} color
	 * @param {String} title
	 * @param {String} description
	 * @description Creates a new embedded message
	 * @returns A new embedded message
	 */

	async createMessage(color, title, description) {
		if (color === 'none/default') {
			color = '#0099ff';
		} else if (color === 'error') {
			color = '#ff3b3b';
		} else if (color === 'sucess') {
			color = '#3dff3d';
		} else if (color === 'warning') {
			color = '#ffc936';
		} else if (title === 'none') {
			title = '';
		} else if (description === 'none') {
			description = '';
		}

		const embed = new MessageEmbed()
			.setColor(color)
			.setTitle(title)
			.setDescription(description)
			.setTimestamp()
			.setFooter(
				`Requested by ${this.message.member.user.tag}`,
				this.message.author.displayAvatarURL(),
			);

		this.message.channel.send({ embeds: [embed] });
	}

	/**
	 * @param {Module} mongoode
	 * @description Starts the mondodb databases
	 * @returns A console.log();
	 */

	startDatabases(mongoose) {
		console.log('** Connecting to the Databases.');
		mongoose
			.connect(
				`mongodb+srv://${process.env.DATABASE_ADMIN_NAME}:${process.env.DATABASE_PASSWORD}@mbot1.zsgmb.mongodb.net/Data`,
				{
					useUnifiedTopology: true,
					useNewUrlParser: true,
				},
			)
			.then(
				console.log(
					'** Connection to the Databases has been successfully made!',
				),
			);
	}
}

module.exports = { Bot };
