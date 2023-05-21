'use strict';

const { EspacesModel } = require('../models/espaces.model');
const { EspecesModel } = require('../models/especes.model');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('espaces-especes', {
			id_espaces: {
				type: Sequelize.INTEGER,
				references: {
					model: EspacesModel,
					key: 'id_espaces',
				},
			},
			id_especes: {
				type: Sequelize.INTEGER,
				references: {
					model: EspecesModel,
					key: 'id_especes',
				},
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('espaces-especes');
	},
};
