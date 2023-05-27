import { Model } from 'sequelize-typescript';
import sequelize from '../database/dbConnexion';
import { DataTypes } from 'sequelize';
import { PostModel } from './post.model';
import { SuiviCarnetsModel } from './suivi-carnets.model';
import { EntretienCarnetsModel } from './entretien-carnets.model';

export default class Accounts extends Model {
	id!: number;
	nom!: string;
	prenom!: string;
	email!: string;
	mot_de_pass!: string;
	a_badge!: boolean;
	est_admin!: boolean;
	est_employee!: boolean;
	id_post!: number;
}

export const AccountsModel = sequelize.define(
	'comptes',
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
	},
	{
		createdAt: false,
		updatedAt: false,
		timestamps: false,
	},
);

//#region association accounts & posts
AccountsModel.belongsTo(PostModel, {
	foreignKey: 'id_post',
});

PostModel.hasMany(AccountsModel, {
	foreignKey: 'id_post',
});
//#endregion

//#region association accounts & suivi-carnets
SuiviCarnetsModel.belongsTo(AccountsModel, {
	foreignKey: 'id',
});

AccountsModel.hasMany(SuiviCarnetsModel, {
	foreignKey: 'id',
});
//#endregion

//#region association accounts & entretien-carnets
EntretienCarnetsModel.belongsTo(AccountsModel, {
	foreignKey: 'id',
});

AccountsModel.hasMany(EntretienCarnetsModel, {
	foreignKey: 'id',
});
//#endregion
