'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'especes',
			[
				{
					nom: 'Mammifères',
				},
				{
					nom: 'Oiseaux',
				},
				{
					nom: 'Reptiles',
				},
			],
			{},
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('especes', null, {});
	},
};
