'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			'statestiques',
			{
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},

				date: {
					type: Sequelize.DATE,
					allowNull: false,
				},

				ticket_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
				},

				espace_id: {
					type: Sequelize.INTEGER,
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
		await queryInterface.dropTable('statestiques');
	},
};
