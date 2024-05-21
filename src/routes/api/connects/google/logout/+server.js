import { json, redirect } from '@sveltejs/kit';

export const POST = async ({ cookies, request }) => {
	await fetch(`https://oauth2.googleapis.com/revoke?token=${cookies?.get('google_access_token')}`);
	cookies.delete('google_refresh_token', { path: '/' });
	cookies.delete('google_access_token', { path: '/' });
	if (request?.headers?.get('accept') === 'application/json') {
		return json({ success: true });
	}
	throw redirect(303, '/');
};
