'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('comptes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nom: {
        type: Sequelize.STRING
      },
      prenom: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      mot_de_pass: {
        type: Sequelize.STRING,
        allowNull: false
      },
      a_badge: {
        type: Sequelize.BOOLEAN
      },
      est_admin: {
        type: Sequelize.BOOLEAN
      },
      est_employée: {
        type: Sequelize.BOOLEAN
      },
      id_post: {
        type: Sequelize.ARRAY(Sequelize.JSONB),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('comptes');
  }
};