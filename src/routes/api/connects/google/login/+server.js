import { redirect } from '@sveltejs/kit';
import { GOOGLE_APP_CLIENT_ID, BASE_URL } from '$env/static/private';

const generateRandomString = (length) => {
	let randomString = '';
	const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		randomString += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
	}
	return randomString;
};
const scope = [
	'https://www.googleapis.com/auth/userinfo.email',
	'https://www.googleapis.com/auth/userinfo.profile',
	'https://www.googleapis.com/auth/youtube',
	'https://www.googleapis.com/auth/youtube.force-ssl'
].join(' ');
const state = generateRandomString(16);

export const GET = async ({ cookies }) => {
	cookies.set('google_auth_state', state, { path: '/' });

	throw redirect(
		307,
		`https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({ access_type: 'offline', response_type: 'code', client_id: GOOGLE_APP_CLIENT_ID, scope, redirect_uri: `${BASE_URL}/api/connects/google/callback`, state, approval_prompt: 'force' })}`
	);
};
