import { SuiviCarnetsModel } from './suivi-carnets.model';
import { AccountsModel } from './accounts.model';

AccountsModel.hasOne(SuiviCarnetsModel, {
	foreignKey: 'id',
});

SuiviCarnetsModel.belongsTo(AccountsModel, {
	foreignKey: 'id',
});
