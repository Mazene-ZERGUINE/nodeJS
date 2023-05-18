'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'espace_types',
			[
				{
					nom: 'Espace ouvert',
				},
				{
					nom: 'Espace fermé',
				},
				{
					nom: 'Espace vert',
				},
			],
			{},
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('espace_types', null, {});
	},
};
