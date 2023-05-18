import { AnimauxModel } from './animaux.model';
import { EspecesModel } from './especes.model';

EspecesModel.hasMany(AnimauxModel, {
	foreignKey: 'id_especes',
});

AnimauxModel.belongsTo(EspecesModel, {
	foreignKey: 'id_especes',
});
