import sequelize from '../database/dbConnexion';
import { DataTypes } from 'sequelize';

export const EspecesModel = sequelize.define(
	'especes',
	{
		id_especes: {
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
	},
	{
		timestamps: false,
		freezeTableName: true,
	},
);
