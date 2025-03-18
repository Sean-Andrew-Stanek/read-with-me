/* eslint-disable no-console */

export const postLogin = async (): Promise<void> => {
    try {
        const response = fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(response);
    } catch (error) {
        console.error(error);
    }
};
