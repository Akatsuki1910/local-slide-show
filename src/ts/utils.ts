const WEB_URL = 'http://localhost:8080';
export const API_URL = `${WEB_URL}/api`;

export const getImage = (image: string) => {
	return `${API_URL}/images/${image}`;
};
