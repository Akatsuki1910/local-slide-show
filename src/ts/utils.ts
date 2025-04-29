export const WEB_URL = 'http://localhost:8080';

export const getImage = (image: string) => {
	return `${WEB_URL}/api/images/${image}`;
};
