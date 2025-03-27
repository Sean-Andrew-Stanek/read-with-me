const createStory = async (prompt: string): Promise<string> => {
    const response = await fetch('/api/create-story', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate story.');
    }

    const data = await response.json();
    return data.story;
};
export { createStory };
