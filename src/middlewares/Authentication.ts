import { NextFunction, Request, Response } from 'express';

import { SessionsModel } from '../models/sessions.model';
import { Roles } from '../models/roles.enum';
import { PostModel } from '../models/post.model';

export async function isAuthenticated(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const userToken: string | undefined = req.headers.authorization?.split(' ')[1];

		if (!userToken) {
			res.status(401).send({ message: 'user not authenticated' }).end();
			return;
		}

		const user = await SessionsModel.findOne({
			where: {
				token: userToken,
			},
		});

		if (!user) {
			res.status(401).send({ message: 'user not authenticated' });
			return;
		}

		next();
	} catch (error) {
		res.status(501).send('internal server error').end();
	}
}

export async function isEmploye(req: Request, res: Response, next: NextFunction): Promise<void> {
	const userToken: string | undefined = req.headers.authorization?.split(' ')[1];

	try {
		const user = await SessionsModel.findOne({
			where: {
				token: userToken,
			},
		});

		const isEmploye: boolean = user?.getDataValue('account').est_employee;
		if (!isEmploye) {
			res.status(403).send({ message: 'forbidden' }).end();
			return;
		}
		next();
	} catch (error) {
		res.status(501).send('internal server error').end();
	}
}

export const checkUserRole = (requiredRole: Roles) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const userToken: string | undefined = req.headers.authorization?.split(' ')[1];

		try {
			const session = await SessionsModel.findOne({ where: { token: userToken } });
			if (!session) {
				res.status(403).json({ message: 'session' }).end();
				return;
			}

			const sessionPostId = session.getDataValue('account').id_post;
			const poste = await PostModel.findOne({ where: { id_post: sessionPostId } });
			if (!poste) {
				res.status(403).json({ message: 'poste' }).end();
				return;
			}

			const hasRequiredRole = poste.getDataValue('nom') === requiredRole;
			if (!hasRequiredRole) {
				res.status(403).end();
				return;
			}

			next();
		} catch (error) {
			res
				.status(501)
				.send('internal server error' + error)
				.end();
		}
	};
};

export async function isAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
	const token: string | undefined = req.headers.authorization?.split(' ')[1];
	if (!token) {
		res.status(403).send({ message: 'forbidden' });
		return;
	}

	try {
		const session = await SessionsModel.findOne({ where: { token } });
		if (!session?.getDataValue('account').est_admin) {
			res.status(403).send({ message: 'forbidden' });
			return;
		}

		next();
	} catch (error) {
		res.status(501).send('internal server error');
	}
}
