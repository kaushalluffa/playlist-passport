import { SPOTIFY_APP_CLIENT_ID, SPOTIFY_APP_CLIENT_SECRET } from '$env/static/private';
import { error, json } from '@sveltejs/kit';
export const GET = async ({ cookies }) => {
	const refreshToken = cookies.get('spotify_refresh_token');
	const response = await fetch(`https://accounts.spotify.com/api/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${Buffer.from(`${SPOTIFY_APP_CLIENT_ID}:${SPOTIFY_APP_CLIENT_SECRET}`).toString('base64')}`
		},
		body: new URLSearchParams({
			grant_type: 'spotify_refresh_token',
			refresh_token: refreshToken || ''
		})
	});
	const data = await response.json();
	if (data?.error) {
		cookies.delete('spotify_refresh_token', { path: '/' });
		cookies.delete('spotify_access_token', { path: '/' });
		throw error(401, data?.error_description || data?.error);
	}
	cookies.set('spotify_access_token', data?.access_token, { path: '/' });
	cookies.set('spotify_refresh_token', data?.refresh_token, { path: '/' });
	return json(data);
};
