'use strict';

const { INTEGER } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			'billets',
			{
				ticket_id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},

				is_used: {
					type: Sequelize.BOOLEAN,
					defaultValue: false,
				},
				allowed_spaces: {
					type: Sequelize.ARRAY(INTEGER),
					allowNull: false,
				},
				date: {
					type: Sequelize.DATE,
					allowNull: true,
				},
				pass_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
				},
				current_space: {
					type: Sequelize.INTEGER,
					defaultValue: null,
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
		await queryInterface.dropTable('billets');
	},
};
