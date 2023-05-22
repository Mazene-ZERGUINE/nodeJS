import sequelize from '../database/dbConnexion';
import { DataTypes } from 'sequelize';
import { EspecesModel } from './especes.model';

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
				len: [1, 100],
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
		id_especes: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		timestamps: false,
		freezeTableName: true,
	},
);
