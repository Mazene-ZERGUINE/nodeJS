import { NextFunction, Request, Response } from 'express';
import { SessionsModel } from '../models/sessions.model';
import { Roles } from '../models/roles.enum';

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
			const user = await SessionsModel.findOne({
				where: {
					token: userToken,
				},
			});

			const userRole: string | undefined = await user?.getDataValue('account').id_post.nom;
			if (userRole !== requiredRole) {
				res.status(403).send({ message: 'forbidden' }).end();
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
