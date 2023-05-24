import sequelize from '../database/dbConnexion';
import { DataTypes, JSONB } from 'sequelize';
import { AnimauxModel } from './animaux.model';
import { EspacesModel } from './espaces.model';

export enum NomValidation {
	min = 1,
	max = 100,
}

export const EspecesModel = sequelize.define(
	'especes',
	{
		id_especes: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		nom: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				notEmpty: true,
				len: [1, 100],
			},
		},
		id_espaces: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},

	{
		timestamps: false,
		freezeTableName: true,
	},
);

AnimauxModel.belongsTo(EspecesModel, {
	foreignKey: 'id_especes',
	as: 'animaux',
});

EspecesModel.hasMany(AnimauxModel, {
	foreignKey: 'id_especes',
	as: 'animaux',
});

EspecesModel.belongsTo(EspacesModel, {
	foreignKey: 'id_espaces',
	as: 'spaces',
});

EspacesModel.hasMany(EspecesModel, {
	foreignKey: 'id_espaces',
	as: 'spaces',
});
