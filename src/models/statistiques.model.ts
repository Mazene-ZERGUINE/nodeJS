import { DataTypes } from 'sequelize';
import sequelize from '../database/dbConnexion';
import { Ticket } from './ticket.model';

export class Statistiques {
	id!: number;
	date!: Date;
	ticket!: Ticket;
}

export const StatistiquesModel = sequelize.define(
	'statestiques',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},

		date: {
			type: DataTypes.DATE,
			allowNull: false,
		},

		ticket_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		espace_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		createdAt: false,
		updatedAt: false,
		timestamps: false,
	},
);
