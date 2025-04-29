const WEB_URL = 'http://localhost:8080';
export const API_URL = () => `${window.location.origin}/api`;

export const getImage = (image: string) => {
	return `${API_URL()}/images/${image}`;
};
