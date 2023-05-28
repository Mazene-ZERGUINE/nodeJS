'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('entretien_carnets', {
			id_entretien_carnets: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			nom: {
				type: Sequelize.STRING,
				unique: true,
				allowNull: false,
				validate: {
					notEmpty: true,
					len: [1, 100],
				},
			},
			type: {
				type: Sequelize.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
					isIn: [['nettoyage', 'rénovation', 'réparation']],
				},
			},
			date_debut: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			date_fin: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			id: {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: {
					model: 'accounts',
					key: 'id',
				},
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('entretien_carnets');
	},
};
