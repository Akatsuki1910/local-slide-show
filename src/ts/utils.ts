const WEB_URL = 'http://localhost:8080';
export const API_URL = () => `${window.location.origin}/api`;

export const getImage = (image: string) => {
	return `${API_URL()}/images/${image}`;
};

export const getApiTextData = async (url: string): Promise<string[]> => {
	const response = await fetch(`${API_URL()}/${url}`);
	if (!response.ok) {
		console.error('Error fetching data:', response.statusText);
		return [];
	}
	const data = await response.json();
	return data?.text?.split(',') || [];
};
