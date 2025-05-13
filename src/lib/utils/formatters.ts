export function formatSentencesWithSpacing(text: string): string {
    const sentences = text
        .split('/(?<=[.!?]\s+/')
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