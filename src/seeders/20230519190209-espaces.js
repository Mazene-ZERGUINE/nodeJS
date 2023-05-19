'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'espaces',
			[
				{
					nom: 'Espace felin',
					description: null,
					image: null,
					capacite: 2,
					duree: 1,
					a_acces_handicape: true,
					est_en_entretien: false,
					taux_frequentation: null,
					id_espace_types: 1,
					id_especes: 1,
				},
				{
					nom: 'Espace oiseau',
					description: null,
					image: null,
					capacite: 10,
					duree: 1,
					a_acces_handicape: false,
					est_en_entretien: false,
					taux_frequentation: null,
					id_espace_types: 1,
					id_especes: 1,
				},
				{
					nom: 'Espace tortue',
					description: null,
					image: null,
					capacite: 2,
					duree: 1,
					a_acces_handicape: true,
					est_en_entretien: true,
					taux_frequentation: null,
					id_espace_types: 1,
					id_especes: 1,
				},
			],
			{},
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('espaces', null, {});
	},
};
