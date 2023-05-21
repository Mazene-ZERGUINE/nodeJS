import { DataTypes } from 'sequelize';

import { EspecesModel } from './especes.model';
import { EspacesModel } from './espaces.model';
import sequelize from '../database/dbConnexion';

export const EspacesEspecesModel = sequelize.define(
	'espaces_especes',
	{
		id_espaces: {
			type: DataTypes.INTEGER,
			references: {
				model: EspacesModel,
				key: 'id_espaces',
			},
		},
		id_especes: {
			type: DataTypes.INTEGER,
			references: {
				model: EspecesModel,
				key: 'id_especes',
			},
		},
	},
	{
		timestamps: false,
		freezeTableName: true,
	},
);

EspacesModel.belongsToMany(EspecesModel, {
	through: EspacesEspecesModel,
	foreignKey: 'id_espaces',
	otherKey: 'id_especes',
});

EspecesModel.belongsToMany(EspacesModel, {
	through: EspacesEspecesModel,
	foreignKey: 'id_especes',
	otherKey: 'id_espaces',
});
