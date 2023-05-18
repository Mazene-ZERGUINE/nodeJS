import { Model, DataType, AllowNull } from 'sequelize-typescript';
import sequelize from '../database/dbConnexion';
import { DataTypes } from 'sequelize';
import { Post } from './post.model';

export default class Accounts extends Model {
	id!: number;
	nom!: string;
	prenom!: string;
	email!: string;
	mot_de_pass!: string;
	a_badge!: boolean;
	est_admin!: boolean;
	est_employee!: boolean;
	id_post!: Post;
}

export const AccountsModel = sequelize.define(
	'compts',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		nom: {
			type: DataTypes.STRING,
		},
		prenom: {
			type: DataTypes.STRING,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		mot_de_pass: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		a_badge: {
			type: DataTypes.BOOLEAN,
		},
		est_admin: {
			type: DataTypes.BOOLEAN,
		},

		est_employee: {
			type: DataTypes.BOOLEAN,
		},
		id_post: {
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
