'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('posts', {
			token: {
				type: Sequelize.TEXT,
				unique: true,
			},
			nom: {
				type: Sequelize.JSONB,
				allowNull: false,
			},
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('posts');
	},
};
