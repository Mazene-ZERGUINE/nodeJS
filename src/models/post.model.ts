import { Model } from 'sequelize-typescript';
import sequelize from '../database/dbConnexion';
import { DataTypes } from 'sequelize';

export class Post extends Model {
	id_post!: number;
	nom!: string;
}

export const PostModel = sequelize.define(
	'posts',
	{
		id_post: {
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
		createdAt: false,
		updatedAt: false,
		timestamps: false,
		freezeTableName: true,
	},
);
