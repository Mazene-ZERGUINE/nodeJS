'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'animaux',
			[
				{
					nom: 'Milou',
					sexe: true,
					date_de_naissance: new Date('2000-12-31'),
				},
				{
					nom: 'Garfield',
					sexe: true,
					date_de_naissance: new Date('1999-11-30'),
				},
				{
					nom: 'Tata',
					sexe: false,
					date_de_naissance: null,
				},
			],
			{},
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('animaux', null, {});
	},
};
