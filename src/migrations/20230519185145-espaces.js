'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('espaces', {
			id_espaces: {
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
			description: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			image: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			capacite: {
				type: Sequelize.INTEGER,
				allowNull: false,
				validate: {
					min: 1,
				},
			},
			duree: {
				type: Sequelize.INTEGER,
				allowNull: false,
				validate: {
					min: 0,
				},
			},
			a_acces_handicape: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
			},
			est_en_entretien: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
			},
			taux_frequentation: {
				type: Sequelize.INTEGER,
				allowNull: true,
				validate: {
					min: 0,
				},
			},
			id_espace_types: {
				type: Sequelize.INTEGER,
			},
			id_entretien_carnets: {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: {
					model: 'entretien_carnets',
					key: 'id_entretien_carnets',
				},
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('espaces');
	},
};
