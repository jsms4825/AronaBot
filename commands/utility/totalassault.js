const { ButtonBuilder, ButtonStyle, SlashCommandBuilder, ActionRow, ActionRowBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('총력전')
		.setDescription('현재 진행되고 있는 총력전이나 다른 총력전의 덱을 확인합니다.'),
	async execute(interaction) {

        // Building buttons (buttons are not exhibited yet)

        const currentBoss = new ButtonBuilder()
            .setCustomId('currentBoss')
            .setLabel('현재 총력전 보스')
            .setStyle(ButtonStyle.Primary);
        
        const otherBoss = new ButtonBuilder()
            .setCustomId('otherBoss')
            .setLabel('다른 총력전 보스')
            .setStyle(ButtonStyle.Secondary);

        // Sending buttons (Users can see buttons)
        
        const row = new ActionRowBuilder()
            .addComponents(currentBoss, otherBoss);

		await interaction.reply({
            content: '선생님! 이 아로나가 총력전 관련 정보를 찾아드릴게요!',
            components: [row],
        });
	},
};