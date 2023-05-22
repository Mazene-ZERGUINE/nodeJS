import { AnimauxModel } from './animaux.model';
import { SuiviCarnetsModel } from './suivi-carnets.model';

AnimauxModel.hasOne(SuiviCarnetsModel, {
	foreignKey: 'id_animaux',
});

SuiviCarnetsModel.belongsTo(AnimauxModel, {
	foreignKey: 'id_animaux',
});
