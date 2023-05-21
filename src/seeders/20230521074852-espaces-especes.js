'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'espaces-especes',
			[
				{
					id_espaces: 1,
					id_especes: 1,
				},
				{
					id_espaces: 1,
					id_especes: 2,
				},
				{
					id_espaces: 2,
					id_especes: 3,
				},
			],
			{},
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('espaces-especes', null, {});
	},
};
