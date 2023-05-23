import { DataTypes, INTEGER, Model } from 'sequelize';
import sequelize from '../database/dbConnexion';

export class Ticket extends Model {
	tikectID!: number;
	passId!: number;
	allowedSpaces!: number[];
	isUsed!: boolean;
	currentSpace!: number;
	isEnterd!: boolean;
	isExited!: boolean;
}

export const TicketModel = sequelize.define(
	'billet',
	{
		ticket_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},

		is_used: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		allowed_spaces: {
			type: DataTypes.ARRAY(INTEGER),
			allowNull: false,
		},
		date: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		pass_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		current_space: {
			type: DataTypes.INTEGER,
			defaultValue: null,
		},
		isEnterd: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},

		isExited: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		createdAt: false,
		updatedAt: false,
		timestamps: false,
	},
);
