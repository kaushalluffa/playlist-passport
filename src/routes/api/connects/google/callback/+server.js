import { error, redirect } from '@sveltejs/kit';
import { GOOGLE_APP_CLIENT_ID, GOOGLE_APP_CLIENT_SECRET, BASE_URL } from '$env/static/private';

export const GET = async ({ url, cookies }) => {
	const code = url?.searchParams?.get('code') || null;
	const state = url?.searchParams?.get('state') || null;
	const storedSate = cookies.get('google_auth_state') || null;
	if (state === null || state !== storedSate) {
		throw error(400, 'State mismatch');
	}
	const response = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'authorization_code',
			code: code || '',
			redirect_uri: `${BASE_URL}/api/connects/google/callback`,
			client_id: GOOGLE_APP_CLIENT_ID,
			client_secret: GOOGLE_APP_CLIENT_SECRET
		})
	});
	const data = await response.json();
	if (data?.error) {
		throw error(400, data?.error_description || data?.error);
	}
	cookies.delete('google_auth_state', { path: '/' });
	cookies.set('google_refresh_token', data?.refresh_token ?? data?.id_token, { path: '/' });
	cookies.set('google_access_token', data?.access_token, { path: '/' });

	throw redirect(303, '/');
};
