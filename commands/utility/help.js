const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('명령어')
		.setDescription('아로나 봇으로 이용할 수 있는 명령어 목록을 보여줍니다.'),
	async execute(interaction) {
		await interaction.reply({ content: '```ini\n' +
                                '[ /미래시 ] - 앞으로 있을 한국서버의 미래시를 열람할 수 있습니다. \n' +
                                '[ /총력전 ] - 현재 진행되고 있는 총력전이나 다른 총력전의 덱을 확인합니다. \n' +
                                '[ /학생 <학생이름> ] - 특정 학생에 대한 정보를 찾아봅니다. ' +
                                '```' +
                                '\n 선생님, 추후에 더 다양한 기능을 이용하고싶다면 이 아로나에게 말씀해주세요!',
                                ephemeral: true});
	},
};