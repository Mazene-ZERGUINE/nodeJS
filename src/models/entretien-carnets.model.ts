import sequelize from '../database/dbConnexion';
import { DataTypes } from 'sequelize';

export enum NomValidation {
	min = 1,
	max = 100,
}

export enum EntretienType {
	cleaning = 'nettoyage',
	renovation = 'rénovation',
	repairs = 'réparation',
}

export const EntretienCarnetsModel = sequelize.define(
	'entretien_carnets',
	{
		id_entretien_carnets: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		nom: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
			validate: {
				notEmpty: true,
				len: [NomValidation.min, NomValidation.max],
			},
		},
		type: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
				isIn: [[EntretienType.cleaning, EntretienType.renovation, EntretienType.repairs]],
			},
		},
		date_debut: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		date_fin: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	},
	{
		timestamps: false,
		freezeTableName: true,
	},
);
