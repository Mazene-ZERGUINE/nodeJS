import { Router } from 'express';

import { AnimauxController } from '../controllers/animaux.controller';

const router = Router();
router.get('/', AnimauxController.getAll).post('/', AnimauxController.create);

export default router;
