import { SPOTIFY_BASE_URL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
export const load = async ({ cookies, fetch, url }) => {
	const spotifyAccessToken = cookies.get('spotify_access_token');
	const spotifyRefreshToken = cookies.get('spotify_refresh_token');
	const googleAccessToken = cookies.get('google_access_token');
	const googleRefreshToken = cookies.get('google_refresh_token');
	let connectionData = {
		spotify: { connected: false, display_name: '' },
		ytMusic: { connected: false, display_name: '' }
	};
	const spotifyProfileResponse = spotifyAccessToken
		? await fetch(`${SPOTIFY_BASE_URL}/me`, {
				headers: {
					Authorization: `Bearer ${spotifyAccessToken}`
				}
			})
		: null;
	const googleProfileResponse = googleAccessToken
		? await fetch(`https://www.googleapis.com/userinfo/v2/me`, {
				headers: {
					Authorization: `Bearer ${googleAccessToken}`
				}
			})
		: null;

	if (googleProfileResponse?.ok && !spotifyProfileResponse?.ok) {
		const googleProfile = await googleProfileResponse.json();
		connectionData.ytMusic.connected = true;
		connectionData.ytMusic.display_name =
			googleProfile?.name ?? `${googleProfile?.given_name} ${googleProfile?.family_name}`;
		connectionData.spotify.connected = false;
		connectionData.spotify.display_name = '';
	}
	if (spotifyProfileResponse?.ok && !googleProfileResponse?.ok) {
		const spotifyProfile = await spotifyProfileResponse.json();
		connectionData.spotify.connected = true;
		connectionData.spotify.display_name = spotifyProfile?.display_name;
		connectionData.ytMusic.connected = false;
		connectionData.ytMusic.display_name = '';
	}
	if (spotifyProfileResponse?.ok && googleProfileResponse?.ok) {
		const googleProfile = await googleProfileResponse.json();
		const spotifyProfile = await spotifyProfileResponse.json();
		connectionData.spotify.connected = true;
		connectionData.spotify.display_name = spotifyProfile?.display_name;
		connectionData.ytMusic.connected = true;
		connectionData.ytMusic.display_name =
			googleProfile?.name ?? `${googleProfile?.given_name} ${googleProfile?.family_name}`;
	}
	if (spotifyProfileResponse?.status === 401 && spotifyRefreshToken) {
		const spotifyRefreshResponse = await fetch('/api/connects/spotify/refresh');
		if (spotifyRefreshResponse?.ok) {
			throw redirect(307, url?.pathname);
		}
	}
	if (googleProfileResponse?.status === 401 && googleRefreshToken) {
		const googleRefreshResponse = await fetch('/api/connects/google/refresh');
		if (googleRefreshResponse?.ok) {
			throw redirect(307, url?.pathname);
		}
	}

	return connectionData;
};
