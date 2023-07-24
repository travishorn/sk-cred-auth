import { parse } from 'cookie';
import { db } from '$lib/db.js';

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
AND     s.expires > strftime('%s', 'now')
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
