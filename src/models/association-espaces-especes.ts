import { EspecesModel } from './especes.model';
import { EspacesModel } from './espaces.model';

EspecesModel.hasMany(EspacesModel, {
	foreignKey: 'id_especes',
});

EspacesModel.belongsTo(EspecesModel, {
	foreignKey: 'id_especes',
});
