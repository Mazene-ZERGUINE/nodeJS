import { Pass, PassModel } from './../models/pass.model';
import { Passes } from '../models/pass.model';
import { Post, PostModel } from '../models/post.model';

export async function insertPostes(): Promise<void> {
	const postArray: string[] = ['ADMIN', 'VISITEUR', 'VETERINAIRE', 'ACCUEIL', 'SOINGEUR', 'ENTRETIEN', 'VENDEUR'];

	const check = await PostModel.findAll();
	if (check.length > 0) {
		return;
	}

	try {
		postArray.forEach(async (post: string) => {
			const newPost = await PostModel.create({
				nom: post,
			});
			console.log(newPost.toJSON());
		});
	} catch (error) {
		console.log('error ocuried while inserting roles : ', error);
	}
}

export async function insertPasses(): Promise<void> {
	const passses: string[] = [Passes.DAYPASS, Passes.MONTHPASS, Passes.WEEKEDNPASS, Passes.YEARPASS];

	const checkigng = await PassModel.findAll();
	if (checkigng.length > 0) {
		return;
	}

	try {
		passses.forEach(async (pass: string) => {
			console.log(pass);
			const createPass = await PassModel.create({
				nom: pass,
			});
			console.log(createPass);
		});
		console.log('passes loaded');
	} catch (error) {
		console.log('error while loading passes');
	}
}
