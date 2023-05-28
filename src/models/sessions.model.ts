import { Model, DataType, AllowNull } from 'sequelize-typescript';
import sequelize from '../database/dbConnexion';
import { DataTypes } from 'sequelize';

export class Sessions extends Model {
	id_post!: number;
	nom!: string;
}

export const SessionsModel = sequelize.define(
	'sessions',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		token: {
			type: DataTypes.TEXT,
			unique: true,
		},
		account: {
			type: DataTypes.JSONB,
			allowNull: false,
		},
	},
	{
		createdAt: false,
		updatedAt: false,
		timestamps: false,
	},
);
