'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('suivi-carnets', {
			id_suivi_carnets: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			etat: {
				type: Sequelize.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
					isIn: [['perdu', 'mort', 'malade', 'mauvais', 'bon']],
				},
			},
			description_sante: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			poids: {
				type: Sequelize.FLOAT,
				allowNull: false,
			},
			taille: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			date_de_naissance: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			date_de_diagnostic: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			id_animaux: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('suivi-carnets');
	},
};
