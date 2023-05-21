import { Request, Response } from 'express';
import Accounts, { AccountsModel } from '../models/accounts.model';
import { Roles } from '../models/roles.enum';
import { Model } from 'sequelize';
import { tr } from 'date-fns/locale';

export class ManegementController {
	constructor() {}

	async openZoo(req: Request, res: Response): Promise<void> {
		const employes: Accounts[] = req.body;

		// checking employes number //
		if (employes.length < 5) {
			res.status(400).send({ message: 'bad request', error: 'at least 5 employees are required to open the parc' });
			return;
		}
		// checking if accounts belonge to employées
		let notAllEmployes: boolean = false;
		employes.map((employe: Accounts): void => {
			if (!employe.est_employee) {
				notAllEmployes = true;
			}
		});
		if (notAllEmployes) {
			res.status(400).send({ message: 'bad request', error: 'only employees are required to open the parc' });
			return;
		}
		// checking required jobs
		const hasSeller: boolean = employes.some((employe) => employe.id_post.nom === Roles.SELLER);
		const hasVet: boolean = employes.some((employe) => employe.id_post.nom === Roles.VET);
		const hasDesk: boolean = employes.some((employe) => employe.id_post.nom === Roles.DESK);
		const hasMantainer: boolean = employes.some((employe) => employe.id_post.nom === Roles.MANTAINER);
		const hasCarrer: boolean = employes.some((employe) => employe.id_post.nom === Roles.CAREARE);

		if (!hasDesk || !hasSeller || !hasVet || !hasCarrer || !hasMantainer) {
			res.status(400).send({
				message: 'bad request',
				error:
					'at least one seller one desk guy and one vet are one mantainer and one careare required to open the zoo',
			});
			return;
		}

		//checking if accounts are registerd
		let accountNotRegisterd: boolean = false;
		employes.forEach(async (employe: Accounts) => {
			try {
				const account: Model<Accounts> | null = await AccountsModel.findOne({
					where: {
						email: employe.email,
					},
				});
				if (!account) {
					accountNotRegisterd = false;
				}
			} catch (error) {
				res.status(501).send('internal server error').end();
				return;
			}
		});

		if (!accountNotRegisterd) {
			res.status(400).send({ message: 'bad request', error: 'one or many employes are not registerd' }).end();
			return;
		}

		res.status(200).send({ message: 'zoo can be opend' });
	}
}
