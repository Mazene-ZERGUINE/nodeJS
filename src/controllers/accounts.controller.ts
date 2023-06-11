import { Post } from './../models/post.model';
import { Request, Response } from 'express';
import Accounts, { AccountsModel } from '../models/accounts.model';
import { SecurityUtils } from '../utils/securityUtiles';
import { Model, and } from 'sequelize';
import jwt from 'jsonwebtoken';
import { SessionsModel } from '../models/sessions.model';
import { PostModel } from '../models/post.model';
import { SuiviCarnetsModel } from '../models/suivi-carnets.model';
import { EntretienCarnetsModel } from '../models/entretien-carnets.model';

export default class AccountsController {
	constructor() {}

	async create(req: Request, res: Response): Promise<void> {
		if (!req.body) {
			res.status(400).send({ message: 'bad request' }).end();
			return;
		}

		const { nom, prenom, email, mot_de_pass, a_badge, est_admin, est_employee, id_post } = req.body;

		try {
			const exist = await AccountsModel.findOne({
				where: { email: email },
			});

			if (exist) {
				res.status(400).send({ message: 'email already exists' });
				return;
			}

			if (!nom || nom.trim().length === 0 || !prenom || prenom.trim().length === 0) {
				res.status(400).send({ message: 'properties nom and prenom can not be empty strings' });
				return;
			}

			const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				res.status(400).send({ message: 'bad email' });
				return;
			}

			if (typeof a_badge !== 'boolean' || typeof est_admin !== 'boolean' || typeof est_employee !== 'boolean') {
				res.status(400).send({ message: 'bad types for est_admin or est_employee or a_badge' });
				return;
			}

			const security: SecurityUtils = new SecurityUtils();
			const hash: string = await security.argon2Hash(mot_de_pass);

			const newAccount = await AccountsModel.create({
				nom: nom,
				prenom: prenom,
				email: email,
				mot_de_pass: hash,
				a_badge: a_badge,
				est_admin: est_admin,
				est_employee: est_employee,
				id_post: id_post,
			});

			res.status(201).json(newAccount);
		} catch (error) {
			res.status(501).send({ message: 'internal server error' }).end();
			console.log(`error while creating new account `, error);
		}
	}

	async update(req: Request, res: Response): Promise<void> {
		const accountId: number = parseInt(req.params.account_id);

		if (!accountId || typeof accountId !== 'number') {
			res.status(400).send({ message: 'Bad request' }).end();
			return;
		}

		if (!req.body) {
			res.status(400).send({ message: 'Bad request' }).end();
			return;
		}

		const { nom, prenom, email, mot_de_pass, a_badge, est_admin, est_employee, id_post } = req.body;

		try {
			const account = await AccountsModel.findOne({
				where: { id: accountId },
			});

			if (!account) {
				res.status(404).send({ message: 'account not found' }).end();
				return;
			}

			if (nom) {
				account.set({ nom: nom });
			}
			if (prenom) {
				account.set({ prenom: prenom });
			}
			if (email) {
				account.set({ email: email });
			}
			if (mot_de_pass) {
				const security: SecurityUtils = new SecurityUtils();
				const hash: string = await security.argon2Hash(mot_de_pass);
				account.set({ mot_de_pass: hash });
			}
			if (a_badge) {
				account.set({ a_badge: a_badge });
			}
			if (est_admin) {
				account.set({ est_admin: est_admin });
			}
			if (est_employee) {
				account.set({ est_employee: est_employee });
			}
			if (id_post) {
				account.set({ id_post });
			}

			await account.save();
			res.status(200).send({ message: 'account updated', account: account }).end();
		} catch (error) {
			console.log(error);
			res.status(501).send({ message: 'internal server error', error: error });
		}
	}

	async delete(req: Request, res: Response): Promise<void> {
		const accountId: number = parseInt(req.params.account_id);

		if (!accountId || typeof accountId !== 'number') {
			res.status(400).send({ message: 'Bad request' }).end();
			return;
		}

		try {
			const account = await AccountsModel.findOne({
				where: { id: accountId },
			});
			if (!account) {
				res.status(404).send({ message: 'account not found' }).end();
				return;
			}

			await account.destroy();
			res.status(200).send({ message: 'account deleted' }).end();
		} catch (error) {
			res.status(500).send({ message: 'internal server error' }).end();
		}
	}

	async getOne(req: Request, res: Response): Promise<void> {
		const accountId: number = parseInt(req.params.account_id);

		if (!accountId || typeof accountId !== 'number') {
			res.status(400).send({ message: 'Bad request' }).end();
			return;
		}

		try {
			const account = await AccountsModel.findOne({
				where: { id: accountId },
				include: [
					{
						model: PostModel,
						attributes: { exclude: ['id_post'] },
					},
					{
						model: SuiviCarnetsModel,
						attributes: { exclude: ['id_suivi_carnets'] },
					},
				],
			});

			if (!account) {
				res.status(404).send({ message: 'account not found' }).end();
			}

			res.status(200).json(account).end();
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'internal server error' }).end();
		}
	}

	async getAll(req: Request, res: Response): Promise<void> {
		try {
			const accounts = await AccountsModel.findAll({
				attributes: { exclude: ['id'] },
				limit: 1_000,
				include: [
					{
						model: PostModel,
						attributes: { exclude: ['id_post'] },
					},
					{
						model: SuiviCarnetsModel,
						attributes: { exclude: ['id_suivi_carnets'] },
					},
					{
						model: EntretienCarnetsModel,
						attributes: { exclude: ['id_entretien_carnets'] },
					},
				],
			});

			res.status(200).json(accounts);
		} catch (e) {
			console.log(e);
			res.status(500).json({ message: 'internal server error' });
		}
	}

	async logIn(req: Request, res: Response): Promise<void> {
		const { email, password } = req.body;

		try {
			const user = await AccountsModel.findOne({ where: { email } });
			if (!user) {
				res.status(404).send({ message: 'account does not exist' });
				return;
			}

			const hashedPassword: string = user.getDataValue('mot_de_pass');
			const security: SecurityUtils = new SecurityUtils();
			const match: boolean = await security.verify(password, hashedPassword);

			if (!match) {
				res.status(400).send({ message: 'wrong password' }).end();
				return;
			}
			const apiKey = process.env.API_KEY as string;
			const token: string = jwt.sign({ ...user }, apiKey);

			await SessionsModel.create({
				token: token,
				account: user,
			});
			res.status(200).send({ message: 'you are connected', token: token });
		} catch (error) {
			res.status(501).send('internal server error').end();
			console.log(error);
		}
	}

	async logout(req: Request, res: Response): Promise<void> {
		const token: string | undefined = req.headers.authorization?.split(' ')[1];

		try {
			const userSessions = await SessionsModel.findOne({ where: { token } });
			if (!userSessions) {
				res.status(501).send({ message: 'bad request' });
				return;
			}

			await userSessions.destroy();
			res.status(200).send({ message: 'user disconnected' });
		} catch (error) {
			res.status(501).send('internal server error').end();
		}
	}
}
