import { GOOGLE_APP_CLIENT_ID, GOOGLE_APP_CLIENT_SECRET } from '$env/static/private';
import { error, json } from '@sveltejs/kit';
export const GET = async ({ cookies }) => {
	const refreshToken = cookies.get('google_refresh_token');
	const response = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			refresh_token: refreshToken || '',
			client_id: GOOGLE_APP_CLIENT_ID,
			client_secret: GOOGLE_APP_CLIENT_SECRET,
			grant_type: 'refresh_token'
		})
	});
	const data = await response.json();
	if (data?.error) {
		cookies.delete('google_access_token', { path: '/' });
		throw error(401, data?.error_description || data?.error);
	}
	cookies.set('google_access_token', data?.access_token, { path: '/' });
	return json(data);
};
