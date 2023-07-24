import { redirect } from '@sveltejs/kit';
import { parse } from 'cookie';
import { db } from '$lib/db';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, cookies }) => {
		const sessionId = parse(request.headers.get('cookie') || '').sessionId;

		await db.raw(
			`
DELETE
FROM		Session
WHERE		id = :sessionId
		`,
			{ sessionId }
		);

		cookies.delete('sessionId');

		throw redirect(303, '/');
	}
};
