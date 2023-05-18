'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('espace_types', {
			id_especes: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			nom: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
				validate: {
					notEmpty: true,
					len: [1, 100],
				},
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('espace_types');
	},
};
