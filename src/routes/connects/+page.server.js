export const load = async ({ parent }) => {
	const { response } = await parent();

	return response;
};
