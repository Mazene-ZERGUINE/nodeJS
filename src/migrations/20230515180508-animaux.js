'use strict';

/** @type {import("sequelize-cli").Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('animaux', {
			id_animaux: {
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
			sexe: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
			},
			date_de_naissance: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			id_especes: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('animaux');
	},
};
