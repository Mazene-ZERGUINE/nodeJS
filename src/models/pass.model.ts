import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../database/dbConnexion';

export class Pass extends Model {
	pass_id!: number;
	nom!: string;
}

export enum Passes {
	DAYPASS = 'Passe journée',
	WEEKEDNPASS = 'Passe week-end',
	YEARPASS = 'Pass annuel',
	MONTHPASS = '1 jour par mois pass',
}

export const PassModel = sequelize.define(
	'pass',
	{
		pass_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		nom: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		updatedAt: false,
		createdAt: false,
		timestamps: false,
	},
);
