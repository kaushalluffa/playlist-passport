import { error, redirect } from '@sveltejs/kit';
import { SPOTIFY_APP_CLIENT_ID, SPOTIFY_APP_CLIENT_SECRET, BASE_URL } from '$env/static/private';

export const GET = async ({ url, cookies }) => {
	const code = url?.searchParams?.get('code') || null;
	const state = url?.searchParams?.get('state') || null;
	const storedSate = cookies.get('spotify_auth_state') || null;
	const storedChallengeVerifier = cookies.get('spotify_auth_challenge_verify') || null;
	if (state === null || state !== storedSate) {
		throw error(400, 'State mismatch');
	}
	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${Buffer.from(`${SPOTIFY_APP_CLIENT_ID}:${SPOTIFY_APP_CLIENT_SECRET}`).toString('base64')}`
		},
		body: new URLSearchParams({
			grant_type: 'authorization_code',
			code: code || '',
			redirect_uri: `${BASE_URL}/api/connects/spotify/callback`,
			client_id: SPOTIFY_APP_CLIENT_ID,
			code_verifier: storedChallengeVerifier || ''
		})
	});
	const data = await response.json();
	if (data?.error) {
		throw error(400, data?.error_description || data?.error);
	}
	cookies.delete('spotify_auth_state', { path: '/' });
	cookies.delete('spotify_auth_challenge_verify', { path: '/' });
	cookies.set('spotify_refresh_token', data?.refresh_token, { path: '/' });
	cookies.set('spotify_access_token', data?.access_token, { path: '/' });

	throw redirect(303, '/');
};
