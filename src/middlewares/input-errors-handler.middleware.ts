import { isEmpty } from 'lodash';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export function handleInputErrors(req: Request, res: Response, next: NextFunction): void {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(400).json({ errors: errors.array() });
		return;
	}

	next();
}

export function emptyBodyError(req: Request, res: Response, next: NextFunction): void {
	if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
		if (isEmpty(req.body)) {
			res.status(400).send({ message: 'bad request' });
			return;
		}
	}

	if (req.method === 'DELETE' || req.method === 'PATCH' || req.method === 'PUT') {
		console.log(req.params.account_id);
		if (isEmpty(req.params)) {
			res.status(400).send({ message: 'bad request' });
			return;
		}
	}
	next();
}
