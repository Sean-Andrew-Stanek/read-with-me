/* eslint-disable no-console */

export const postLogin = async (): Promise<void> => {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log('Login response:', response.status, data);
    } catch (error) {
        console.error(error);
    }
};
