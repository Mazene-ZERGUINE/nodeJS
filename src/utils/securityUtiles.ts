import * as argon2 from 'argon2';

export class SecurityUtils {
	constructor() {}

	async argon2Hash(password: string): Promise<string> {
		const hash: Promise<string> = argon2.hash(password);
		return hash;
	}

	async verify(password: string, hashedPassword: string): Promise<boolean> {
		const match = argon2.verify(hashedPassword, password);
		return match;
	}
}
