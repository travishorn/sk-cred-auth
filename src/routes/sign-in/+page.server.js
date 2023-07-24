import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/db';
import { verify } from 'argon2';
import { SqliteError } from 'better-sqlite3';

const THIRTY_DAYS = 2592000000; // in milliseconds

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const formData = {
			email: form.get('email'),
			password: form.get('password')
		};

		try {
			const dbUsers = await db.raw(
				`
SELECT	u.email,
				u.passwordHash
FROM		User u
WHERE		u.email = :email
LIMIT		1
			`,
				{
					email: formData.email
				}
			);

			if (dbUsers.length !== 1) {
				return fail(400, {
					success: false,
					error: 'The email and/or password you entered are not correct.',
					data: formData
				});
			}

			if (!(await verify(dbUsers[0].passwordHash, formData.password?.toString() || ''))) {
				return fail(400, {
					success: false,
					error: 'The email and/or password you entered are not correct.',
					data: formData
				});
			}

			const sessionId = crypto.randomUUID();
			const expires = new Date(new Date().getTime() + THIRTY_DAYS);

			await db.raw(
				`
INSERT INTO	Session (
	id,
	userEmail,
	expires
) VALUES (
	:sessionId,
	:userEmail,
	:expires
)
				`,
				{
					sessionId,
					userEmail: formData.email,
					expires
				}
			);

			cookies.set('sessionId', sessionId, { expires });
		} catch (error) {
			if (error instanceof SqliteError) {
				return fail(500, {
					success: false,
					error: error.code,
					data: formData
				});
			} else {
				return fail(500, {
					success: false,
					error: 'Something went wrong. Please try again later.',
					data: formData
				});
			}
		}

		throw redirect(303, '/');
	}
};
