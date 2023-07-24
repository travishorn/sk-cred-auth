import { parse } from 'cookie';
import knex from 'knex';
import knexfile from '../knexfile.js';

const db = knex(knexfile[process.env.NODE_ENV || 'development']);

export const handle = async ({ event, resolve }) => {
	const sessionId = parse(event.request.headers.get('cookie') || '').sessionId;

	if (sessionId) {
		const dbUsers = await db.raw(
			`
SELECT	u.email
FROM		Session s
JOIN		User u
ON			u.email = s.userEmail
WHERE		s.id = :sessionId
LIMIT		1
		`,
			{ sessionId }
		);

		if (dbUsers.length === 1) {
			event.locals.user = dbUsers[0];
		}
	}

	const response = await resolve(event);
	return response;
};
