import sequelize from '../database/dbConnexion';
import { DataTypes } from 'sequelize';

export enum NomValidation {
	min = 1,
	max = 100,
}

export const EspacesModel = sequelize.define(
	'espaces',
	{
		id_espaces: {
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
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		image: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		capacite: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 1,
			},
		},
		duree: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 0,
			},
		},
		a_acces_handicape: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		est_en_entretien: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		taux_frequentation: {
			type: DataTypes.INTEGER,
			allowNull: true,
			validate: {
				min: 0,
			},
		},
		id_espace_types: {
			type: DataTypes.INTEGER,
			allowNull: false,
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
