'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			'passes',
			{
				pass_id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				nom: {
					type: Sequelize.STRING,
					allowNull: false,
				},
			},
			{
				createdAt: false,
				updatedAt: false,
				timestamps: false,
			},
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('passes');
	},
};
