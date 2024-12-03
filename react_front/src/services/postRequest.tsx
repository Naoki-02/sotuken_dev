import axios from 'axios';

export const postRequest = async (url: string, data: any, token: string | null) => {
    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Token ${token}` : '',
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error in postRequest:', error);
        throw error;
    }
};