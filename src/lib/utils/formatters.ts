export function formatSentencesWithSpacing(text: string): string {
    const sentences = text
        .split(/(?<=[.!?])\s+/)
        .filter(sentence => sentence.trim().length > 0);

    let formatted = '';
    sentences.forEach((sentence, index) => {
        formatted += sentence.trim() + ' ';
        if ((index + 1) % 3 === 0) {
            formatted += '\n\n';
        }
    });
    return formatted.trim();
}

export function convertToTitleCase(text: string): string {
    return text
        .toLowerCase()
        .split(' ')
        .map(
            storyTitle =>
                storyTitle.charAt(0).toUpperCase() + storyTitle.slice(1)
        )
        .join(' ');
}
