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
					id_especes: 1,
				},
				{
					nom: 'Garfield',
					sexe: true,
					date_de_naissance: new Date('1999-11-30'),
					id_especes: 1,
				},
				{
					nom: 'Tata',
					sexe: false,
					date_de_naissance: null,
					id_especes: 3,
				},
			],
			{},
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('animaux', null, {});
	},
};
