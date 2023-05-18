import { NextFunction, Request, Response } from 'express';
import { SessionsModel } from '../models/sessions.model';

export async function isAuthenticated(req: Request, res: Response, next: NextFunction): Promise<void> {
	const userToken: string | undefined = req.headers.authorization?.split(' ')[1];

	try {
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
	} catch (error) {
		res.status(501).send('internal server error').end();
	}

	next();
}
