import sequelize from '../database/dbConnexion';
import { DataTypes } from 'sequelize';

export enum EtatValidation {
	lost = 'perdu',
	dead = 'mort',
	sick = 'malade',
	bad = 'mauvais',
	good = 'bon',
}

export const SuiviCarnetsModel = sequelize.define(
	'suivi_carnets',
	{
		id_suivi_carnets: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		etat: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
				isIn: [['perdu', 'mort', 'malade', 'mauvais', 'bon']],
			},
		},
		description_sante: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		poids: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		taille: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		date_de_naissance: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		date_de_diagnostic: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		id_animaux: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		timestamps: false,
		freezeTableName: true,
	},
);
