import { fail } from '@sveltejs/kit';
import { db } from '$lib/db';
import { SqliteError } from 'better-sqlite3';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const email = form.get('email');
		const password = form.get('password');
		const confirmPassword = form.get('confirmPassword');

		if (password !== confirmPassword) {
			return fail(400, {
				success: false,
				error: 'The passwords you entered do not match',
				data: {
					email,
					password,
					confirmPassword
				}
			});
		}

		try {
			await db.raw(
				`
	INSERT INTO	User (
		'email',
		'password'
	) VALUES (
		:email,
		:password
	)
			`,
				{
					email,
					password
				}
			);
		} catch (error) {
			if (error instanceof SqliteError && error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
				return fail(400, {
					success: false,
					error: 'That email address is already registered.',
					data: {
						email,
						password,
						confirmPassword
					}
				});
			}
		}

		return { success: true };
	}
};
