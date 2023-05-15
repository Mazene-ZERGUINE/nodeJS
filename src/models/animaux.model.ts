import sequelize from '../database/dbConnexion';
import { DataTypes } from 'sequelize';

export enum NomValidation {
	min = 1,
	max = 100,
}

export const AnimauxModel = sequelize.define(
	'animaux',
	{
		id_animaux: {
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
				len: [NomValidation.min, NomValidation.max],
			},
		},
		sexe: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		date_de_naissance: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		timestamps: false,
		freezeTableName: true,
	},
);
