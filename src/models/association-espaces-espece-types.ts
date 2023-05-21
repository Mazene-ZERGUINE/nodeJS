import { EspacesModel } from './espaces.model';
import { EspaceTypesModel } from './espace-types.model';

EspaceTypesModel.hasMany(EspacesModel, {
	foreignKey: 'id_espace_types',
});

EspacesModel.belongsTo(EspaceTypesModel, {
	foreignKey: 'id_espace_types',
});
