import sequelize from '../database/dbConnexion';
import { DataTypes } from 'sequelize';
import { EspaceTypesModel } from './espace-types.model';
import { EspecesModel } from './especes.model';

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
	},
	{
		timestamps: false,
		freezeTableName: true,
	},
);

EspacesModel.hasOne(EspaceTypesModel, {
	foreignKey: 'id_espace_types',
});

EspaceTypesModel.belongsTo(EspacesModel, {
	foreignKey: 'id_espace_types',
});
