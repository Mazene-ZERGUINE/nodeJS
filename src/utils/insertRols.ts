import { PostModel } from '../models/post.model';
import { Roles } from '../models/roles.enum';

export async function insertPostes(): Promise<void> {
	const posts: Roles[] = [
		Roles.ADMIN,
		Roles.VISITOR,
		Roles.VET,
		Roles.DESK,
		Roles.CAREARE,
		Roles.MANTAINER,
		Roles.SELLER,
	];

	try {
		const postesExist: boolean = (await PostModel.findAll()).length > 0;
		if (postesExist) {
			return;
		}

		for (const post of posts) {
			await PostModel.create({ nom: post });
		}
	} catch (error) {
		console.log('error ocuried while inserting roles : ', error);
	}
}
