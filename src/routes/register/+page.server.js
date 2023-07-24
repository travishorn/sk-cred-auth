import { fail } from '@sveltejs/kit';
import { db } from '$lib/db';
import { SqliteError } from 'better-sqlite3';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const formData = {
			email: form.get('email'),
			password: form.get('password'),
			confirmPassword: form.get('confirmPassword')
		};

		if (formData.password !== formData.confirmPassword) {
			return fail(400, {
				success: false,
				error: 'The passwords you entered do not match',
				data: formData
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
					email: formData.email,
					password: formData.password
				}
			);
		} catch (error) {
			if (error instanceof SqliteError) {
				if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
					return fail(400, {
						success: false,
						error: 'That email address is already registered.',
						data: formData
					});
				} else {
					return fail(500, {
						success: false,
						error: error.code,
						data: formData
					});
				}
			} else {
				return fail(500, {
					success: false,
					error: 'Something went wrong. Please try again later.',
					data: formData
				});
			}
		}

		return { success: true };
	}
};
