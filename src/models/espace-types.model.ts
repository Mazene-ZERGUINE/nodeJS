import sequelize from '../database/dbConnexion';
import { DataTypes } from 'sequelize';

export enum NomValidation {
	min = 1,
	max = 100,
}

export const EspaceTypesModel = sequelize.define(
	'espace_types',
	{
		id_espace_types: {
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
	},
	{
		timestamps: false,
		freezeTableName: true,
	},
);
